import {useEffect, useState, useCallback} from 'react';
import {api} from '@/lib/api';
import {toast} from '@/lib/toast';
import type {AdminCard, PaginatedResponse} from '@/types';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Search, ChevronLeft, ChevronRight, ExternalLink} from 'lucide-react';
import {ADMIN_PAGE_SIZE, SEARCH_DEBOUNCE_MS} from '@/lib/constants';

function ownerName(card: AdminCard): string {
    if (typeof card.userId === 'object') {
        return card.userId.profile?.name ?? '—';
    }
    return card.userId ?? '—';
}

export default function AdminCardsPage() {
    const [data, setData] = useState<PaginatedResponse<AdminCard> | null>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');

    const load = useCallback(() => {
        setLoading(true);
        api.getAdminCards({page, limit: ADMIN_PAGE_SIZE, search: search || undefined})
            .then(setData)
            .catch(() => toast.error('Не удалось загрузить карточки'))
            .finally(() => setLoading(false));
    }, [page, search]);

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        const t = setTimeout(() => {
            setSearch(searchInput);
            setPage(1);
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(t);
    }, [searchInput]);

    const handleToggle = async (card: AdminCard) => {
        const action = card.isActive ? 'Отключить' : 'Включить';
        if (!confirm(`${action} карточку "${card.name}"?`)) return;
        try {
            await api.updateAdminCard(card._id, {isActive: !card.isActive});
            toast.success('Обновлено');
            load();
        } catch {
            toast.error('Ошибка обновления');
        }
    };

    const cards = data?.data ?? [];
    const total = data?.meta.total ?? 0;
    const totalPages = data?.meta.totalPages ?? 1;

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-2xl font-bold">Карточки</h1>

            <div className="flex gap-3">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input
                        className="pl-8 w-64"
                        placeholder="Поиск по названию"
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                    />
                </div>
            </div>

            <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Название</th>
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Владелец</th>
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Ссылка</th>
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Просмотры</th>
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Статус</th>
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Дата</th>
                            <th className="px-4 py-3"/>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Загрузка...</td></tr>
                        ) : cards.length === 0 ? (
                            <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Нет карточек</td></tr>
                        ) : cards.map(card => {
                            const cardUrl = card.subdomain
                                ? `https://${card.subdomain}.linkoo.dev`
                                : card.slug
                                    ? `/${card.slug}`
                                    : null;
                            return (
                            <tr key={card._id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3 font-medium">{card.name}</td>
                                <td className="px-4 py-3 text-muted-foreground">{ownerName(card)}</td>
                                <td className="px-4 py-3">
                                    {cardUrl ? (
                                        <a
                                            href={cardUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="font-mono text-xs text-primary hover:underline inline-flex items-center gap-1"
                                        >
                                            {card.subdomain
                                                ? `${card.subdomain}.linkoo.dev`
                                                : `/${card.slug}`}
                                            <ExternalLink className="h-3 w-3"/>
                                        </a>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">—</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">{card.viewCount}</td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                        card.isActive
                                            ? 'wd:(bg-emerald-100 text-emerald-700)'
                                            : 'wd:(bg-red-100 text-red-700)'
                                    }`}>
                                        {card.isActive ? 'активна' : 'отключена'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground text-xs">
                                    {new Date(card.createdAt).toLocaleDateString('ru-RU')}
                                </td>
                                <td className="px-4 py-3">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className={(card.isActive ? 'text-red-600 hover:text-red-700' : 'text-emerald-600 hover:text-emerald-700') + ' min-w-16'}
                                        onClick={() => handleToggle(card)}
                                    >
                                        {card.isActive ? 'Выкл' : 'Вкл'}
                                    </Button>
                                </td>
                            </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

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
