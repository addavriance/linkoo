import {useEffect, useState} from 'react';
import {api} from '@/lib/api';
import {toast} from '@/lib/toast';
import type {AdminStats} from '@/types';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import {Users, CreditCard, Link2, TrendingUp} from 'lucide-react';

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('ru-RU', {day: 'numeric', month: 'short'});
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getAdminStats()
            .then(setStats)
            .catch(() => toast.error('Не удалось загрузить статистику'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center h-full">
                <div className="text-muted-foreground text-sm">Загрузка...</div>
            </div>
        );
    }

    if (!stats) return null;

    const statCards = [
        {label: 'Пользователей', value: stats.totalUsers, sub: `${stats.freeUsers} free / ${stats.paidUsers} paid`, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10'},
        {label: 'Карточек', value: stats.totalCards, sub: `${stats.activeCards} активных`, icon: CreditCard, color: 'text-green-500', bg: 'bg-green-500/10'},
        {label: 'Ссылок', value: stats.totalLinks, sub: 'всего создано', icon: Link2, color: 'text-purple-500', bg: 'bg-purple-500/10'},
        {label: 'Платных', value: stats.paidUsers, sub: `${stats.totalUsers ? Math.round((stats.paidUsers / stats.totalUsers) * 100) : 0}% от всех`, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-500/10'},
    ];

    const usersChartData = stats.newUsersLast30d.map(p => ({...p, date: formatDate(p.date)}));
    const cardsChartData = stats.newCardsLast30d.map(p => ({...p, date: formatDate(p.date)}));

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-2xl font-bold">Дашборд</h1>

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map(({label, value, sub, icon: Icon, color, bg}) => (
                    <Card key={label}>
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">{label}</p>
                                    <p className="text-3xl font-bold mt-1">{value.toLocaleString('ru-RU')}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{sub}</p>
                                </div>
                                <div className={`${bg} ${color} p-2 rounded-lg`}>
                                    <Icon className="h-5 w-5"/>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Новые пользователи (30 дней)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={usersChartData}>
                                <defs>
                                    <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                                <XAxis dataKey="date" tick={{fontSize: 11}} tickLine={false} axisLine={false}/>
                                <YAxis tick={{fontSize: 11}} tickLine={false} axisLine={false} allowDecimals={false}/>
                                <Tooltip
                                    contentStyle={{
                                        background: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                    }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="url(#usersGrad)" strokeWidth={2} name="Пользователи"/>
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Новые карточки (30 дней)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={cardsChartData}>
                                <defs>
                                    <linearGradient id="cardsGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                                <XAxis dataKey="date" tick={{fontSize: 11}} tickLine={false} axisLine={false}/>
                                <YAxis tick={{fontSize: 11}} tickLine={false} axisLine={false} allowDecimals={false}/>
                                <Tooltip
                                    contentStyle={{
                                        background: 'hsl(var(--card))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px',
                                        fontSize: '12px',
                                    }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#22c55e" fill="url(#cardsGrad)" strokeWidth={2} name="Карточки"/>
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
