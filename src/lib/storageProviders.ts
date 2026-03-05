import {StorageProvider} from "@/types";

export class CookieStorage implements StorageProvider {
    private expiryDays: number = 365

    async get(key: string): Promise<string | null> {
        const cookies = document.cookie.split('; ');
        const cookie = cookies.find(c => c.startsWith(`${key}=`));
        if (!cookie) return null;

        const value = cookie.split('=')[1];
        return decodeURIComponent(value);
    }

    async set(key: string, value: string): Promise<void> {
        const date = new Date();
        date.setTime(date.getTime() + this.expiryDays * 24 * 60 * 60 * 1000);
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${key}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax`;
    }

    async delete(key: string): Promise<void> {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}

export class LocalStorageProvider implements StorageProvider {
    async get(key: string): Promise<string | null> {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.warn('LocalStorage access failed:', e);
            return null;
        }
    }

    async set(key: string, value: string): Promise<void> {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.warn('LocalStorage write failed:', e);
        }
    }

    async delete(key: string): Promise<void> {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('LocalStorage delete failed:', e);
        }
    }
}

export class SessionStorageProvider implements StorageProvider {
    async get(key: string): Promise<string | null> {
        try {
            return sessionStorage.getItem(key);
        } catch (e) {
            console.warn('SessionStorage access failed:', e);
            return null;
        }
    }

    async set(key: string, value: string): Promise<void> {
        try {
            sessionStorage.setItem(key, value);
        } catch (e) {
            console.warn('SessionStorage write failed:', e);
        }
    }

    async delete(key: string): Promise<void> {
        try {
            sessionStorage.removeItem(key);
        } catch (e) {
            console.warn('SessionStorage delete failed:', e);
        }
    }
}

export class IndexedDBStorage implements StorageProvider {
    private dbName = 'UserIdentityDB';
    private storeName = 'identities';
    private db: IDBDatabase | null = null;

    private async getDB(): Promise<IDBDatabase> {
        if (this.db) return this.db;

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(request.result);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };
        });
    }

    async get(key: string): Promise<string | null> {
        try {
            const db = await this.getDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.storeName, 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.get(key);

                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result || null);
            });
        } catch (e) {
            console.warn('IndexedDB access failed:', e);
            return null;
        }
    }

    async set(key: string, value: string): Promise<void> {
        try {
            const db = await this.getDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.storeName, 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.put(value, key);

                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve();
            });
        } catch (e) {
            console.warn('IndexedDB write failed:', e);
        }
    }

    async delete(key: string): Promise<void> {
        try {
            const db = await this.getDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(this.storeName, 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.delete(key);

                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve();
            });
        } catch (e) {
            console.warn('IndexedDB delete failed:', e);
        }
    }
}
