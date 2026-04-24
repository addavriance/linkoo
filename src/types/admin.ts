import type { LinkTargetType } from '@addavriance/linkoo_shared';
import type { TimeSeriesPoint } from './analytics';

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
