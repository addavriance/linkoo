import type { OAuthProvider, AccountType, UserRole } from '@addavriance/linkoo_shared';

export interface UserProfile {
    name: string;
    avatar?: string;
    locale?: string;
}

export interface Subscription {
    plan: string;
    expiresAt: string;
    stripeCustomerId?: string;
}

export interface UserSettings {
    emailNotifications: boolean;
    language: string;
}

export interface User {
    _id: string;
    email?: string;
    phone?: string;
    provider: OAuthProvider;
    providerId: string;
    accountType: AccountType;
    role: UserRole;
    isActive?: boolean;
    profile: UserProfile;
    subscription?: Subscription;
    settings: UserSettings;
    lastLoginAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface AuthResponse {
    user: User;
    tokens: AuthTokens;
}

export interface SessionResponse {
    _id: string;
    userId: string;
    token: string;
    deviceInfo: string;
    ipAddress: string;
    createdAt: string;
}

export interface StorageProvider {
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    delete(key: string): Promise<void>;
}

export interface UserIdentityOptions {
    storageKey?: string;
    fingerprintJsKey?: string;
    cookieExpiryDays?: number;
    enableLogging?: boolean;
}
