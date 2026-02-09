import {useNavigate} from "react-router-dom";
import {
    User,
    LogOut,
    CreditCard,
    Shield,
    Settings,
    Sparkles,
    IdCard,
} from "lucide-react";
import {useAuth} from "@/contexts/AuthContext.tsx";

interface UserMenuProps {
    setUserMenuOpen: (open: boolean) => void;
}

export const UserMenu = ({setUserMenuOpen}: UserMenuProps) => {
    const {user, logout} = useAuth();

    const navigate = useNavigate();

    if (!user) {
        return null;
    }


    return (
        <>
            <div
                className="fixed inset-0 z-30 h-screen"
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
    )
}
