import LZString from 'lz-string';
import type { Card } from '@/types';

const LEGACY_DECOMP: Record<string, string> = {
    n:'name', t:'title', d:'description', e:'email', p:'phone', w:'website',
    a:'avatar', s:'socials', tg:'telegram', wa:'whatsapp', ig:'instagram',
    yt:'youtube', li:'linkedin', tw:'twitter', fb:'facebook', gh:'github',
    tk:'tiktok', dc:'discord', vk:'vk', cu:'custom', th:'theme', ct:'customTheme',
    co:'company', lo:'location', bd:'birthday', sk:'skills', lg:'languages',
    pf:'portfolio', rs:'resume', cl:'calendar', py:'payment',
    se:'showEmail', sp:'showPhone', sl:'showLocation',
};

export const decompressLegacy = (raw: string): Partial<Card> => {
    try {
        const json = LZString.decompressFromEncodedURIComponent(raw);
        if (!json) return {};
        const compressed = JSON.parse(json);
        const result: any = {};

        Object.entries(compressed).forEach(([k, v]) => {
            const key = LEGACY_DECOMP[k] ?? k;
            if (key === 'socials' && Array.isArray(v)) {
                result.socials = (v as any[]).map((obj: any) => {
                    const [[platform, link]] = Object.entries(obj);
                    return { platform: LEGACY_DECOMP[platform] ?? platform, link };
                });
            } else {
                result[key] = v;
            }
        });

        return result;
    } catch {
        return {};
    }
};
