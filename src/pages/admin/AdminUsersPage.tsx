import {useEffect, useState, useCallback} from 'react';
import {api} from '@/lib/api';
import {toast} from '@/lib/toast';
import type {User, AccountType, UserRole, PaginatedResponse} from '@/types';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Search, ChevronLeft, ChevronRight} from 'lucide-react';
import {ADMIN_PAGE_SIZE, SEARCH_DEBOUNCE_MS} from '@/constants';

const ROLE_LABELS: Record<string, string> = {
    user: 'user',
    moderator: 'moder',
    admin: 'admin',
};

const ROLE_COLORS: Record<string, string> = {
    user: 'wd:(bg-zinc-100 text-zinc-700)',
    moderator: 'wd:(bg-blue-100 text-blue-700)',
    admin: 'wd:(bg-purple-100 text-purple-700)',
};

const PLAN_COLORS: Record<string, string> = {
    free: 'wd:(bg-zinc-100 text-zinc-700)',
    paid: 'wd:(bg-green-100 text-green-700)',
};

function Badge({label, color}: {label: string; color: string}) {
    return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>{label}</span>;
}


export default function AdminUsersPage() {
    const [data, setData] = useState<PaginatedResponse<User> | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [planFilter, setPlanFilter] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    const load = useCallback(() => {
        setLoading(true);
        api.getAdminUsers({page, limit: ADMIN_PAGE_SIZE, search: search || undefined, role: roleFilter || undefined, accountType: planFilter || undefined})
            .then(setData)
            .catch(() => toast.error('Не удалось загрузить пользователей'))
            .finally(() => setLoading(false));
    }, [page, search, roleFilter, planFilter]);

    useEffect(() => {
        load();
    }, [load]);

    // Debounced search
    useEffect(() => {
        const t = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(t);
    }, [searchInput]);

    const handleUpdateUser = async (id: string, patch: {role?: UserRole; accountType?: AccountType; isActive?: boolean}) => {
        try {
            await api.updateAdminUser(id, patch);
            toast.success('Обновлено');
            setEditingId(null);
            load();
        } catch {
            toast.error('Ошибка обновления');
        }
    };

    const users = data?.data ?? [];
    const total = data?.meta.total ?? 0;
    const totalPages = data?.meta.totalPages ?? 1;

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-2xl font-bold">Пользователи</h1>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input
                        className="pl-8 w-64"
                        placeholder="Поиск по имени или email"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                    />
                </div>
                <select
                    className="border border-border rounded-md px-3 py-1.5 text-sm bg-background"
                    value={roleFilter}
                    onChange={e => {setRoleFilter(e.target.value); setPage(1);}}
                >
                    <option value="">Все роли</option>
                    <option value="user">user</option>
                    <option value="moderator">moderator</option>
                    <option value="admin">admin</option>
                </select>
                <select
                    className="border border-border rounded-md px-3 py-1.5 text-sm bg-background"
                    value={planFilter}
                    onChange={e => {setPlanFilter(e.target.value); setPage(1);}}
                >
                    <option value="">Все планы</option>
                    <option value="free">free</option>
                    <option value="paid">paid</option>
                </select>
            </div>

            {/* Table */}
            <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Пользователь</th>
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Роль</th>
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">План</th>
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Статус</th>
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Дата</th>
                            <th className="px-4 py-3"/>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Загрузка...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Нет пользователей</td></tr>
                        ) : users.map(u => (
                            <tr key={u._id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="font-medium">{u.profile.name}</div>
                                    {u.email && <div className="text-xs text-muted-foreground">{u.email}</div>}
                                </td>
                                <td className="px-4 py-3">
                                    {editingId === u._id ? (
                                        <select
                                            className="border border-border rounded px-2 py-1 text-xs bg-background"
                                            defaultValue={u.role}
                                            onChange={e => handleUpdateUser(u._id, {role: e.target.value as UserRole})}
                                        >
                                            <option value="user">user</option>
                                            <option value="moderator">moderator</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    ) : (
                                        <Badge label={ROLE_LABELS[u.role] ?? u.role} color={ROLE_COLORS[u.role] ?? ROLE_COLORS.user}/>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {editingId === u._id ? (
                                        <select
                                            className="border border-border rounded px-2 py-1 text-xs bg-background"
                                            defaultValue={u.accountType}
                                            onChange={e => handleUpdateUser(u._id, {accountType: e.target.value as AccountType})}
                                        >
                                            <option value="free">free</option>
                                            <option value="paid">paid</option>
                                        </select>
                                    ) : (
                                        <Badge label={u.accountType} color={PLAN_COLORS[u.accountType]}/>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <Badge
                                        label={u.isActive === false ? 'неактивен' : 'активен'}
                                        color={u.isActive === false
                                            ? 'wd:(bg-red-100 text-red-700)'
                                            : 'wd:(bg-emerald-100 text-emerald-700)'}
                                    />
                                </td>
                                <td className="px-4 py-3 text-muted-foreground text-xs">
                                    {new Date(u.createdAt).toLocaleDateString('ru-RU')}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2 justify-end">
                                        {editingId === u._id ? (
                                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                                                Закрыть
                                            </Button>
                                        ) : (
                                            <Button size="sm" variant="ghost" onClick={() => setEditingId(u._id)}>
                                                Изменить
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className={u.isActive === false ? 'text-emerald-600 hover:text-emerald-700' : 'text-red-600 hover:text-red-700'}
                                            onClick={() => {
                                                if (!confirm(u.isActive === false ? 'Активировать пользователя?' : 'Деактивировать пользователя?')) return;
                                                handleUpdateUser(u._id, {isActive: u.isActive === false});
                                            }}
                                        >
                                            {u.isActive === false ? 'Вкл' : 'Выкл'}
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{total > 0 ? `${(page - 1) * ADMIN_PAGE_SIZE + 1}–${Math.min(page * ADMIN_PAGE_SIZE, total)} из ${total}` : '0'}</span>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                        <ChevronLeft className="h-4 w-4"/>
                    </Button>
                    <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                        <ChevronRight className="h-4 w-4"/>
                    </Button>
                </div>
            </div>
        </div>
    );
}
