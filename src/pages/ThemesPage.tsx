import {ReactNode, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {
    Palette,
    Star,
    Eye,
    Download,
    Plus,
    Sparkles,
    Filter,
    Search,
    User,
    Mail,
    Phone,
    Linkedin,
    Briefcase,
    Wrench
} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {ThemeIcon} from '@/components/common/ThemeIcon.tsx';

import {
    cardThemes,
    themeCategories,
    popularThemes,
    getThemesByCategory,
    applyThemeStyles, Theme
} from '@/lib/themes';

const ThemesPage = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);

    // Фильтрация тем
    const getFilteredThemes = () => {
        let themes = selectedCategory === 'all'
            ? Object.values(cardThemes)
            : selectedCategory === 'popular'
                ? popularThemes
                : getThemesByCategory(selectedCategory);

        if (searchQuery) {
            themes = themes.filter(theme =>
                theme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                theme.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        return themes;
    };

    const filteredThemes = getFilteredThemes();

    // Использовать тему
    const useTheme = (themeId: string) => {
        // Сохраняем выбранную тему в localStorage
        localStorage.setItem('linkoo_selected_theme', themeId);

        const draftData = localStorage.getItem('linkoo_draft');
        localStorage.setItem('linkoo_draft',
            JSON.stringify({
                ...(draftData ? JSON.parse(draftData) : {}),
                theme: themeId
            })
        )

        // Переходим в редактор
        navigate('/editor');
    };

    // Превью темы
    const previewThemeCard = (theme: Theme) => {
        setPreviewTheme(theme);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
                            <Palette className="h-8 w-8 text-blue-600"/>
                            Галерея Тем
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Выберите идеальный стиль для своей цифровой визитки из нашей коллекции
                            профессионально разработанных тем
                        </p>
                    </div>

                    {/* Поиск и фильтры */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full sm:w-96">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                                <Input
                                    placeholder="Поиск тем..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-gray-500"/>
                                <span className="text-sm text-gray-600">
                  {filteredThemes.length} тем найдено
                </span>
                            </div>
                        </div>
                    </div>

                    {/* Категории */}
                    <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
                        <TabsList className="grid w-full grid-cols-7 sm:grid-cols-4 h-auto">
                            <TabsTrigger value="all" className="flex items-center gap-2 py-2">
                                <Sparkles className="h-4 w-4"/>
                                <span className="hidden sm:inline">Все</span>
                            </TabsTrigger>
                            <TabsTrigger value="popular" className="flex items-center gap-2 py-2">
                                <Star className="h-4 w-4"/>
                                <span className="hidden sm:inline">Популярные</span>
                            </TabsTrigger>
                            {Object.entries(themeCategories).map(([key, category]) => (
                                <TabsTrigger
                                    key={key}
                                    value={key}
                                    className="flex items-center gap-2 py-2"
                                >
                                    <ThemeIcon name={category.icon} className="h-4 w-4" />
                                    <span className="hidden sm:inline">{category.name}</span>
                                </TabsTrigger> as ReactNode
                            ))}
                        </TabsList>
                    </Tabs>

                    {/* Сетка тем */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                        {filteredThemes.map((theme) => (
                            <Card key={theme.id} className="group card-hover overflow-hidden">
                                <CardContent className="p-0">
                                    {/* Превью темы */}
                                    <div className="relative">
                                        <div
                                            className="h-48 p-6 flex flex-col items-center justify-center text-center transition-transform"
                                            style={applyThemeStyles(theme)}
                                        >
                                            {/* Мини-карточка */}
                                            <div className="bg-white/20 backdrop-blur rounded-lg p-3 w-full max-w-32">
                                                <div className="w-8 h-8 rounded-full bg-white/30 mx-auto mb-2"/>
                                                <div className="h-2 bg-white/40 rounded mb-1"/>
                                                <div className="h-1.5 bg-white/30 rounded w-3/4 mx-auto mb-2"/>
                                                <div className="flex gap-1 justify-center">
                                                    <div className="w-3 h-3 bg-white/30 rounded"/>
                                                    <div className="w-3 h-3 bg-white/30 rounded"/>
                                                    <div className="w-3 h-3 bg-white/30 rounded"/>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Badges */}
                                        <div className="absolute top-2 left-2 flex gap-1">
                                            {theme.popular && (
                                                <Badge variant="secondary" className="text-xs">
                                                    <Star className="h-3 w-3 mr-1"/>
                                                    Популярная
                                                </Badge>
                                            )}
                                            {theme.category && (
                                                <Badge variant="outline" className="text-xs flex items-center gap-1">
                                                    <ThemeIcon name={themeCategories[theme.category]?.icon} className="h-3 w-3" />
                                                    {themeCategories[theme.category]?.name}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Overlay с действиями */}
                                        <div
                                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() => previewThemeCard(theme)}
                                            >
                                                <Eye className="h-4 w-4 mr-1"/>
                                                Превью
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => useTheme(theme.id)}
                                            >
                                                <Plus className="h-4 w-4 mr-1"/>
                                                Использовать
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Информация о теме */}
                                    <div className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-1">
                                                    {theme.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <ThemeIcon name={theme.icon} className="h-4 w-4" />
                                                    {themeCategories[theme.category]?.name}
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => useTheme(theme.id)}
                                            >
                                                <Download className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Пустое состояние */}
                    {filteredThemes.length === 0 && (
                        <div className="text-center py-12">
                            <Palette className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Темы не найдены
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Попробуйте изменить поисковый запрос или выбрать другую категорию
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedCategory('all');
                                }}
                            >
                                Сбросить фильтры
                            </Button>
                        </div>
                    )}

                    {/* CTA секция */}
                    <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Не нашли подходящую тему?
                        </h2>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Создайте свою уникальную визитку в редакторе и настройте её под свой стиль
                        </p>
                        <Button
                            onClick={() => navigate('/editor')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            <Plus className="h-4 w-4 mr-2"/>
                            Создать визитку
                        </Button>
                    </div>
                </div>
            </div>

            {/* Модальное окно превью */}
            {previewTheme && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {previewTheme.name}
                            </h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPreviewTheme(null)}
                            >
                                ✕
                            </Button>
                        </div>

                        {/* Превью карточки */}
                        <div
                            className="card-preview aspect-card p-6 text-center mb-6"
                            style={applyThemeStyles(previewTheme)}
                        >
                            <div
                                className="w-16 h-16 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center">
                                <User className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-1">Иван Петров</h3>
                            <p className="text-sm opacity-90 mb-3">Frontend Developer</p>
                            <p className="text-xs opacity-80 mb-4">
                                Создаю современные веб-приложения с фокусом на UX
                            </p>
                            <div className="space-y-2 mb-4 text-xs">
                                <div className="bg-white/20 rounded px-2 py-1 flex items-center justify-center gap-2">
                                    <Mail className="h-3 w-3" />
                                    ivan@example.com
                                </div>
                                <div className="bg-white/20 rounded px-2 py-1 flex items-center justify-center gap-2">
                                    <Phone className="h-3 w-3" />
                                    +7 999 123-45-67
                                </div>
                            </div>
                            <div className="flex justify-center gap-1">
                                <span className="bg-white/20 rounded px-2 py-1 text-xs flex items-center">
                                    <Linkedin className="h-3 w-3" />
                                </span>
                                <span className="bg-white/20 rounded px-2 py-1 text-xs flex items-center">
                                    <Briefcase className="h-3 w-3" />
                                </span>
                                <span className="bg-white/20 rounded px-2 py-1 text-xs flex items-center">
                                    <Wrench className="h-3 w-3" />
                                </span>
                            </div>
                        </div>

                        {/* Информация о теме */}
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Категория:</span>
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <ThemeIcon name={themeCategories[previewTheme.category]?.icon} className="h-3 w-3" />
                                    {themeCategories[previewTheme.category]?.name}
                                </Badge>
                            </div>
                            {previewTheme.popular && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Статус:</span>
                                    <Badge variant="secondary">
                                        <Star className="h-3 w-3 mr-1"/>
                                        Популярная тема
                                    </Badge>
                                </div>
                            )}
                        </div>

                        {/* Действия */}
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setPreviewTheme(null)}
                            >
                                Закрыть
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={() => {
                                    useTheme(previewTheme?.id);
                                    setPreviewTheme(null);
                                }}
                            >
                                <Plus className="h-4 w-4 mr-2"/>
                                Использовать
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemesPage;
