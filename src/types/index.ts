// ============= Auth Types =============
export type OAuthProvider = 'google' | 'vk' | 'discord' | 'github' | 'max';
export type AccountType = 'free' | 'paid';

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
    email: string;
    provider: OAuthProvider;
    providerId: string;
    accountType: AccountType;
    profile: UserProfile;
    subscription?: Subscription;
    settings: UserSettings;
    lastLoginAt: string;
    createdAt: string;
    updatedAt: string;
}

// ============= Card Types =============
export type SocialPlatform =
    | 'telegram'
    | 'whatsapp'
    | 'instagram'
    | 'youtube'
    | 'linkedin'
    | 'twitter'
    | 'facebook'
    | 'github'
    | 'tiktok'
    | 'discord'
    | 'vk'
    | 'custom';

export interface Social {
    platform: SocialPlatform;
    link: string;
}

export interface CustomTheme {
    background: string;
    textColor: string;
    accentColor: string;
    backdrop?: string;
    border?: string;
}

export interface VisibilitySettings {
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
}

export interface Card {
    _id?: string;
    userId?: string;
    name: string;
    title?: string;
    description?: string;
    email?: string;
    phone?: string;
    website?: string;
    company?: string;
    location?: string;
    avatar?: string;
    socials: Social[];
    theme: string;
    customTheme?: CustomTheme;
    visibility: VisibilitySettings;
    isActive?: boolean;
    isPublic?: boolean;
    viewCount?: number;
    lastViewedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    slug?: string; // Короткая ссылка для карточки
}

// ============= Link Types =============
export type LinkTargetType = 'url' | 'card';

export interface ShortenedLink {
    _id?: string;
    userId?: string;
    targetType: LinkTargetType;
    rawData?: string; // base64 compressed data for guest cards
    cardId?: string;
    slug: string;
    subdomain?: string;
    clickCount?: number;
    isActive?: boolean;
    expiresAt?: string;
    createdAt?: string;
    updatedAt?: string;
}

// ============= API Response Types =============
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
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

export interface PaymentStatus {
    id: string;
    status: string;
    paid: boolean;
}

// ============= Payment Types =============
export interface Payment {
    _id: string;
    amount: number;
    currency: string;
    status: SubscriptionStatus;
    paid: boolean;
    plan?: SubscriptionPlan;
    description?: string;
    createdAt: string;
    paymentMethod?: PaymentMethod
}

export type SubscriptionPlan = 'monthly' | 'yearly';

export type SubscriptionStatus = 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled';

export interface PaymentMethod {
    id: string;
    type: string;
    saved: boolean;
    status?: string;
    title?: string;
    card?: {
        first6: string;
        last4: string;
        expiry_year: string;
        expiry_month: string;
        card_type: string;
        issuer_country?: string;
    };
    addedAt?: string;
}

export interface PaymentCreation {
    plan: SubscriptionPlan;
}

export interface PaymentResponse {
    idempotenceKey: string;
    id: string;
    status: string;
    confirmation_url: string;
}

// ============= Local Card Data (for guest mode, по факту пока не используется) =============
export interface LocalCardData extends Omit<Card, '_id' | 'userId' | 'createdAt' | 'updatedAt' | 'viewCount' | 'lastViewedAt'> {
    // Card data stored in URL for guest users
}

// ============= Theme Types =============
export interface ThemeOption {
    id: string;
    name: string;
    category: 'light' | 'dark' | 'colorful' | 'gradient';
    isPremium?: boolean;
    preview?: {
        background: string;
        textColor: string;
        accentColor: string;
    };
}
