import type { LinkTargetType } from '@addavriance/linkoo_shared';

export interface ShortenedLink {
    _id?: string;
    userId?: string;
    targetType: LinkTargetType;
    rawData?: string; // base64 compressed guest card data
    cardId?: string;
    slug: string;
    subdomain?: string;
    isActive?: boolean;
    expiresAt?: string;
    createdAt?: string;
    updatedAt?: string;
}
