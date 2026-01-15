import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { OAuthButtons } from '@/components/auth/OAuthButtons';
import {
    Menu,
    X,
    Palette,
    Plus,
    Home,
    Github,
    Heart,
    User,
    LogOut,
    Info
} from 'lucide-react';
import './Header.css';

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    const navigation = [
        { name: 'Главная', href: '/', icon: Home },
        { name: 'О проекте', href: '/about', icon: Info },
        { name: 'Создать', href: '/editor', icon: Plus },
        { name: 'Темы', href: '/themes', icon: Palette },
    ];

    const isActive = (path: string) => location.pathname === path;

    // Закрываем меню при изменении маршрута
    useEffect(() => {
        if (mobileMenuOpen) {
            handleCloseMenu();
        }
    }, [location.pathname]);

    // Блокируем прокрутку когда меню открыто
    useEffect(() => {
        if (mobileMenuOpen) {
            const scrollY = window.scrollY;
            const body = document.body;
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

            body.style.position = 'fixed';
            body.style.top = `-${scrollY}px`;
            body.style.left = '0';
            body.style.right = '0';
            body.style.width = '100%';
            body.style.paddingRight = `${scrollBarWidth}px`;

            return () => {
                const scrollY = parseInt(body.style.top || '0') * -1;
                body.style.position = '';
                body.style.top = '';
                body.style.left = '';
                body.style.right = '';
                body.style.width = '';
                body.style.paddingRight = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [mobileMenuOpen]);

    // Закрываем меню по Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && mobileMenuOpen) {
                handleCloseMenu();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [mobileMenuOpen]);

    // Функция плавного закрытия
    const handleCloseMenu = () => {
        if (isAnimating) return;

        setIsAnimating(true);

        // Запускаем анимацию закрытия
        const backdrop: HTMLElement | null = document.querySelector('.mobile-backdrop');
        const panel: HTMLElement | null = document.querySelector('.mobile-menu-panel');

        if (backdrop) {
            backdrop.style.animation = 'backdropFadeOut 0.3s ease-out forwards';
        }

        if (panel) {
            panel.style.animation = 'slideOutRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        }

        // Убираем элементы после анимации
        setTimeout(() => {
            setMobileMenuOpen(false);
            setIsAnimating(false);
        }, 300);
    };

    const handleMobileNavClick = (href: string) => {
        handleCloseMenu();
        // Небольшая задержка для плавности
        setTimeout(() => {
            navigate(href);
        }, 150);
    };

    const handleOpenMenu = () => {
        if (isAnimating) return;
        setMobileMenuOpen(true);
        setIsAnimating(false);
    };

    return (
        <>
            <header className="sticky top-0 z-40 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl transition-all duration-200">
                <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
                    {/* Logo */}
                    <div className="flex lg:flex-1">
                        <Link to="/" className="-m-1.5 p-1.5 flex items-center space-x-2 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                                L
                            </div>
                            <span className="text-xl font-bold text-gray-900 transition-all duration-200 group-hover:text-blue-600">
                                Linkoo
                            </span>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex lg:hidden">
                        <button
                            type="button"
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
                            onClick={handleOpenMenu}
                            disabled={isAnimating}
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            <span className="sr-only">Открыть меню</span>
                            <Menu className="h-6 w-6 transition-transform duration-200" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden lg:flex lg:gap-x-8">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`nav-item flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-100 hover:scale-105 hover:shadow-sm ${
                                        isActive(item.href)
                                            ? 'bg-blue-50 text-blue-700 shadow-sm'
                                            : 'text-gray-700 hover:text-gray-900'
                                    }`}
                                >
                                    <Icon className="h-4 w-4 transition-transform duration-200 nav-icon" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 lg:items-center">
                        {/*<Button*/}
                        {/*    variant="outline"*/}
                        {/*    size="sm"*/}
                        {/*    asChild*/}
                        {/*    className="hover-lift transition-all duration-200"*/}
                        {/*>*/}
                        {/*    <a*/}
                        {/*        href="https://github.com/addavriance/linkoo"*/}
                        {/*        target="_blank"*/}
                        {/*        rel="noopener noreferrer"*/}
                        {/*        className="flex items-center space-x-2"*/}
                        {/*    >*/}
                        {/*        <Github className="h-4 w-4" />*/}
                        {/*        <span>GitHub</span>*/}
                        {/*    </a>*/}
                        {/*</Button>*/}

                        <Button
                            size="sm"
                            className="hero-button bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group shadow-lg"
                            onClick={() => navigate('/editor')}
                        >
                            <Plus className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:rotate-90" />
                            Создать
                        </Button>

                        {/* Auth Section */}
                        {isAuthenticated && user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center space-x-2 rounded-lg p-2 hover:bg-gray-100 transition-all"
                                >
                                    {user.profile.avatar ? (
                                        <img
                                            src={user.profile.avatar}
                                            alt={user.profile.name}
                                            className="h-8 w-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                                            {user.profile.name[0]}
                                        </div>
                                    )}
                                </button>

                                {userMenuOpen && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-30"
                                            onClick={() => setUserMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-lg border border-gray-200 z-40">
                                            <div className="p-4 border-b border-gray-100">
                                                <p className="font-medium text-gray-900">{user.profile.name}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                            <div className="p-2">
                                                <button
                                                    onClick={() => {
                                                        setUserMenuOpen(false);
                                                        navigate('/profile');
                                                    }}
                                                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                                >
                                                    <User className="h-4 w-4" />
                                                    <span>Профиль</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setUserMenuOpen(false);
                                                        logout();
                                                    }}
                                                    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    <span>Выйти</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setLoginDialogOpen(true)}
                            >
                                <User className="h-4 w-4 mr-2" />
                                Войти
                            </Button>
                        )}
                    </div>
                </nav>
            </header>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="mobile-backdrop fixed inset-0 z-50 bg-black/50 lg:hidden animate-[backdropFadeIn_0.3s_ease-out_forwards]"
                        onClick={handleCloseMenu}
                        aria-hidden="true"
                    />

                    {/* Mobile menu panel */}
                    <div
                        id="mobile-menu"
                        className="mobile-menu-panel mobile-menu-panel-animated fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl lg:hidden overflow-y-auto select-none"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="mobile-menu-title"
                    >
                        <div className="flex h-full flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <Link
                                    to="/"
                                    className="-m-1.5 p-1.5 flex items-center space-x-2 group"
                                    onClick={handleCloseMenu}
                                    id="mobile-menu-title"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold transition-all duration-200 group-hover:scale-110">
                                        L
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">Linkoo</span>
                                </Link>
                                <button
                                    type="button"
                                    className="close-button -m-2.5 rounded-md p-2.5 text-gray-700 hover:bg-red-50 transition-all duration-200 hover:scale-105 active:scale-95"
                                    onClick={handleCloseMenu}
                                    disabled={isAnimating}
                                >
                                    <span className="sr-only">Закрыть меню</span>
                                    <X className="close-icon h-6 w-6 transition-all duration-300" aria-hidden="true" />
                                </button>
                            </div>

                            {/* Navigation */}
                            <div className="flex-1 px-6 py-6">
                                <div className="space-y-2">
                                    {navigation.map((item, index) => {
                                        const Icon = item.icon;
                                        const active = isActive(item.href);
                                        return (
                                            <button
                                                key={item.name}
                                                onClick={() => handleMobileNavClick(item.href)}
                                                className={`nav-item-mobile w-full flex items-center space-x-3 rounded-xl px-4 py-3 text-left text-base font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                                                    active
                                                        ? 'nav-item-active bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                                                        : 'text-gray-900 hover:bg-gray-50 hover:text-blue-600'
                                                }`}
                                                style={{
                                                    animation: `slideInItem 0.4s ease-out ${0.1 + index * 0.05}s forwards`
                                                }}
                                            >
                                                <Icon className="nav-icon h-5 w-5 transition-all duration-200" />
                                                <span className="flex-1">{item.name}</span>
                                                {active && (
                                                    <div className="active-dot active-dot-animated h-2 w-2 rounded-full bg-blue-600"></div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Footer actions */}
                            <div className="border-t border-gray-100 p-6 space-y-4">
                                <Button
                                    variant="outline"
                                    className="footer-button footer-button-animated-1 w-full justify-center hover-lift transition-all duration-200"
                                    asChild
                                >
                                    <a
                                        href="https://github.com/addavriance/linkoo"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2"
                                    >
                                        <Github className="h-4 w-4" />
                                        <span>GitHub проект</span>
                                    </a>
                                </Button>

                                <Button
                                    className="footer-button footer-button-animated-2 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hero-button group shadow-lg"
                                    onClick={() => handleMobileNavClick('/editor')}
                                >
                                    <Plus className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:rotate-90" />
                                    Создать визитку
                                </Button>

                                {/* Version info */}
                                <div
                                    className="text-center pt-4 select-none version-info version-info-animated"
                                >
                                    <p className="text-xs text-gray-500 font-medium">
                                        Linkoo v1.0.0
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
                                        Сделано с <Heart className="h-3 w-3 text-red-500 animate-pulse" /> в России
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Login Dialog */}
            <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center">
                            Вход в Linkoo
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-center text-gray-600 mb-6">
                            Войдите, чтобы сохранять карточки в облаке и получать короткие ссылки
                        </p>
                        <OAuthButtons />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Header;
