import { load } from '@fingerprintjs/fingerprintjs';
import {
    StorageProvider,
    UserIdentityOptions
} from '@/types';
import {
    CookieStorage,
    LocalStorageProvider,
    SessionStorageProvider,
    IndexedDBStorage
} from '@/lib/storageProviders.ts';

export class UserIdentityManager {
    private providers: StorageProvider[] = [];
    private storageKey: string;
    private enableLogging: boolean;
    private fingerprintCache: Map<string, string> = new Map();

    constructor(options: UserIdentityOptions = {}) {
        this.storageKey = options.storageKey || 'user_identity';
        // this.fingerprintJsKey = options.fingerprintJsKey || 'fingerprint_visitor';
        this.enableLogging = options.enableLogging || false;


        this.providers = [
            new LocalStorageProvider(),
            new SessionStorageProvider(),
            new CookieStorage(),
            new IndexedDBStorage()
        ];

        this.log('UserIdentityManager initialized');
    }

    private log(...args: any[]): void {
        if (this.enableLogging) {
            console.log('[UserIdentity]', ...args);
        }
    }

    private async getAllStoredIds(): Promise<Map<string, string>> {
        const results = new Map<string, string>();

        for (const provider of this.providers) {
            try {
                const id = await provider.get(this.storageKey);
                if (id) {
                    results.set(provider.constructor.name, id);
                    this.log(`Found ID in ${provider.constructor.name}:`, id);
                }
            } catch (e) {
                this.log(`Error reading from ${provider.constructor.name}:`, e);
            }
        }

        return results;
    }

    private async saveIdToAllProviders(id: string): Promise<void> {
        this.log('Saving ID to all providers:', id);

        const savePromises = this.providers.map(async (provider) => {
            try {
                await provider.set(this.storageKey, id);
                this.log(`Saved to ${provider.constructor.name}`);
            } catch (e) {
                this.log(`Error saving to ${provider.constructor.name}:`, e);
            }
        });

        await Promise.allSettled(savePromises);
    }

    private async generateFingerprint(): Promise<string> {
        try {
            const fp = await load({
                monitoring: false,
                delayFallback: 1000
            });

            const result = await fp.get();
            const visitorId = result.visitorId;

            this.fingerprintCache.set('confidence', String(result.confidence?.score || 1));
            this.fingerprintCache.set('components', JSON.stringify(result.components));

            this.log('Generated fingerprint:', visitorId);
            return visitorId;
        } catch (e) {
            this.log('Fingerprint generation failed, using fallback:', e);
            return this.generateFallbackId();
        }
    }

    private generateFallbackId(): string {
        const components = [
            navigator.userAgent,
            navigator.language,
            screen.width,
            screen.height,
            new Date().getTimezoneOffset(),
            navigator.hardwareConcurrency || 'unknown'
        ];

        const hash = btoa(components.join('|')).replace(/[^a-zA-Z0-9]/g, '');
        const fallbackId = `fallback_${hash.substring(0, 32)}`;

        this.log('Generated fallback ID:', fallbackId);
        return fallbackId;
    }

    async getUserId(): Promise<string> {
        const cachedId = this.fingerprintCache.get('userId');
        if (cachedId) {
            this.log('Returning cached ID:', cachedId);
            return cachedId;
        }

        const storedIds = await this.getAllStoredIds();

        if (storedIds.size > 0) {
            const firstId = storedIds.values().next().value;

            const uniqueIds = new Set(storedIds.values());
            if (firstId && uniqueIds.size > 1) {
                this.log('Inconsistent IDs found, using first and syncing');
                await this.syncAllProviders(firstId); // <- может быть undefiend
            }

            if (firstId) {
                this.fingerprintCache.set('userId', firstId);
                return firstId;
            }
        }

        this.log('No stored ID found, generating new fingerprint');
        const newId = await this.generateFingerprint();

        await this.saveIdToAllProviders(newId);

        this.fingerprintCache.set('userId', newId);
        return newId;
    }

    async syncAllProviders(id: string): Promise<void> {
        this.log('Syncing ID across all providers:', id);
        await this.saveIdToAllProviders(id);
    }

    async getIdentityForServer(): Promise<{
        visitorId: string;
        fingerprintConfidence: number;
        storageProviders: string[];
        metadata: Record<string, any>;
    }> {
        const visitorId = await this.getUserId();

        const storedIds = await this.getAllStoredIds();
        const activeProviders = Array.from(storedIds.keys());

        const metadata = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            fingerprintConfidence: this.fingerprintCache.get('confidence') || '1',
            fingerprintComponents: this.fingerprintCache.get('components'),
            timestamp: Date.now(),
            url: window.location.href,
            referrer: document.referrer
        };

        return {
            visitorId,
            fingerprintConfidence: parseFloat(this.fingerprintCache.get('confidence') || '1'),
            storageProviders: activeProviders,
            metadata
        };
    }

    async resetIdentity(): Promise<void> {
        this.log('Resetting identity from all providers');

        const resetPromises = this.providers.map(async (provider) => {
            try {
                await provider.delete(this.storageKey);
                this.log(`Cleared from ${provider.constructor.name}`);
            } catch (e) {
                this.log(`Error clearing from ${provider.constructor.name}:`, e);
            }
        });

        await Promise.allSettled(resetPromises);
        this.fingerprintCache.clear();
        this.log('Identity reset complete');
    }

    async checkStorageAvailability(): Promise<Record<string, boolean>> {
        const results: Record<string, boolean> = {};

        for (const provider of this.providers) {
            try {
                const testKey = `${this.storageKey}_test`;
                await provider.set(testKey, 'test');
                const value = await provider.get(testKey);
                await provider.delete(testKey);
                results[provider.constructor.name] = value === 'test';
            } catch (e) {
                results[provider.constructor.name] = false;
            }
        }

        return results;
    }
}

let userIdentityInstance: UserIdentityManager | null = null;

export function initUserIdentity(options?: UserIdentityOptions): UserIdentityManager {
    if (!userIdentityInstance) {
        userIdentityInstance = new UserIdentityManager(options);
    }
    return userIdentityInstance;
}

export async function getUserId(): Promise<string> {
    const manager = initUserIdentity();
    return manager.getUserId();
}
