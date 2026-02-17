import {ReactNode} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {User, CreditCard, Shield, Settings} from 'lucide-react';

interface NavItem {
    label: string;
    path: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    {
        label: 'Профиль',
        path: '/profile',
        icon: User,
    },
    {
        label: 'Мои карточки',
        path: '/cards',
        icon: CreditCard,
    },
    {
        label: 'Безопасность',
        path: '/security',
        icon: Shield,
    },
    {
        label: 'Настройки',
        path: '/settings',
        icon: Settings,
    },
];

interface ProfileLayoutProps {
    children: ReactNode;
    title: string;
    description?: string;
}

export function ProfileLayout({children, title, description}: ProfileLayoutProps) {
    const location = useLocation();

    return (
        <div className="container mx-auto px-4 py-8 min-h-[35rem]">
            <div className="max-w-7xl mx-auto">
                {/* Mobile/Tablet Header */}
                <div className="lg:hidden mb-6">
                    <h1 className="text-3xl font-bold">{title}</h1>
                    {description && <p className="text-gray-600 mt-1">{description}</p>}
                </div>

                {/* Mobile/Tablet Navigation Tabs */}
                <div className="lg:hidden mb-6">
                    <nav className="flex gap-1 sm:gap-2 border-b border-gray-200 overflow-x-auto scrollbar-hide">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`
                                        flex items-center justify-center gap-2 px-3 sm:px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap
                                        ${isActive
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}/>
                                    <span className="hidden sm:inline text-sm">{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-24">
                            {/* Desktop Title */}
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold">{title}</h1>
                                {description && <p className="text-gray-600 mt-2">{description}</p>}
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-1">
                                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                                    Аккаунт
                                </div>
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;

                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`
                                                flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors
                                                ${isActive
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                                }
                                            `}
                                        >
                                            <Icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`}/>
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
