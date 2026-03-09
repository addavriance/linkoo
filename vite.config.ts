import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import compression from 'vite-plugin-compression'

// ─── wd: variant transform ───────────────────────────────────────────────────
//
// Трансформирует wd: синтаксис в dark: варианты прямо в исходном коде при сборке.
//
// Синтаксисы:
//   wd:bg-red-50                   -> bg-red-50 dark:bg-red-950/20
//   wd:hover:text-blue-700         -> hover:text-blue-700 dark:hover:text-blue-300
//   wd:(bg-red-50 hover:text-blue-700)
//     -> bg-red-50 dark:bg-red-950/20 hover:text-blue-700 dark:hover:text-blue-300
//
// Если у класса нет тёмного эквивалента (напр. wd:p-4) — убирает wd: и оставляет как есть.

const WD_SHADE_MAP: Record<number, { shade: number; opacity?: number }> = {
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

const _SHADES = Object.keys(WD_SHADE_MAP)
    .sort((a, b) => b.length - a.length || parseInt(b) - parseInt(a))
    .join('|');
const SHADE_RE = new RegExp(`^(.+?)-(${_SHADES})(\\/\\d+)?$`);
const WHITE_RE = /^(.+?)-white(\/\d+)?$/;
const BLACK_RE = /^(.+?)-black(\/\d+)?$/;

function wdInvert(cls: string): string | null {
    const segs  = cls.split(':');
    const base  = segs[segs.length - 1];
    const varStr = segs.length > 1 ? segs.slice(0, -1).join(':') + ':' : '';

    const sm = base.match(SHADE_RE);
    if (sm) {
        const [, pfx, shadeStr, op] = sm;
        const d = WD_SHADE_MAP[+shadeStr];
        if (!d) return null;
        return `dark:${varStr}${pfx}-${d.shade}${op ?? (d.opacity ? `/${d.opacity}` : '')}`;
    }
    const wm = base.match(WHITE_RE);
    if (wm) return `dark:${varStr}${wm[1]}-gray-950${wm[2] ?? ''}`;
    const bm = base.match(BLACK_RE);
    if (bm) return `dark:${varStr}${bm[1]}-white${bm[2] ?? ''}`;
    return null;
}

// wd:cls -> "cls dark:invertedCls"  (или просто "cls" если нет инверсии)
function expand(cls: string): string {
    const dark = wdInvert(cls);
    return dark ? `${cls} ${dark}` : cls;
}

function wdVariantPlugin(): Plugin {
    // группа:  wd:(class1 class2 ...)
    const GROUP_RE  = /\bwd:\(([^)]+)\)/g;
    // одиночный: wd:class  или  wd:hover:class  или  wd:sm:hover:class
    const SINGLE_RE = /\bwd:((?:[\w-]+:)*[\w\-/[\].]+)/g;

    return {
        name: 'wd-variant',
        transform(code, id) {
            if (!/\.(tsx?|jsx?)$/.test(id) || !code.includes('wd:')) return null;

            const result = code
                .replace(GROUP_RE,  (_, group: string) =>
                    group.trim().split(/\s+/).map(expand).join(' ')
                )
                .replace(SINGLE_RE, (_, cls: string) => expand(cls));

            return { code: result, map: null };
        },
    };
}

// ─── config ──────────────────────────────────────────────────────────────────

export default defineConfig({
    plugins: [
        wdVariantPlugin(),
        react(),
        compression({ algorithm: 'brotliCompress', ext: '.br' }),
        compression({ algorithm: 'gzip', ext: '.gz' }),
    ],
    base: '/',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        open: true,
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                    'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-select', '@radix-ui/react-slot', '@radix-ui/react-switch', '@radix-ui/react-tabs', '@radix-ui/react-toast', '@radix-ui/react-tooltip', 'lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge'],
                    'vendor-charts': ['recharts'],
                    'vendor-motion': ['framer-motion'],
                    'vendor-map': ['leaflet'],
                },
            },
        },
    },
})
