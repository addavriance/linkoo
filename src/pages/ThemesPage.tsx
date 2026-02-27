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
    Lock,
} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {ThemeIcon} from '@/components/common/ThemeIcon.tsx';
import ThemePreviewDialog from '@/components/dialogs/ThemePreviewDialog.tsx';
import {useAuth} from '@/contexts/AuthContext';
import {useDialog} from '@/contexts/DialogContext';

import {
    cardThemes,
    themeCategories,
    popularThemes,
    getThemesByCategory,
    applyThemeStyles, Theme
} from '@/lib/themes';

// Первые 5 тем доступны бесплатным зарегистрированным пользователям
const FREE_THEME_IDS = Object.keys(cardThemes).slice(0, 5);
// Только первая тема доступна гостям
const GUEST_THEME_IDS = Object.keys(cardThemes).slice(0, 1);
const GUEST_SHOWN_THEME_IDS = Object.keys(cardThemes).slice(0, 8);

const ThemesPage = () => {
    const navigate = useNavigate();
    const {user, isAuthenticated} = useAuth();
    const {openLoginDialog} = useDialog();
    const isPremium = user?.accountType === 'paid';

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const isThemeAvailable = (themeId: string) => {
        if (isPremium) return true;
        if (isAuthenticated) return FREE_THEME_IDS.includes(themeId);
        return GUEST_THEME_IDS.includes(themeId);
    };

    const shouldShowTheme = (themeId: string) => {
        if (isAuthenticated) return true;
        return GUEST_SHOWN_THEME_IDS.includes(themeId);
    }

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
        if (!isThemeAvailable(themeId)) return;

        localStorage.setItem('linkoo_selected_theme', themeId);

        const draftData = localStorage.getItem('linkoo_draft');
        localStorage.setItem('linkoo_draft',
            JSON.stringify({
                ...(draftData ? JSON.parse(draftData) : {}),
                theme: themeId
            })
        );

        navigate('/editor');
    };

    // Превью темы
    const previewThemeCard = (theme: Theme) => {
        setPreviewTheme(theme);
        setIsPreviewOpen(true);
    };

    return (
        <div className="container min-h-screen">
            <div className="mx-auto px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center space-y-4 mb-8">
                        <h1 className="text-3xl font-bold">
                            Галерея Тем
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Выберите идеальный стиль для своей цифровой визитки из нашей коллекции
                            профессионально разработанных тем
                        </p>
                    </div>

                    {/* Поиск и фильтры */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full sm:w-96">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                                <Input
                                    placeholder="Поиск тем..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground"/>
                                <span className="text-sm text-muted-foreground">
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
                                    <ThemeIcon name={category.icon} className="h-4 w-4"/>
                                    <span className="hidden sm:inline">{category.name}</span>
                                </TabsTrigger> as ReactNode
                            ))}
                        </TabsList>
                    </Tabs>

                    {/* Сетка тем */}
                    <div className="relative mb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredThemes.map((theme) => {
                                const available = isThemeAvailable(theme.id);
                                const show = shouldShowTheme(theme.id);

                                if (!show) return null;

                                return (
                                    <div key={theme.id} className="relative">
                                        <Card className={`group overflow-hidden transition-all duration-200 ${available ? 'card-hover' : 'opacity-70'}`}>
                                            <CardContent className="p-0">
                                                {/* Превью темы */}
                                                <div className="relative">
                                                    <div
                                                        className="h-48 p-6 flex flex-col items-center justify-center text-center"
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
                                                            <Badge className="text-xs flex items-center gap-1 bg-background/90 text-foreground hover:bg-background">
                                                                <ThemeIcon name={themeCategories[theme.category]?.icon} className="h-3 w-3"/>
                                                                {themeCategories[theme.category]?.name}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {/* Замок для Premium тем (зарегистрированные бесплатники) */}
                                                    {!available && isAuthenticated && (
                                                        <div
                                                            className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 cursor-pointer"
                                                            onClick={() => navigate('/premium')}
                                                        >
                                                            <div className="bg-background/20 backdrop-blur rounded-full p-2">
                                                                <Lock className="h-5 w-5 text-white"/>
                                                            </div>
                                                            <span className="text-white text-xs font-medium">
                                                                Premium
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Overlay с действиями (только для доступных тем) */}
                                                    {available && (
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
                                                    )}
                                                </div>

                                                {/* Информация о теме */}
                                                <div className="p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h3 className="font-semibold text-foreground mb-1">
                                                                {theme.name}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                                <ThemeIcon name={theme.icon} className="h-4 w-4"/>
                                                                {themeCategories[theme.category]?.name}
                                                            </p>
                                                        </div>
                                                        {available ? (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => useTheme(theme.id)}
                                                            >
                                                                <Download className="h-4 w-4"/>
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => isAuthenticated ? navigate('/premium') : openLoginDialog()}
                                                                className="wd:(text-blue-600 border-blue-200 hover:bg-blue-100)"
                                                            >
                                                                <Lock className="h-4 w-4"/>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Фейд-оверлей для гостей — показывает что больше тем заблокировано */}
                        {!isAuthenticated && filteredThemes.length > 1 && (
                            <div className="absolute -bottom-1 left-0 right-0 h-[10rem] bg-background w-full pointer-events-none">
                                <div className="absolute bg-gradient-to-t from-background via-background/80 to-transparent w-full top-[-8rem] h-[8rem]">

                                </div>
                            </div>
                        )}
                    </div>

                    {/* Призыв зарегистрироваться (для гостей) */}
                    {!isAuthenticated && (
                        <div className="text-center py-10 mb-8 bg-background border border-border rounded-2xl shadow-sm -mt-28 z-20 relative">
                            <div className="flex items-center justify-center mb-4">
                                <div className="wd:bg-blue-100 p-3 rounded-full">
                                    <Palette className="h-6 w-6 text-blue-600"/>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">
                                Зарегистрируйтесь в 1 клик, чтобы открыть больше тем
                            </h3>
                            <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm">
                                Бесплатно откройте 5 тем и создайте свою первую визитку
                            </p>
                            <Button
                                onClick={openLoginDialog}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                            >
                                Войти / Зарегистрироваться
                            </Button>
                        </div>
                    )}

                    {/* Призыв к Premium (для зарегистрированных бесплатников) */}
                    {isAuthenticated && !isPremium && (
                        <div className="text-center py-6 mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Lock className="h-5 w-5 text-amber-600"/>
                                <span className="font-semibold text-amber-800">
                                    Доступно 5 из {Object.keys(cardThemes).length} тем
                                </span>
                            </div>
                            <p className="text-amber-700 text-sm mb-4 max-w-sm mx-auto">
                                Откройте все темы, конструктор с градиентами и узорами с Premium
                            </p>
                            <Button
                                onClick={() => navigate('/premium')}
                                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                            >
                                <Sparkles className="h-4 w-4 mr-2"/>
                                Открыть Premium — 299 ₽/мес
                            </Button>
                        </div>
                    )}

                    {/* Пустое состояние */}
                    {filteredThemes.length === 0 && (
                        <div className="text-center py-12">
                            <Palette className="h-16 w-16 text-muted-foreground mx-auto mb-4"/>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                Темы не найдены
                            </h3>
                            <p className="text-muted-foreground mb-6">
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
                    {isAuthenticated && (
                        <div className="text-center py-12 bg-gradient-to-r wd:(from-blue-50 to-purple-50) rounded-2xl">
                            <h2 className="text-2xl font-bold text-foreground mb-4">
                                Не нашли подходящую тему?
                            </h2>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                Создайте свою уникальную визитку в редакторе и настройте её под свой стиль
                            </p>
                            <Button
                                onClick={() => navigate('/editor')}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                            >
                                <Plus className="h-4 w-4 mr-2"/>
                                Создать визитку
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Модальное окно превью */}
            <ThemePreviewDialog
                theme={previewTheme}
                open={isPreviewOpen}
                onOpenChange={setIsPreviewOpen}
                onUseTheme={useTheme}
            />
        </div>
    );
};

export default ThemesPage;
