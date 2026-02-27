import {useEffect, useState, useCallback} from 'react';
import {api} from '@/lib/api';
import {toast} from '@/lib/toast';
import type {AdminLink, PaginatedResponse} from '@/types';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Search, ChevronLeft, ChevronRight} from 'lucide-react';

const LIMIT = 20;

function ownerName(link: AdminLink): string {
    if (typeof link.userId === 'object') {
        return link.userId.profile?.name ?? '—';
    }
    return link.userId ?? '—';
}

export default function AdminLinksPage() {
    const [data, setData] = useState<PaginatedResponse<AdminLink> | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');

    const load = useCallback(() => {
        setLoading(true);
        api.getAdminLinks({page, limit: LIMIT, search: search || undefined})
            .then(setData)
            .catch(() => toast.error('Не удалось загрузить ссылки'))
            .finally(() => setLoading(false));
    }, [page, search]);

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        const t = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, 300);
        return () => clearTimeout(t);
    }, [searchInput]);

    const handleToggle = async (link: AdminLink) => {
        const action = link.isActive ? 'Отключить' : 'Включить';
        if (!confirm(`${action} ссылку /${link.slug}?`)) return;
        try {
            await api.updateAdminLink(link._id, {isActive: !link.isActive});
            toast.success('Обновлено');
            load();
        } catch {
            toast.error('Ошибка обновления');
        }
    };

    const links = data?.data ?? [];
    const total = data?.meta.total ?? 0;
    const totalPages = data?.meta.totalPages ?? 1;

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-2xl font-bold">Ссылки</h1>

            <div className="flex gap-3">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input
                        className="pl-8 w-64"
                        placeholder="Поиск по slug"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                    />
                </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Slug</th>
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Тип</th>
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Владелец</th>
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Статус</th>
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Дата</th>
                            <th className="px-4 py-3"/>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Загрузка...</td></tr>
                        ) : links.length === 0 ? (
                            <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Нет ссылок</td></tr>
                        ) : links.map(link => (
                            <tr key={link._id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3 font-mono font-medium">/{link.slug}</td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                        link.targetType === 'card'
                                            ? 'wd:(bg-blue-100 text-blue-700)'
                                            : 'wd:(bg-slate-100 text-slate-700)'
                                    }`}>
                                        {link.targetType === 'card' ? 'карточка' : 'URL'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">{ownerName(link)}</td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                        link.isActive
                                            ? 'wd:(bg-emerald-100 text-emerald-700)'
                                            : 'wd:(bg-red-100 text-red-700)'
                                    }`}>
                                        {link.isActive ? 'активна' : 'отключена'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground text-xs">
                                    {new Date(link.createdAt).toLocaleDateString('ru-RU')}
                                </td>
                                <td className="px-4 py-3">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className={link.isActive ? 'text-red-600 hover:text-red-700' : 'text-emerald-600 hover:text-emerald-700'}
                                        onClick={() => handleToggle(link)}
                                    >
                                        {link.isActive ? 'Выкл' : 'Вкл'}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{total > 0 ? `${(page - 1) * LIMIT + 1}–${Math.min(page * LIMIT, total)} из ${total}` : '0'}</span>
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
