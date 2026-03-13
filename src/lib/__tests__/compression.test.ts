import { describe, it, expect } from 'vitest';
import LZString from 'lz-string';
import { validatePhone, formatPhone, decompressCardData } from '../compression';

// validatePhone

describe('validatePhone', () => {
    it('accepts standard Russian number with +7', () => {
        expect(validatePhone('+79161234567')).toBe(true);
    });

    it('accepts number with spaces and dashes formatting', () => {
        expect(validatePhone('+7 (916) 123-45-67')).toBe(true);
    });

    it('accepts international format', () => {
        expect(validatePhone('+12025551234')).toBe(true);
    });

    it('accepts short valid number (7 digits)', () => {
        expect(validatePhone('1234567')).toBe(true);
    });

    it('rejects empty string', () => {
        expect(validatePhone('')).toBe(false);
    });

    it('rejects too short (< 7 clean digits)', () => {
        expect(validatePhone('+123')).toBe(false);
        expect(validatePhone('123456')).toBe(false);
    });

    it('rejects too long (> 16 clean digits)', () => {
        expect(validatePhone('+12345678901234567')).toBe(false);
    });

    it('rejects non-numeric garbage', () => {
        expect(validatePhone('not-a-phone')).toBe(false);
    });
});

// formatPhone

describe('formatPhone', () => {
    it('converts 8XXXXXXXXXX (11 digits starting with 8) → +7XXXXXXXXXX', () => {
        expect(formatPhone('89161234567')).toBe('+79161234567');
    });

    it('converts 7XXXXXXXXXX (11 digits starting with 7) → +7XXXXXXXXXX', () => {
        expect(formatPhone('79161234567')).toBe('+79161234567');
    });

    it('leaves already formatted +7... unchanged', () => {
        expect(formatPhone('+79161234567')).toBe('+79161234567');
    });

    it('strips spaces, dashes, parentheses but keeps digits and leading +', () => {
        expect(formatPhone('+7 (916) 123-45-67')).toBe('+79161234567');
    });

    it('leaves non-Russian international format as-is (stripped but with +)', () => {
        expect(formatPhone('+1-202-555-1234')).toBe('+12025551234');
    });

    it('returns empty string for empty input', () => {
        expect(formatPhone('')).toBe('');
    });
});

// decompressCardData

describe('decompressCardData', () => {
    it('returns empty object for empty string', () => {
        expect(decompressCardData('')).toEqual({});
    });

    it('returns empty object for invalid/garbage input', () => {
        expect(decompressCardData('not-valid-lz-string!!!')).toEqual({});
    });

    it('decompresses short keys back to full field names', () => {
        // Simulate what compressCardData produces: short keys { n, t, e }
        const payload = { n: 'John Doe', t: 'Developer', e: 'john@example.com' };
        const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(payload));

        const result = decompressCardData(compressed);

        expect(result.name).toBe('John Doe');
        expect(result.title).toBe('Developer');
        expect(result.email).toBe('john@example.com');
    });

    it('decompresses socials array with platform short keys', () => {
        // { s: [{ gh: 'https://github.com/test' }] }
        const payload = { s: [{ gh: 'https://github.com/test' }, { tg: 'https://t.me/test' }] };
        const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(payload));

        const result = decompressCardData(compressed);

        expect(result.socials).toEqual([
            { platform: 'github', link: 'https://github.com/test' },
            { platform: 'telegram', link: 'https://t.me/test' },
        ]);
    });

    it('unknown short keys are passed through unchanged', () => {
        const payload = { unknownkey: 'value' };
        const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(payload));

        const result = decompressCardData(compressed);

        expect((result as any).unknownkey).toBe('value');
    });

    it('full roundtrip: all common fields survive compress → decompress', () => {
        // Manually build the compressed payload with all short keys from COMPRESSION_MAP
        const payload = {
            n: 'Alice',
            t: 'CTO',
            d: 'Building things',
            e: 'alice@example.com',
            p: '+79001234567',
            w: 'https://alice.dev',
            co: 'Acme Inc',
            lo: 'Moscow',
        };
        const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(payload));
        const result = decompressCardData(compressed);

        expect(result.name).toBe('Alice');
        expect(result.title).toBe('CTO');
        expect(result.description).toBe('Building things');
        expect(result.email).toBe('alice@example.com');
        expect(result.phone).toBe('+79001234567');
        expect(result.website).toBe('https://alice.dev');
        expect(result.company).toBe('Acme Inc');
        expect(result.location).toBe('Moscow');
    });
});
