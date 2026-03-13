import { describe, it, expect } from 'vitest';
import { wd } from '../wd';

// Shade inversion

describe('wd() — shade inversion', () => {
    it('50 → 950/20, 100 → 900/30 (light shades get opacity)', () => {
        expect(wd('bg-blue-50')).toBe('bg-blue-50 dark:bg-blue-950/20');
        expect(wd('bg-blue-100')).toBe('bg-blue-100 dark:bg-blue-900/30');
    });

    it('200–400 → 800–600 (no opacity)', () => {
        expect(wd('border-rose-200')).toBe('border-rose-200 dark:border-rose-800');
        expect(wd('text-gray-300')).toBe('text-gray-300 dark:text-gray-700');
        expect(wd('bg-indigo-400')).toBe('bg-indigo-400 dark:bg-indigo-600');
    });

    it('500 → 500 (neutral, maps to itself)', () => {
        expect(wd('bg-blue-500')).toBe('bg-blue-500 dark:bg-blue-500');
    });

    it('600–800 → 400–200 (dark shades invert to light)', () => {
        expect(wd('text-gray-600')).toBe('text-gray-600 dark:text-gray-400');
        expect(wd('text-blue-700')).toBe('text-blue-700 dark:text-blue-300');
        expect(wd('bg-slate-800')).toBe('bg-slate-800 dark:bg-slate-200');
    });

    it('900 → 100, 950 → 50', () => {
        expect(wd('text-gray-900')).toBe('text-gray-900 dark:text-gray-100');
        expect(wd('bg-gray-950')).toBe('bg-gray-950 dark:bg-gray-50');
    });
});

// white / black

describe('wd() — white / black', () => {
    it('bg-white → dark:bg-gray-950', () => {
        expect(wd('bg-white')).toBe('bg-white dark:bg-gray-950');
    });

    it('text-white → dark:text-gray-950', () => {
        expect(wd('text-white')).toBe('text-white dark:text-gray-950');
    });

    it('via-white → dark:via-gray-950', () => {
        expect(wd('via-white')).toBe('via-white dark:via-gray-950');
    });

    it('text-black → dark:text-white', () => {
        expect(wd('text-black')).toBe('text-black dark:text-white');
    });

    it('bg-black → dark:bg-white', () => {
        expect(wd('bg-black')).toBe('bg-black dark:bg-white');
    });
});

// Explicit opacity

describe('wd() — explicit opacity is preserved', () => {
    it('bg-blue-50/40 keeps /40 in both sides', () => {
        expect(wd('bg-blue-50/40')).toBe('bg-blue-50/40 dark:bg-blue-950/40');
    });

    it('bg-blue-100/60 keeps /60 (overrides default /30)', () => {
        expect(wd('bg-blue-100/60')).toBe('bg-blue-100/60 dark:bg-blue-900/60');
    });

    it('text-white/80 maps correctly', () => {
        expect(wd('text-white/80')).toBe('text-white/80 dark:text-gray-950/80');
    });
});

// State variants

describe('wd() — state variants (hover:, focus:, sm:, etc.)', () => {
    it('hover: is preserved in dark counterpart', () => {
        expect(wd('hover:bg-indigo-100')).toBe('hover:bg-indigo-100 dark:hover:bg-indigo-900/30');
    });

    it('focus: is preserved', () => {
        expect(wd('focus:text-blue-600')).toBe('focus:text-blue-600 dark:focus:text-blue-400');
    });

    it('multiple chained variants (hover:focus:) are preserved', () => {
        expect(wd('hover:focus:bg-blue-50')).toBe('hover:focus:bg-blue-50 dark:hover:focus:bg-blue-950/20');
    });

    it('responsive prefix (sm:) is preserved', () => {
        expect(wd('sm:bg-gray-100')).toBe('sm:bg-gray-100 dark:sm:bg-gray-900/30');
    });
});

// Non-color classes pass through unchanged

describe('wd() — non-color classes are not modified', () => {
    it('layout/spacing classes pass through as-is', () => {
        expect(wd('p-4')).toBe('p-4');
        expect(wd('rounded-lg')).toBe('rounded-lg');
        expect(wd('flex items-center')).toBe('flex items-center');
    });

    it('already dark:-prefixed classes are skipped', () => {
        expect(wd('dark:bg-gray-900')).toBe('dark:bg-gray-900');
        expect(wd('dark:text-white')).toBe('dark:text-white');
    });

    it('arbitrary value classes [..] are not processed', () => {
        expect(wd('[color:var(--fg)]')).toBe('[color:var(--fg)]');
    });

    it('accent/fixed colors without shade number pass through', () => {
        expect(wd('text-inherit')).toBe('text-inherit');
        expect(wd('bg-transparent')).toBe('bg-transparent');
    });
});

// Multiple classes & multiple args

describe('wd() — multiple classes and arguments', () => {
    it('multiple space-separated classes expand correctly', () => {
        expect(wd('bg-rose-50 border-rose-200 text-rose-700')).toBe(
            'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300',
        );
    });

    it('multiple string args are joined', () => {
        expect(wd('bg-blue-50', 'text-blue-700')).toBe(
            'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300',
        );
    });

    it('gradient triple: from-blue-50 via-white to-purple-50 (docs example)', () => {
        expect(wd('from-blue-50 via-white to-purple-50')).toBe(
            'from-blue-50 dark:from-blue-950/20 via-white dark:via-gray-950 to-purple-50 dark:to-purple-950/20',
        );
    });

    it('mixed: color + non-color classes', () => {
        expect(wd('p-4 bg-blue-50 rounded-lg text-gray-900')).toBe(
            'p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-gray-900 dark:text-gray-100',
        );
    });
});
