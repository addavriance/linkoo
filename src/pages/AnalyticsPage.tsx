import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useAuth} from '@/contexts/AuthContext';
import {api} from '@/lib/api';
import {toast} from '@/lib/toast';
import {ProfileLayout} from '@/components/layout/ProfileLayout';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import type {PremiumAnalytics, RecentActivityItem} from '@/types';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import {
    Eye,
    Globe,
    Download,
    Share2,
    Monitor,
    TrendingUp,
    Calendar,
    Activity,
    BarChartIcon,
    ArrowUpLeftFromSquareIcon
} from 'lucide-react';
import {
    COUNTRY_NAMES,
    INTERACTION_LABELS,
    DEVICE_ICONS,
    DEVICE_LABELS,
    CHART_COLORS,
    DEVICE_COLORS,
    INTERACTION_STATS,
    PERIODS,
} from '@/constants/analytics';

// ─── Helpers ────────────────────────────────────────────────────────────────

function countryName(code: string) {
    return COUNTRY_NAMES[code] || code;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('ru-RU', {day: 'numeric', month: 'short'});
}

function formatTime(ts: string) {
    const d = new Date(ts);
    return d.toLocaleString('ru-RU', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'});
}

function num(n: number) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
}

function groupEvents(events: RecentActivityItem[]): Array<{event: RecentActivityItem; count: number}> {
    const grouped: Array<{event: RecentActivityItem; count: number}> = [];
    for (const event of events) {
        const minute = event.timestamp.slice(0, 16);
        const last = grouped[grouped.length - 1];
        if (
            last &&
            last.event.type === event.type &&
            last.event.platform === event.platform &&
            last.event.timestamp.slice(0, 16) === minute
        ) {
            last.count++;
        } else {
            grouped.push({event, count: 1});
        }
    }
    return grouped;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({
                      icon: Icon,
                      label,
                      value,
                      sub,
                      color = 'indigo',
                  }: {
    icon: any;
    label: string;
    value: string | number;
    sub?: string;
    color?: string;
}) {
    const colors: Record<string, string> = {
        indigo: 'bg-indigo-100 text-indigo-600',
        purple: 'bg-purple-100 text-purple-600',
        cyan: 'bg-cyan-100 text-cyan-600',
        green: 'bg-green-100 text-green-600',
    };
    return (
        <Card>
            <CardContent className="p-5">
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${colors[color] || colors.indigo}`}>
                        <Icon className="h-5 w-5"/>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground mb-0.5">{label}</p>
                        <p className="text-2xl font-bold text-foreground">{num(Number(value))}</p>
                        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function SectionCard({title, icon: Icon, children, className = ''}: {
    title: string;
    icon?: any;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <Card className={className}>
            <CardContent className="p-5">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    {Icon && <Icon className="h-4 w-4 text-muted-foreground"/>}
                    {title}
                </h3>
                {children}
            </CardContent>
        </Card>
    );
}

function LoadingSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-28 bg-muted rounded-xl"/>
                ))}
            </div>
            <div className="h-64 bg-muted rounded-xl"/>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-56 bg-muted rounded-xl"/>
                <div className="h-56 bg-muted rounded-xl"/>
            </div>
        </div>
    );
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function ChartTooltip({active, payload, label}: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3 text-sm">
            <p className="text-muted-foreground mb-1">{formatDate(label)}</p>
            {payload.map((p: any, i: number) => (
                <p key={i} style={{color: p.color}} className="font-medium">
                    {p.name}: {p.value}
                </p>
            ))}
        </div>
    );
}

// Кастомный тултип для вертикальных баров (браузеры, соцсети)
function VerticalBarTooltip({active, payload}: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-background border border-border rounded-lg shadow-lg p-3 text-sm">
            {payload.map((p: any, i: number) => (
                <p key={i} style={{color: p.color}} className="font-medium">
                    {p.payload.name}: {p.value}
                </p>
            ))}
        </div>
    );
}

// ─── Premium analytics view ───────────────────────────────────────────────────

function PremiumView({data}: {data: PremiumAnalytics}) {
    const combinedTimeSeries = data.viewsTimeSeries.map((v) => ({
        date: v.date,
        views: v.count,
    }));

    return (
        <div className="space-y-6">
            {/* Overview stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard icon={Eye} label="Просмотры" value={data.viewCount} color="indigo"/>
                <StatCard icon={Globe} label="Уникальных стран" value={data.uniqueCountries} color="cyan"/>
                <StatCard icon={Download} label="Сохранений контакта" value={data.contactSaves} color="green"/>
            </div>

            {/* Views time series */}
            <SectionCard title="Просмотры" icon={TrendingUp}>
                <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={combinedTimeSeries} margin={{top: 4, right: 4, bottom: 0, left: -20}}>
                        <defs>
                            <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                        <XAxis dataKey="date" tickFormatter={formatDate} tick={{fontSize: 11}} tickLine={false}/>
                        <YAxis tick={{fontSize: 11}} tickLine={false} axisLine={false} allowDecimals={false}/>
                        <Tooltip content={<ChartTooltip/>}/>
                        <Area type="monotone" dataKey="views" name="Просмотры" stroke="#6366f1" fill="url(#gViews)" strokeWidth={2} dot={false}/>
                    </AreaChart>
                </ResponsiveContainer>
            </SectionCard>

            {/* Countries + Device breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Top countries */}
                <SectionCard title="Топ стран" icon={Globe}>
                    {data.topCountries.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">Нет данных</p>
                    ) : (
                        <div className="space-y-2">
                            {data.topCountries.map((c, i) => {
                                const max = data.topCountries[0].count;
                                const pct = Math.round((c.count / max) * 100);
                                return (
                                    <div key={c.country} className="flex items-center gap-3">
                                        <span className="text-xs text-muted-foreground w-4 text-right">{i + 1}</span>
                                        <span className="text-sm font-medium text-muted-foreground w-24 truncate">
                                            {countryName(c.country)}
                                        </span>
                                        <div className="flex-1 bg-muted rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full bg-indigo-500 transition-all"
                                                style={{width: `${pct}%`}}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground w-8 text-right">{c.count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </SectionCard>

                {/* Device breakdown */}
                <SectionCard title="Устройства" icon={Monitor}>
                    {data.deviceBreakdown.every((d) => d.value === 0) ? (
                        <p className="text-sm text-muted-foreground text-center py-8">Нет данных</p>
                    ) : (
                        <div className="flex items-center gap-4">
                            <ResponsiveContainer width={140} height={140}>
                                <PieChart>
                                    <Tooltip content={<VerticalBarTooltip/>}/>
                                    <Pie
                                        data={data.deviceBreakdown.filter((d) => d.value > 0)}
                                        dataKey="value"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={65}
                                        paddingAngle={3}
                                    >
                                        {data.deviceBreakdown.map((entry) => (
                                            <Cell
                                                name={DEVICE_LABELS[entry.name]}
                                                key={entry.name}
                                                fill={DEVICE_COLORS[entry.name] || '#94a3b8'}
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex-1 space-y-3">
                                {data.deviceBreakdown.map((d) => {
                                    const DevIcon = DEVICE_ICONS[d.name] || Monitor;
                                    const total = data.deviceBreakdown.reduce((s, x) => s + x.value, 0);
                                    const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
                                    return (
                                        <div key={d.name} className="flex items-center gap-2">
                                            <DevIcon className="h-4 w-4" style={{color: DEVICE_COLORS[d.name]}}/>
                                            <span className="text-sm text-muted-foreground flex-1">
                                                {DEVICE_LABELS[d.name] || d.name}
                                            </span>
                                            <span className="text-sm font-semibold text-foreground">{pct}%</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </SectionCard>
            </div>

            {/* Browser breakdown + Social clicks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Browser */}
                <SectionCard title="Браузеры" icon={ArrowUpLeftFromSquareIcon}>
                    {data.browserBreakdown.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">Нет данных</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart
                                data={data.browserBreakdown}
                                layout="vertical"
                                margin={{top: 0, right: 0, bottom: 0, left: 0}}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false}/>
                                <XAxis type="number" tick={{fontSize: 11}} tickLine={false} axisLine={false} allowDecimals={false}/>
                                <YAxis dataKey="name" type="category" width={72} tick={{fontSize: 11}} tickLine={false} axisLine={false}/>
                                <Tooltip content={<VerticalBarTooltip/>}/>
                                <Bar dataKey="value" name="Просмотры" radius={[0, 4, 4, 0]}>
                                    {data.browserBreakdown.map((_, i) => (
                                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]}/>
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </SectionCard>

                {/* Social clicks */}
                <SectionCard title="Клики по соцсетям" icon={Share2}>
                    {data.interactionSummary.socialClicks.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">Нет данных</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart
                                data={data.interactionSummary.socialClicks}
                                layout="vertical"
                                margin={{top: 0, right: 0, bottom: 0, left: 0}}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false}/>
                                <XAxis type="number" tick={{fontSize: 11}} tickLine={false} axisLine={false} allowDecimals={false}/>
                                <YAxis dataKey="platform" type="category" width={72} tick={{fontSize: 11}} tickLine={false} axisLine={false}/>
                                <Tooltip content={<VerticalBarTooltip/>}/>
                                <Bar dataKey="count" name="Клики" fill="#8b5cf6" radius={[0, 4, 4, 0]}/>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </SectionCard>
            </div>

            {/* Interaction summary */}
            <SectionCard title="Общая статистика" icon={BarChartIcon}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {INTERACTION_STATS.map(({label, key, icon: Icon, color}) => (
                        <div key={label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted">
                            <div className={`py-2 px-8 rounded-lg ${color}`}>
                                <Icon className="h-4 w-4"/>
                            </div>
                            <span className="text-xl font-bold text-foreground">{num(data.interactionSummary[key])}</span>
                            <span className="text-xs text-muted-foreground text-center">{label}</span>
                        </div>
                    ))}
                </div>
            </SectionCard>

            {/* Recent activity */}
            {data.recentActivity.length > 0 && (
                <SectionCard title="Последние события" icon={Activity}>
                    <div className="space-y-2 max-h-72 overflow-y-auto">
                        {groupEvents(data.recentActivity).map(({event, count}, i) => {
                            const DevIcon = DEVICE_ICONS[event.device || 'desktop'] || Monitor;
                            return (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 py-2 border-b border-border last:border-0"
                                >
                                    <div className="p-1.5 bg-muted rounded-lg shrink-0">
                                        <DevIcon className="h-3.5 w-3.5 text-muted-foreground"/>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground">
                                            {INTERACTION_LABELS[event.type] || event.type}
                                            {event.platform && (
                                                <span className="ml-1 text-muted-foreground font-normal">
                                                    · {event.platform}
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{formatTime(event.timestamp)}</p>
                                    </div>
                                    {count > 1 && (
                                        <span className="text-xs font-semibold text-muted-foreground shrink-0">
                                            ×{count}
                                        </span>
                                    )}
                                    {event.country && (
                                        <span className="text-xs text-muted-foreground shrink-0">
                                            {countryName(event.country)}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </SectionCard>
            )}
        </div>
    );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
    const {cardId} = useParams<{cardId: string}>();
    const navigate = useNavigate();
    const {user, isLoading: authLoading} = useAuth();
    const [data, setData] = useState<PremiumAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState<'7d' | '30d'>('30d');
    const [cardName, setCardName] = useState('');

    useEffect(() => {
        if (!authLoading && !user) navigate('/');
        else if (!authLoading && user?.accountType !== 'paid') navigate('/cards');
    }, [user, authLoading, navigate]);

    useEffect(() => {
        if (!user || !cardId || user.accountType !== 'paid') return;
        const load = async () => {
            try {
                setIsLoading(true);
                const [analyticsData, cardData] = await Promise.all([
                    api.getCardAnalytics(cardId, period),
                    api.getCard(cardId),
                ]);
                setData(analyticsData);
                setCardName(cardData.name || '');
            } catch {
                toast.error('Ошибка', 'Не удалось загрузить аналитику');
                navigate('/cards');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [user, cardId, period]);

    if (!user) return null;

    return (
        <ProfileLayout
            title={`Аналитика${cardName ? ` · ${cardName}` : ''}`}
            description="Подробная статистика просмотров и взаимодействий"
        >
            <div className="flex gap-2 mb-6 text-muted-foreground">
                {PERIODS.map((p) => (
                    <Button
                        key={p.value}
                        size="sm"
                        variant={period === p.value ? 'default' : 'outline'}
                        onClick={() => setPeriod(p.value)}
                        className={`flex items-center gap-1 ${period === p.value ? 'wd:(bg-blue-100 hover:bg-blue-100 text-blue-600)' : ''}`}
                    >
                        <Calendar className="h-3.5 w-3.5"/>
                        {p.label}
                    </Button>
                ))}
            </div>

            {isLoading ? (
                <LoadingSkeleton/>
            ) : data ? (
                <PremiumView data={data}/>
            ) : null}
        </ProfileLayout>
    );
}
