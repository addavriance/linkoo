/**
 * wd (withDark) — авто-генерация Tailwind dark: вариантов для цветовых классов.
 *
 * Математика оттенков (инверсия по шкале 50–950):
 *   50  → 950/20   (очень светлый → очень тёмный с низкой прозрачностью)
 *   100 → 900/30
 *   200 → 800
 *   300 → 700
 *   400 → 600
 *   500 → 500      (нейтральный, не меняется)
 *   600 → 400
 *   700 → 300
 *   800 → 200
 *   900 → 100
 *   950 → 50
 *   white → gray-950
 *   black → white
 *
 * Явно заданная прозрачность (bg-blue-50/40) сохраняется как есть.
 * State-варианты (hover:, focus:, sm:) сохраняются: hover:bg-blue-100 → dark:hover:bg-blue-900/30
 *
 * @example
 * wd('from-blue-50 via-white to-purple-50')
 * // 'from-blue-50 dark:from-blue-950/20 via-white dark:via-gray-950 to-purple-50 dark:to-purple-950/20'
 *
 * wd('bg-rose-50 border-rose-200 text-rose-700')
 * // 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
 *
 * wd('hover:bg-indigo-100')
 * // 'hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
 *
 * // Совместимость с cn():
 * cn(wd('bg-blue-50 text-blue-700'), 'p-4 rounded-lg', isActive && 'ring-2')
 */


type DarkShade = { shade: number; opacity?: number };

const SHADE_MAP: Record<number, DarkShade> = {
    50:  { shade: 950, opacity: 20 },
    100: { shade: 900, opacity: 30 },
    200: { shade: 800 },
    300: { shade: 700 },
    400: { shade: 600 },
    500: { shade: 500 },
    600: { shade: 400 },
    700: { shade: 300 },
    800: { shade: 200 },
    900: { shade: 100 },
    950: { shade: 50  },
};

// Сортируем по убыванию длины чтобы regex не матчил «50» в «500»
const SHADES_RE_PART = Object.keys(SHADE_MAP)
    .sort((a, b) => b.length - a.length || parseInt(b) - parseInt(a))
    .join('|');

const SHADE_RE = new RegExp(`^(.+?)-(${SHADES_RE_PART})(\\/\\d+)?$`);
const WHITE_RE = /^(.+?)-white(\/\d+)?$/;
const BLACK_RE = /^(.+?)-black(\/\d+)?$/;


function toDark(cls: string): string | null {
    // Уже тёмный вариант или спец-значение — пропускаем
    if (cls.includes('dark:')) return null;
    if (cls.startsWith('[') || cls.startsWith('!')) return null;

    // Разбиваем hover:focus:bg-blue-50 на ['hover', 'focus', 'bg-blue-50']
    const segments = cls.split(':');
    const base = segments[segments.length - 1];
    const variants = segments.slice(0, -1); // ['hover', 'focus']
    const varStr = variants.length ? variants.join(':') + ':' : '';

    const sm = base.match(SHADE_RE);
    if (sm) {
        const [, prefix, shadeStr, explicitOpacity] = sm;
        const dark = SHADE_MAP[parseInt(shadeStr, 10)];
        if (!dark) return null;

        const opacity = explicitOpacity ?? (dark.opacity ? `/${dark.opacity}` : '');
        return `dark:${varStr}${prefix}-${dark.shade}${opacity}`;
    }

    const wm = base.match(WHITE_RE);
    if (wm) {
        return `dark:${varStr}${wm[1]}-gray-950${wm[2] ?? ''}`;
    }

    const bm = base.match(BLACK_RE);
    if (bm) {
        return `dark:${varStr}${bm[1]}-white${bm[2] ?? ''}`;
    }

    return null;
}


export function wd(...args: string[]): string {
    const result: string[] = [];

    for (const arg of args) {
        for (const token of arg.split(/\s+/).filter(Boolean)) {
            result.push(token);
            const dark = toDark(token);
            if (dark) result.push(dark);
        }
    }

    return result.join(' ');
}

export { wd as withDark };
