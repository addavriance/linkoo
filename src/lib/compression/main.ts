import type { Card, Social, CustomTheme } from '@/types';
import { ByteWriter, ByteReader } from '../byteUtils.ts';
import { toBase64url, fromBase64url } from '../base64.ts';
import { decompressLegacy } from './legacy';

const SCHEMA_VERSION = 2;

// Append-only never reorder or remove.
const STRING_FIELDS = [
    'name', 'title', 'description', 'email', 'phone', 'website',
    'company', 'location', 'avatar',
    'birthday', 'resume', 'calendar', 'payment',
] as const satisfies ReadonlyArray<keyof Card | string>;

const SOCIAL_PLATFORMS = [
    'telegram', 'whatsapp', 'instagram', 'youtube', 'linkedin',
    'twitter', 'facebook', 'github', 'tiktok', 'discord', 'vk', 'custom',
] as const;

const CUSTOM_THEME_FIELDS: (keyof CustomTheme)[] = [
    'background', 'textColor', 'accentColor', 'backdrop', 'border',
];

const PRESENCE_THEME = 13;
const PRESENCE_CUSTOM_THEME = 14;


const encodeCard = (data: Partial<Card>): string => {
    const w = new ByteWriter();

    w.u8(SCHEMA_VERSION);

    let presence = 0;
    STRING_FIELDS.forEach((field, i) => {
        if (data[field as keyof Card]) presence |= (1 << i);
    });
    if (data.theme) presence |= (1 << PRESENCE_THEME);
    if (data.customTheme) presence |= (1 << PRESENCE_CUSTOM_THEME);
    w.u16le(presence);

    STRING_FIELDS.forEach((field, i) => {
        if (presence & (1 << i)) {
            w.str(String(data[field as keyof Card]));
        }
    });

    if (data.theme) w.str(data.theme);

    if (data.customTheme) {
        CUSTOM_THEME_FIELDS.forEach(f => {
            w.str(data.customTheme![f] ?? '');
        });
    }

    const vis = data.visibility;
    const visFlags =
        (vis?.showEmail ? 1 : 0) |
        (vis?.showPhone ? 2 : 0) |
        (vis?.showLocation ? 4 : 0);
    w.u8(visFlags);

    const socials = data.socials ?? [];
    w.u8(Math.min(socials.length, 255));
    for (const s of socials.slice(0, 255)) {
        const idx = SOCIAL_PLATFORMS.indexOf(s.platform as typeof SOCIAL_PLATFORMS[number]);
        w.u8(idx >= 0 ? idx : 255);
        w.str(s.link);
    }

    return '_' + toBase64url(w.toUint8Array());
};

// Decode

const decodeBinary = (bytes: Uint8Array): Partial<Card> => {
    const r = new ByteReader(bytes);
    const version = r.u8();

    if (version !== SCHEMA_VERSION) return {};

    const presence = r.u16le();
    const result: any = {};

    STRING_FIELDS.forEach((field, i) => {
        if (presence & (1 << i)) {
            result[field] = r.str();
        }
    });

    if (presence & (1 << PRESENCE_THEME)) {
        result.theme = r.str();
    }

    if (presence & (1 << PRESENCE_CUSTOM_THEME)) {
        const ct: any = {};
        CUSTOM_THEME_FIELDS.forEach(f => {
            const v = r.str();
            if (v) ct[f] = v;
        });
        result.customTheme = ct as CustomTheme;
    }

    const visFlags = r.u8();
    result.visibility = {
        showEmail: !!(visFlags & 1),
        showPhone: !!(visFlags & 2),
        showLocation: !!(visFlags & 4),
    };

    const count = r.u8();
    const socials: Social[] = [];
    for (let i = 0; i < count; i++) {
        const idx = r.u8();
        const link = r.str();
        const platform = idx < SOCIAL_PLATFORMS.length
            ? SOCIAL_PLATFORMS[idx]
            : 'custom';
        socials.push({ platform, link });
    }
    result.socials = socials;

    return result as Partial<Card>;
};

// Public API

export const compressCardData = (data: Partial<Card>): string | null => {
    try {
        return encodeCard(data);
    } catch {
        return null;
    }
};

export const decompressCardData = (raw: string): Partial<Card> => {
    if (!raw) return {};
    try {
        if (raw.startsWith('_')) {
            return decodeBinary(fromBase64url(raw.slice(1)));
        }
        return decompressLegacy(raw);
    } catch {
        return {};
    }
};

export const generateCardUrl = (cardData: Partial<Card>, baseUrl = window.location.origin): string | null => {
    const compressed = compressCardData(cardData);
    if (!compressed) return null;
    return `${baseUrl}/view?card=${compressed}`;
};

export const extractCardDataFromUrl = (url: string = window.location.href): Partial<Card> | null => {
    try {
        const urlObj = new URL(url);
        const cardParam = urlObj.searchParams.get('card') || urlObj.searchParams.get('c');
        if (!cardParam) return null;
        return decompressCardData(cardParam);
    } catch {
        return null;
    }
};
