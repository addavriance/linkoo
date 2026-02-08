import {LogOut, User, X} from "lucide-react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {NAVIGATION} from "@/constants";
import {useAuth} from "@/contexts/AuthContext.tsx";
import {useDialog} from "@/contexts/DialogContext";
import {Button} from "@/components/ui/button.tsx";

interface MobileMenuProps {
    handleCloseMenu: () => void;
    isAnimating: boolean;
}

export const MobileMenu = ({handleCloseMenu, isAnimating}: MobileMenuProps) => {
    const { user, isAuthenticated, logout } = useAuth();
    const { openLoginDialog } = useDialog();
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => location.pathname === path

    const handleMobileNavClick = (href: string) => {
        handleCloseMenu();

        setTimeout(() => {
            navigate(href);
        }, 150);
    };

    return (
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
                            {NAVIGATION.map((item, index) => {
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
                        {/* Auth button for mobile menu */}
                        {!isAuthenticated && (
                            <Button
                                variant="outline"
                                className="footer-button footer-button-animated-1 w-full justify-center hover-lift transition-all duration-200"
                                onClick={() => {
                                    handleCloseMenu();
                                    setTimeout(() => openLoginDialog(), 300);
                                }}
                            >
                                <User className="h-4 w-4 mr-2" />
                                Войти в аккаунт
                            </Button>
                        )}

                        {/* User info for mobile menu */}
                        {isAuthenticated && user && (
                            <div className="footer-button footer-button-animated-1 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    {user.profile.avatar ? (
                                        <img
                                            src={user.profile.avatar}
                                            alt={user.profile.name}
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                                            {user.profile.name[0]}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-900 text-sm truncate">{user.profile.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => {
                                            handleCloseMenu();
                                            setTimeout(() => navigate('/profile'), 300);
                                        }}
                                    >
                                        <User className="h-3.5 w-3.5 mr-2" />
                                        Профиль
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                                        onClick={() => {
                                            handleCloseMenu();
                                            setTimeout(() => logout(), 300);
                                        }}
                                    >
                                        <LogOut className="h-3.5 w-3.5 mr-2" />
                                        Выйти
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
