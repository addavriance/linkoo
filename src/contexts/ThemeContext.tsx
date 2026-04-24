import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { STORAGE_KEYS } from '@/lib/constants';

type Theme = 'light' | 'dark' | 'system' | 'oled';
type ResolvedTheme = 'light' | 'dark' | 'oled';

interface ThemeContextValue {
    theme: Theme;
    setTheme: (t: Theme) => void;
    resolvedTheme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemPreference(): 'light' | 'dark' {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme, systemPreference: 'light' | 'dark') {
    const root = document.documentElement;
    root.classList.remove('dark', 'oled');

    if (theme === 'dark') {
        root.classList.add('dark');
    } else if (theme === 'system') {
        if (systemPreference === 'dark') {
            root.classList.add('dark');
        }
    } else if (theme === 'oled') {
        root.classList.add('dark', 'oled');
    }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => {
        const stored = localStorage.getItem(STORAGE_KEYS.THEME);
        if (stored && ['light', 'dark', 'system', 'oled'].includes(stored)) {
            return stored as Theme;
        }
        return 'system';
    });

    const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>(getSystemPreference);

    const setTheme = (t: Theme) => {
        setThemeState(t);
        localStorage.setItem(STORAGE_KEYS.THEME, t);
    };

    useEffect(() => {
        applyTheme(theme, systemPreference);
    }, [theme, systemPreference]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            setSystemPreference(e.matches ? 'dark' : 'light');
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const resolvedTheme: ResolvedTheme = (() => {
        if (theme === 'oled') return 'oled';
        if (theme === 'system') return systemPreference;
        return theme;
    })();

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
