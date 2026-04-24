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
