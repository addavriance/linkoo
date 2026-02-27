import {NavLink, Outlet, useNavigate} from 'react-router-dom';
import {useAuth} from '@/contexts/AuthContext';
import {useEffect} from 'react';
import {LayoutDashboard, Users, CreditCard, Link2, ArrowLeft, ShieldCheck} from 'lucide-react';

export default function AdminLayout() {
    const {user, isLoading} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && (!user || (user.role !== 'admin' && user.role !== 'moderator'))) {
            navigate('/', {replace: true});
        }
    }, [user, isLoading, navigate]);

    if (isLoading || !user) return null;
    if (user.role !== 'admin' && user.role !== 'moderator') return null;

    const isAdmin = user.role === 'admin';

    const navClass = ({isActive}: {isActive: boolean}) =>
        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
        }`;

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-56 shrink-0 border-r border-border bg-card flex flex-col py-6 px-3 gap-1">
                <div className="flex items-center gap-2 px-3 mb-6">
                    <ShieldCheck className="h-5 w-5 text-primary"/>
                    <span className="font-semibold text-sm">Админ-панель</span>
                </div>

                <NavLink to="/admin" end className={navClass}>
                    <LayoutDashboard className="h-4 w-4"/>
                    Дашборд
                </NavLink>

                {isAdmin && (
                    <NavLink to="/admin/users" className={navClass}>
                        <Users className="h-4 w-4"/>
                        Пользователи
                    </NavLink>
                )}

                <NavLink to="/admin/cards" className={navClass}>
                    <CreditCard className="h-4 w-4"/>
                    Карточки
                </NavLink>

                <NavLink to="/admin/links" className={navClass}>
                    <Link2 className="h-4 w-4"/>
                    Ссылки
                </NavLink>

                <div className="mt-auto">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors w-full"
                    >
                        <ArrowLeft className="h-4 w-4"/>
                        К приложению
                    </button>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1 overflow-y-auto">
                <Outlet/>
            </main>
        </div>
    );
}
