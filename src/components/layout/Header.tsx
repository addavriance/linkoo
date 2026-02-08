import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useDialog } from '@/contexts/DialogContext';
import {
    Menu,
    User,
    LogOut,
    CreditCard,
    Shield,
    Settings,
    Sparkles,
    IdCard,
} from 'lucide-react';
import './Header.css';
import {MobileMenu} from "@/components/common/MobileMenu.tsx";
import { NAVIGATION } from "@/constants";

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const { openLoginDialog } = useDialog();

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

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && mobileMenuOpen) {
                handleCloseMenu();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [mobileMenuOpen]);

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
                    <div className="flex sm:flex-1">
                        <Link to="/" className="-m-1.5 p-1.5 flex items-center space-x-2 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                                L
                            </div>
                            <span className="text-xl font-bold text-gray-900 transition-all duration-200 group-hover:text-blue-600">
                                Linkoo
                            </span>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden sm:flex sm:gap-x-8">
                        {NAVIGATION.map((item) => {
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
                                    <span className="hidden lg:block">{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right side - Auth & Mobile Menu */}
                    <div className="flex flex-1 justify-end items-center">
                        {/* Desktop Auth Section */}
                        <div className="flex gap-x-4 items-center">
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
                                            <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white shadow-lg border border-gray-200 z-40">
                                                <div className="p-4 border-b border-gray-100">
                                                    <p className="font-medium text-gray-900 truncate">{user.profile.name}</p>
                                                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                                </div>
                                                <div className="p-2">
                                                    <button
                                                        onClick={() => {
                                                            setUserMenuOpen(false);
                                                            navigate('/profile');
                                                        }}
                                                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                                    >
                                                        <User className="h-4 w-4" />
                                                        <span>Профиль</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setUserMenuOpen(false);
                                                            navigate('/cards');
                                                        }}
                                                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                                    >
                                                        <IdCard className="h-4 w-4" />
                                                        <span>Мои карточки</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setUserMenuOpen(false);
                                                            navigate('/security');
                                                        }}
                                                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                                    >
                                                        <Shield className="h-4 w-4" />
                                                        <span>Безопасность</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setUserMenuOpen(false);
                                                            navigate('/subscription');
                                                        }}
                                                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                                    >
                                                        <CreditCard className="h-4 w-4" />
                                                        <span>Платежи и подписки</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setUserMenuOpen(false);
                                                            navigate('/settings');
                                                        }}
                                                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                                    >
                                                        <Settings className="h-4 w-4" />
                                                        <span>Настройки</span>
                                                    </button>

                                                    {user.accountType === 'free' && (
                                                        <>
                                                            <div className="my-2 border-t border-gray-200"></div>
                                                            <button
                                                                onClick={() => {
                                                                    setUserMenuOpen(false);
                                                                    navigate('/premium');
                                                                }}
                                                                className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 rounded-md transition-all shadow-sm"
                                                            >
                                                                <Sparkles className="h-4 w-4" />
                                                                <span>Перейти на Premium</span>
                                                            </button>
                                                        </>
                                                    )}

                                                    <div className="my-2 border-t border-gray-200"></div>
                                                    <button
                                                        onClick={() => {
                                                            setUserMenuOpen(false);
                                                            logout();
                                                        }}
                                                        className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
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
                                    onClick={openLoginDialog}
                                    className="hidden sm:flex"
                                >
                                    <User className="h-4 w-4 mr-2" />
                                    Войти
                                </Button>
                            )}
                        </div>

                        {/* Mobile - User Avatar & Menu Button */}
                        <div className="flex sm:hidden items-center gap-2">
                            {/* Mobile Menu Button */}
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
                    </div>
                </nav>
            </header>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <MobileMenu handleCloseMenu={handleCloseMenu} isAnimating={isAnimating}/>
            )}
        </>
    );
};

export default Header;
