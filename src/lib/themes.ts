export interface Theme {
  id: string;
  name: string;
  category: 'gradient' | 'solid' | 'light' | 'glass' | 'custom';
  background: string;
  textColor: string;
  accentColor: string;
  icon?: string; // Lucide icon name
  popular?: boolean;
  backdrop?: string;
  border?: string;
  isCustom?: boolean;
}

// Локальные пресеты, могут дополняться с бекенда в будущем
export const cardThemes: Record<string, Theme> = {
    // Градиентные темы
    gradient_ocean: {
        id: 'gradient_ocean',
        name: 'Ocean Wave',
        category: 'gradient',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textColor: '#ffffff',
        accentColor: '#ffffff',
        icon: 'Waves',
        popular: true,
    }, gradient_sunset: {
        id: 'gradient_sunset',
        name: 'Sunset Glow',
        category: 'gradient',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        textColor: '#ffffff',
        accentColor: '#ffffff',
        icon: 'Sunrise',
        popular: true,
    }, gradient_forest: {
        id: 'gradient_forest',
        name: 'Forest Green',
        category: 'gradient',
        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        textColor: '#ffffff',
        accentColor: '#ffffff',
        icon: 'TreePine',
    }, gradient_space: {
        id: 'gradient_space',
        name: 'Space Dream',
        category: 'gradient',
        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        textColor: '#1f2937',
        accentColor: '#374151',
        icon: 'Sparkles',
    }, gradient_fire: {
        id: 'gradient_fire',
        name: 'Fire Burst',
        category: 'gradient',
        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        textColor: '#ffffff',
        accentColor: '#ffffff',
        icon: 'Flame',
    }, gradient_royal: {
        id: 'gradient_royal',
        name: 'Royal Purple',
        category: 'gradient',
        background: 'linear-gradient(135deg, #4B006E 0%, #7851A9 100%)',
        textColor: '#ffffff',
        accentColor: '#ffffff',
        icon: 'Crown',
    },

    // Однотонные темы
    solid_midnight: {
        id: 'solid_midnight',
        name: 'Midnight Black',
        category: 'solid',
        background: '#1a1a1a',
        textColor: '#ffffff',
        accentColor: '#f3f4f6',
        icon: 'Moon',
    }, solid_ocean: {
        id: 'solid_ocean',
        name: 'Deep Ocean',
        category: 'solid',
        background: '#0ea5e9',
        textColor: '#ffffff',
        accentColor: '#ffffff',
        icon: 'Waves',
    }, solid_emerald: {
        id: 'solid_emerald',
        name: 'Emerald Green',
        category: 'solid',
        background: '#10b981',
        textColor: '#ffffff',
        accentColor: '#ffffff',
        icon: 'Gem',
    }, solid_rose: {
        id: 'solid_rose',
        name: 'Rose Pink',
        category: 'solid',
        background: '#f43f5e',
        textColor: '#ffffff',
        accentColor: '#ffffff',
        icon: 'Flower2',
    }, solid_amber: {
        id: 'solid_amber',
        name: 'Golden Amber',
        category: 'solid',
        background: '#f59e0b',
        textColor: '#ffffff',
        accentColor: '#ffffff',
        icon: 'Sun',
    }, solid_indigo: {
        id: 'solid_indigo',
        name: 'Royal Indigo',
        category: 'solid',
        background: '#6366f1',
        textColor: '#ffffff',
        accentColor: '#ffffff',
        icon: 'Sparkle',
    },

    // Светлые темы
    light_minimal: {
        id: 'light_minimal',
        name: 'Clean White',
        category: 'light',
        background: '#ffffff',
        textColor: '#1f2937',
        accentColor: '#6b7280',
        icon: 'Heart',
        popular: true,
    }, light_cream: {
        id: 'light_cream',
        name: 'Warm Cream',
        category: 'light',
        background: '#fef7ed',
        textColor: '#92400e',
        accentColor: '#b45309',
        icon: 'Droplet',
    }, light_sky: {
        id: 'light_sky',
        name: 'Sky Blue',
        category: 'light',
        background: '#f0f9ff',
        textColor: '#0c4a6e',
        accentColor: '#0284c7',
        icon: 'Cloud',
    }, light_mint: {
        id: 'light_mint',
        name: 'Fresh Mint',
        category: 'light',
        background: '#f0fdf4',
        textColor: '#14532d',
        accentColor: '#16a34a',
        icon: 'Leaf',
    },

    // Стеклянные эффекты
    glass_dark: {
        id: 'glass_dark',
        name: 'Dark Glass',
        category: 'glass',
        background: 'rgba(17, 24, 39, 0.8)',
        textColor: '#ffffff',
        accentColor: '#f3f4f6',
        icon: 'Eye',
        backdrop: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    }, glass_light: {
        id: 'glass_light',
        name: 'Light Glass',
        category: 'glass',
        background: 'rgba(255, 255, 255, 0.8)',
        textColor: '#1f2937',
        accentColor: '#374151',
        icon: 'Sparkles',
        backdrop: 'blur(12px)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
    }, glass_ocean: {
        id: 'glass_ocean',
        name: 'Ocean Glass',
        category: 'glass',
        background: 'rgba(14, 165, 233, 0.8)',
        textColor: '#ffffff',
        accentColor: '#ffffff',
        icon: 'Waves',
        backdrop: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
    },
};

// Категории тем
export const themeCategories = {
    gradient: {
        name: 'Градиенты', icon: 'Palette', description: 'Яркие градиентные переходы',
    }, solid: {
        name: 'Однотонные', icon: 'Paintbrush', description: 'Классические однотонные цвета',
    }, light: {
        name: 'Светлые', icon: 'Sun', description: 'Светлые и чистые тона',
    }, glass: {
        name: 'Стекло', icon: 'Eye', description: 'Прозрачные стеклянные эффекты',
    }, custom: {
        name: 'Кастомные', icon: 'Sparkles', description: 'Пользовательские темы',
    },
};

export const popularThemes = Object.values(cardThemes).filter(theme => theme.popular);

export const getThemeById = (themeId: string): Theme => {
    return cardThemes[themeId] || cardThemes.light_minimal;
};

export const getThemesByCategory = (category: string): Theme[] => {
    return Object.values(cardThemes).filter(theme => theme.category === category);
};

export const applyThemeStyles = (theme: Theme): React.CSSProperties => {
    const styles: any = {
        background: theme.background, color: theme.textColor,
    };

    // Добавляем стеклянные эффекты если есть
    if (theme.backdrop) {
        styles.backdropFilter = theme.backdrop;
        styles.WebkitBackdropFilter = theme.backdrop;
    }

    if (theme.border) {
        styles.border = theme.border;
    }

    return styles;
};

// Проверить контрастность текста
export const getTextContrast = (backgroundColor: string): string => {
    // Простая проверка - если фон тёмный, текст светлый и наоборот
    const isDark = backgroundColor.includes('rgb(') ? backgroundColor.includes('0.8') || backgroundColor.includes('0.9') : !backgroundColor.includes('#f') && !backgroundColor.includes('light');

    return isDark ? '#ffffff' : '#1f2937';
};

// Сохранить кастомную тему в localStorage
export const saveCustomTheme = (theme: Partial<Theme>): string | null => {
    try {
        const customThemes = getCustomThemes();
        const themeId = `custom_${Date.now()}`;
        const newTheme: Theme = {
            name: theme.name || 'Custom Theme',
            background: theme.background || '#ffffff',
            textColor: theme.textColor || '#000000',
            accentColor: theme.accentColor || '#3b82f6',
            ...theme,
            id: themeId,
            category: 'custom',
            isCustom: true,
        };

        customThemes[themeId] = newTheme;
        localStorage.setItem('linkoo_custom_themes', JSON.stringify(customThemes));

        return themeId;
    } catch (error) {
        console.error('Ошибка сохранения темы:', error);
        return null;
    }
};

// Получить кастомные темы из localStorage
export const getCustomThemes = (): Record<string, Theme> => {
    try {
        const saved = localStorage.getItem('linkoo_custom_themes');
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Ошибка загрузки тем:', error);
        return {};
    }
};

// Получить все темы (встроенные + кастомные)
export const getAllThemes = (): Record<string, Theme> => {
    const customThemes = getCustomThemes();
    return {...cardThemes, ...customThemes};
};

// Удалить кастомную тему
export const deleteCustomTheme = (themeId: string): boolean => {
    try {
        const customThemes = getCustomThemes();
        delete customThemes[themeId];
        localStorage.setItem('linkoo_custom_themes', JSON.stringify(customThemes));
        return true;
    } catch (error) {
        console.error('Ошибка удаления темы:', error);
        return false;
    }
};

// Экспорт темы в JSON
export const exportTheme = (theme: Theme): void => {
    const exportData = {
        ...theme, exportedFrom: 'Linkoo', exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `linkoo-theme-${theme.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Импорт темы из JSON
export const importTheme = async (file: File): Promise<string | null> => {
    try {
        const text = await file.text();
        const themeData = JSON.parse(text);

        // Валидация структуры темы
        if (!themeData.name || !themeData.background) {
            throw new Error('Неверный формат файла темы');
        }

        const themeId = saveCustomTheme(themeData);
        return themeId;
    } catch (error) {
        console.error('Ошибка импорта темы:', error);
        throw error;
    }
};
