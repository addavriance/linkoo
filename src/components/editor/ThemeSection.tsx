import React from 'react';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {getAllThemes, type Theme} from '@/lib/themes';
import {Palette} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import type {Card} from '@/types';
import {ThemeIcon} from '@/components/common/ThemeIcon.tsx';

interface ThemeSectionProps {
    cardData: Partial<Card>;
    updateField: <K extends keyof Card>(field: K, value: Card[K]) => void;
}

export const ThemeSection: React.FC<ThemeSectionProps> = ({
                                                              cardData,
                                                              updateField,
                                                          }) => {
    const navigate = useNavigate();
    const themes = getAllThemes();
    const selectedTheme = themes[cardData.theme || 'light_minimal'];

    // Group themes by category
    const groupedThemes = Object.values(themes).reduce((acc, theme) => {
        if (!acc[theme.category]) {
            acc[theme.category] = [];
        }
        acc[theme.category].push(theme);
        return acc;
    }, {} as Record<string, Theme[]>);

    const categoryNames: Record<string, string> = {
        gradient: 'Градиенты',
        solid: 'Однотонные',
        light: 'Светлые',
        glass: 'Стекло',
        custom: 'Кастомные',
    };

    return (
        <div className="space-y-4">
            {/* Current theme */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Текущая тема
                </label>
                <div
                    className="relative h-24 rounded-lg overflow-hidden cursor-pointer border-2 border-gray-200 hover:border-blue-500 transition-colors"
                    style={{
                        background: selectedTheme.background,
                        color: selectedTheme.textColor,
                    }}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <p className="font-semibold">{selectedTheme.name}</p>
                            <p className="text-sm opacity-75 flex items-center justify-center gap-1">
                                <ThemeIcon name={selectedTheme.icon} className="h-4 w-4"/>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/themes')}
            >
                <Palette className="h-4 w-4 mr-2"/>
                Открыть галерею тем
            </Button>

            {/* Quick theme selector */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Быстрый выбор
                </label>
                <div className="space-y-3">
                    {Object.entries(groupedThemes).map(([category, categoryThemes]) => (
                        <div key={category}>
                            <p className="text-xs font-medium text-gray-600 mb-2">
                                {categoryNames[category] || category}
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                                {categoryThemes.slice(0, 6).map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => updateField('theme', theme.id)}
                                        className={`
                      relative h-16 rounded-md overflow-hidden border-2 transition-all
                      ${
                                            cardData.theme === theme.id
                                                ? 'border-blue-500 ring-2 ring-blue-200'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }
                    `}
                                        style={{
                                            background: theme.background,
                                            color: theme.textColor,
                                        }}
                                        title={theme.name}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <ThemeIcon name={theme.icon} className="h-6 w-6"/>
                                        </div>
                                        {theme.popular && (
                                            <Badge className="absolute top-1 right-1 text-xs bg-yellow-500">
                                                ★
                                            </Badge>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
