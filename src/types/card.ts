import type { SocialPlatform } from '@addavriance/linkoo_shared';

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
    slug?: string;
}

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
