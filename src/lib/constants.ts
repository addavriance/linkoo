import { cardThemes } from '@/lib/themes';

// localStorage keys

export const STORAGE_KEYS = {
    USER_CACHE:       'linkoo-user-cache',
    THEME:            'linkoo-theme',
    COOKIE_CONSENT:   'linkoo_cookie_consent',
    SELECTED_THEME:   'linkoo_selected_theme',
    DRAFT:            'linkoo_draft',
    ACCESS_TOKEN:     'accessToken',
    REFRESH_TOKEN:    'refreshToken',
    TOKEN_EXPIRES_AT: 'tokenExpiresAt',
} as const;

// App config

export const BASE_DOMAIN = import.meta.env.VITE_BASE_DOMAIN || 'linkoo.dev';

// Upload limits

export const AVATAR_MAX_MB   = 5;
export const IMAGE_MAX_MB    = 10;
export const IMAGE_MAX_BYTES = IMAGE_MAX_MB * 1024 * 1024;

// Admin pagination & search

export const ADMIN_PAGE_SIZE    = 20;
export const SEARCH_DEBOUNCE_MS = 300;

// Theme access by account type

export const FREE_THEME_IDS  = Object.keys(cardThemes).slice(0, 5);
export const GUEST_THEME_IDS = Object.keys(cardThemes).slice(0, 1);

// UI

export const LINKOO_LOGO_URL = '/icon.png';

// Map defaults (Moscow)

export const DEFAULT_MAP_CENTER = { lat: 55.7558, lng: 37.6176 };
export const DEFAULT_MAP_ZOOM   = 10;
