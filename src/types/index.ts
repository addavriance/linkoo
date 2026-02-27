// ============= Auth Types =============
export type OAuthProvider = 'google' | 'vk' | 'discord' | 'github' | 'max';
export type AccountType = 'free' | 'paid';
export type UserRole = 'user' | 'moderator' | 'admin';

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
    subdomain?: string;
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

export interface SessionResponse {
    _id: string;
    userId: string;
    token: string;
    deviceInfo: string;
    ipAddress: string;
    createdAt: string;
}

// ============= Local Card Data (for guest mode, по факту пока не используется) =============
export interface LocalCardData extends Omit<Card, '_id' | 'userId' | 'createdAt' | 'updatedAt' | 'viewCount' | 'lastViewedAt'> {
    // Card data stored in URL for guest users
}

// ============= Analytics Types =============

export type InteractionType =
    | 'social_click'
    | 'contact_save'
    | 'share'
    | 'website_click'
    | 'email_click'
    | 'phone_click';

export interface TimeSeriesPoint {
    date: string;
    count: number;
}

export interface CountryPoint {
    country: string;
    count: number;
}

export interface BreakdownPoint {
    name: string;
    value: number;
}

export interface SocialClickPoint {
    platform: string;
    count: number;
}

export interface RecentActivityItem {
    type: InteractionType;
    platform?: string;
    timestamp: string;
    country?: string;
    device?: string;
}

export interface PremiumAnalytics {
    viewCount: number;
    uniqueCountries: number;
    contactSaves: number;
    viewsTimeSeries: TimeSeriesPoint[];
    topCountries: CountryPoint[];
    deviceBreakdown: BreakdownPoint[];
    browserBreakdown: BreakdownPoint[];
    interactionSummary: {
        contactSaves: number;
        shares: number;
        websiteClicks: number;
        emailClicks: number;
        phoneClicks: number;
        socialClicks: SocialClickPoint[];
    };
    recentActivity: RecentActivityItem[];
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

// ============= Admin Types =============
export interface AdminStats {
    totalUsers: number;
    freeUsers: number;
    paidUsers: number;
    totalCards: number;
    activeCards: number;
    totalLinks: number;
    newUsersLast30d: TimeSeriesPoint[];
    newCardsLast30d: TimeSeriesPoint[];
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface AdminCard {
    _id: string;
    userId: { _id: string; profile: { name: string }; email?: string } | string;
    name: string;
    isActive: boolean;
    isPublic: boolean;
    viewCount: number;
    subdomain?: string;
    slug?: string;
    createdAt: string;
}

export interface AdminLink {
    _id: string;
    userId: { _id: string; profile: { name: string }; email?: string } | string;
    slug: string;
    targetType: LinkTargetType;
    isActive: boolean;
    createdAt: string;
}
