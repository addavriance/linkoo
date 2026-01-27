import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { AuthDialog } from '@/components/dialogs/AuthDialog';
import {
    Menu,
    User,
    LogOut,
} from 'lucide-react';
import './Header.css';
import {MobileMenu} from "@/components/common/MobileMenu.tsx";
import { NAVIGATION } from "@/constants";
import {MaxAuthDialog} from "@/components/dialogs/MaxAuthDialog.tsx";

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [maxDialogOpen, setMaxDialogOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

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

    const handleOpenMax = () => {
        setLoginDialogOpen(false);
        setMaxDialogOpen(true);
    }

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

                    {/* Desktop navigation */}
                    <div className="hidden lg:flex lg:gap-x-8">
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
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right side - Auth & Mobile Menu */}
                    <div className="flex flex-1 justify-end items-center">
                        {/* Desktop Auth Section */}
                        <div className="hidden lg:flex lg:gap-x-4 lg:items-center">
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

                        {/* Mobile - User Avatar & Menu Button */}
                        <div className="flex lg:hidden items-center gap-2">
                            {isAuthenticated && user && (
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center rounded-lg p-1.5 hover:bg-gray-100 transition-all"
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
                            )}

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
                <MobileMenu setLoginDialogOpen={setLoginDialogOpen} handleCloseMenu={handleCloseMenu} isAnimating={isAnimating}/>
            )}

            {/* Mobile User Menu */}
            {userMenuOpen && isAuthenticated && user && (
                <>
                    <div
                        className="fixed inset-0 z-30 lg:hidden"
                        onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="fixed top-16 right-4 z-40 w-64 rounded-lg bg-white shadow-2xl border border-gray-200 lg:hidden">
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{user.profile.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-2">
                            <button
                                onClick={() => {
                                    setUserMenuOpen(false);
                                    navigate('/profile');
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                <User className="h-4 w-4" />
                                <span>Профиль</span>
                            </button>
                            <button
                                onClick={() => {
                                    setUserMenuOpen(false);
                                    logout();
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Выйти</span>
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Login Dialog */}
            <AuthDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} openMaxDialog={handleOpenMax}/>
            <MaxAuthDialog open={maxDialogOpen} onOpenChange={setMaxDialogOpen}></MaxAuthDialog>
        </>
    );
};

export default Header;
