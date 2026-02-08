import LZString from 'lz-string';
import type { Card } from '@/types';


interface ShortenResult {
  success: boolean;
  shortUrl?: string;
  slug?: string;
  error?: string;
}

const COMPRESSION_MAP: Record<string, string> = {
    name: 'n',
    title: 't',
    description: 'd',
    email: 'e',
    phone: 'p',
    website: 'w',
    avatar: 'a',

    socials: 's',
    telegram: 'tg',
    whatsapp: 'wa',
    instagram: 'ig',
    youtube: 'yt',
    linkedin: 'li',
    twitter: 'tw',
    facebook: 'fb',
    github: 'gh',
    tiktok: 'tk',
    discord: 'dc',
    vk: 'vk',
    custom: 'cu',

    theme: 'th',
    customTheme: 'ct',

    company: 'co',
    location: 'lo',
    birthday: 'bd',
    skills: 'sk',
    languages: 'lg',
    portfolio: 'pf',
    resume: 'rs',
    calendar: 'cl',
    payment: 'py',

    showEmail: 'se',
    showPhone: 'sp',
    showLocation: 'sl',
};

const DECOMPRESSION_MAP = Object.fromEntries(
    Object.entries(COMPRESSION_MAP).map(([key, value]) => [value, key])
);

const sanitizeData = (data: Partial<Card>): Partial<Card> => {
    const sanitized: any = {};

    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
            return;
        }

        switch (key) {
            case 'phone':
                const cleanPhone = String(value).replace(/[^\d+]/g, '');
                if (cleanPhone.length >= 10 && cleanPhone.length <= 15) {
                    sanitized[key] = cleanPhone;
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(String(value))) {
                    sanitized[key] = String(value).toLowerCase().trim();
                }
                break;

            case 'website':
                let cleanUrl = String(value).trim();
                if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
                    cleanUrl = 'https://' + cleanUrl;
                }
                try {
                    new URL(cleanUrl);
                    sanitized[key] = cleanUrl;
                } catch {
                }
                break;

            case 'socials':
                if (Array.isArray(value)) {
                    const validSocials = value
                        .filter(social => social && social.platform && social.link)
                        .map(social => ({
                            platform: String(social.platform).trim(),
                            link: String(social.link).trim()
                        }))
                        .filter(social => social.platform && social.link);

                    if (validSocials.length > 0) {
                        sanitized[key] = validSocials;
                    }
                }
                break;

            case 'name':
            case 'title':
            case 'description':
            case 'company':
            case 'location':
                const cleanString = String(value).trim().replace(/\s+/g, ' ');
                if (cleanString.length > 0) {
                    sanitized[key] = cleanString;
                }
                break;

            default:
                const cleanValue = String(value).trim();
                if (cleanValue.length > 0) {
                    sanitized[key] = cleanValue;
                }
        }
    });

    return sanitized;
};

const compressCardData = (data: Partial<Card>): string | null => {
    try {
        const sanitized = sanitizeData(data);

        if (Object.keys(sanitized).length === 0) {
            console.warn('Нет данных для сжатия');
            return null;
        }

        const compressed: Record<string, any> = {};

        Object.entries(sanitized).forEach(([key, value]) => {
            const compressedKey = COMPRESSION_MAP[key] || key;

            if (key === 'socials' && Array.isArray(value)) {
                const compressedSocials = value.map((social: any) => ({
                    [COMPRESSION_MAP[social.platform] || social.platform]: social.link
                }));
                compressed[compressedKey] = compressedSocials;
            } else {
                compressed[compressedKey] = value;
            }
        });

        const jsonString = JSON.stringify(compressed);

        const lzCompressed = LZString.compressToEncodedURIComponent(jsonString);

        return lzCompressed;

    } catch (error) {
        console.error('Ошибка сжатия данных:', error);
        return null;
    }
};

const decompressCardData = (compressedData: string): Partial<Card> => {
    try {
        if (!compressedData || typeof compressedData !== 'string') {
            return {};
        }

        const jsonString = LZString.decompressFromEncodedURIComponent(compressedData);

        if (!jsonString) {
            console.error('Не удалось распаковать данные');
            return {};
        }

        const compressed = JSON.parse(jsonString);
        const decompressed: Record<string, any> = {};

        Object.entries(compressed).forEach(([key, value]) => {
            const originalKey = DECOMPRESSION_MAP[key] || key;

            if (key === 's' && Array.isArray(value)) {
                decompressed.socials = value.map((socialObj: any) => {
                    const [[platform, link]] = Object.entries(socialObj);
                    return {
                        platform: DECOMPRESSION_MAP[platform] || platform,
                        link: link
                    };
                });
            } else {
                decompressed[originalKey] = value;
            }
        });

        return decompressed;

    } catch (error) {
        console.error('Ошибка распаковки данных:', error);
        return {};
    }
};

const generateCardUrl = (cardData: Partial<Card>, baseUrl = window.location.origin): string | null => {
    const compressed = compressCardData(cardData);
    if (!compressed) return null;

    const isGitHubPages = window.location.hostname.includes('github.io');
    const basePath = isGitHubPages ? '/linkoo/' : '/';

    return `${baseUrl}${basePath}view?card=${compressed}`;
};

const extractCardDataFromUrl = (url: string = window.location.href): Partial<Card> | null => {
    try {
        const urlObj = new URL(url);
        const cardParam = urlObj.searchParams.get('card') || urlObj.searchParams.get('c');

        if (!cardParam) {
            return null;
        }

        return decompressCardData(cardParam);

    } catch (error) {
        console.error('Ошибка извлечения данных из URL:', error);
        return null;
    }
};

const validatePhone = (phone: string): boolean => {
    if (!phone) return false;
    const cleaned = phone.replace(/[^\d+]/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15 && /^\+?[\d]+$/.test(cleaned);
};

const formatPhone = (phone: string): string => {
    if (!phone) return '';

    const cleaned = phone.replace(/[^\d+]/g, '');

    if (cleaned.startsWith('8') && cleaned.length === 11) {
        return '+7' + cleaned.slice(1);
    }

    if (/^[79]\d{10}$/.test(cleaned)) {
        return '+7' + cleaned.slice(1);
    }

    if (cleaned.startsWith('+')) {
        return cleaned;
    }

    return cleaned;
};


const shortenGuestCardUrl = async (url: string): Promise<ShortenResult> => {
    try {
        const urlObj = new URL(url);
        const rawData = urlObj.searchParams.get('card') || urlObj.searchParams.get('c');

        if (!rawData) {
            return {
                success: false,
                error: 'Не удалось извлечь данные из URL'
            };
        }

        const {api} = await import('@/lib/api');

        const link = await api.createGuestCardLink(rawData);

        const baseUrl = window.location.origin;
        const isGitHubPages = window.location.hostname.includes('github.io');
        const basePath = isGitHubPages ? '/linkoo/' : '/';
        const shortUrl = `${baseUrl}${basePath}${link.slug}`;

        return {
            success: true,
            shortUrl,
            slug: link.slug
        };

    } catch (error: any) {
        console.error('Ошибка создания короткой ссылки:', error);
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Не удалось создать короткую ссылку'
        };
    }
};


export {
    validatePhone,
    formatPhone,
    generateCardUrl,
    extractCardDataFromUrl,
    decompressCardData,
    shortenGuestCardUrl
};
