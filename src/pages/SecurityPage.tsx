import {useEffect, useState} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import {api} from '@/lib/api';
import {toast} from '@/lib/toast';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {useNavigate} from 'react-router-dom';
import {Monitor, Smartphone} from 'lucide-react';
import {SessionResponse} from "@/types";
import {ProfileLayout} from '@/components/layout/ProfileLayout';

function getSessionIcon(deviceInfo: string) {
    if (deviceInfo.includes('iPhone') || deviceInfo.includes('Android')) {
        return <Smartphone className="h-4 w-4 text-gray-500"/>;
    }
    return <Monitor className="h-4 w-4 text-gray-500"/>;
}

function formatSessionDate(dateStr: string): string {
    const date = new Date(dateStr);
    const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Вчера';
    return date.toLocaleDateString('ru-RU', {day: 'numeric', month: 'long'});
}

function SessionSkeleton() {
    return (
        <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="h-4 w-4 bg-gray-300 rounded"/>
                <div>
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-48 bg-gray-300 rounded"/>
                    </div>
                    <div className="h-3 w-32 bg-gray-300 rounded mt-1"/>
                </div>
            </div>
            <div className="h-8 w-20 bg-gray-300 rounded"/>
        </div>
    );
}

function getDeviceInfo(userAgent: string) {
    const ua = userAgent.toLowerCase();

    let platform = 'Неизвестно';
    let osVersion = '';

    if (ua.includes('iphone')) {
        platform = 'iPhone';
        const iosMatch = ua.match(/os (\d+)_(\d+)(?:_(\d+))?/);
        if (iosMatch) {
            osVersion = ` ${iosMatch[1]}.${iosMatch[2]}`;
        }
    } else if (ua.includes('ipad')) {
        platform = 'iPad';
        const iosMatch = ua.match(/os (\d+)_(\d+)(?:_(\d+))?/);
        if (iosMatch) {
            osVersion = ` ${iosMatch[1]}.${iosMatch[2]}`;
        }
    } else if (ua.includes('android')) {
        platform = 'Android';
        const androidMatch = ua.match(/android (\d+(?:\.\d+)?)/);
        if (androidMatch) {
            osVersion = ` ${androidMatch[1]}`;
        }
    } else if (ua.includes('windows')) {
        platform = 'Windows';
        if (ua.includes('windows nt 10.0')) osVersion = ' 10/11';
        else if (ua.includes('windows nt 6.3')) osVersion = ' 8.1';
        else if (ua.includes('windows nt 6.2')) osVersion = ' 8';
        else if (ua.includes('windows nt 6.1')) osVersion = ' 7';
    } else if (ua.includes('macintosh') || ua.includes('mac os x')) {
        platform = 'macOS';
        const macMatch = ua.match(/mac os x (\d+)_(\d+)(?:_(\d+))?/);
        if (macMatch) {
            osVersion = ` ${macMatch[1]}.${macMatch[2]}`;
        }
    } else if (ua.includes('linux')) {
        platform = 'Linux';
    }

    let browser = 'Неизвестно';
    if (ua.includes('edg/') || ua.includes('edge/')) {
        const edgeMatch = ua.match(/edg?e?\/(\d+)/);
        browser = edgeMatch ? `Edge ${edgeMatch[1]}` : 'Edge';
    } else if (ua.includes('chrome/') && !ua.includes('edg/')) {
        const chromeMatch = ua.match(/chrome\/(\d+)/);
        browser = chromeMatch ? `Chrome ${chromeMatch[1]}` : 'Chrome';
    } else if (ua.includes('firefox/')) {
        const firefoxMatch = ua.match(/firefox\/(\d+)/);
        browser = firefoxMatch ? `Firefox ${firefoxMatch[1]}` : 'Firefox';
    } else if (ua.includes('safari/') && !ua.includes('chrome/') && !ua.includes('edg/')) {
        const safariMatch = ua.match(/version\/(\d+)/);
        browser = safariMatch ? `Safari ${safariMatch[1]}` : 'Safari';
    } else if (ua.includes('opera/') || ua.includes('opr/')) {
        const operaMatch = ua.match(/(?:opera|opr)\/(\d+)/);
        browser = operaMatch ? `Opera ${operaMatch[1]}` : 'Opera';
    }

    return `${platform}${osVersion} • ${browser}`;
}

export default function SecurityPage() {
    const {user, isLoading: authLoading, logout} = useAuth();
    const [sessions, setSessions] = useState<SessionResponse[]>([]);
    const [isLoadingSessions, setIsLoadingSessions] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/');
        }

        if (!authLoading && user) {
            setIsLoadingSessions(true);
            api.getSessions().then(sessions => {
                setSessions(sessions);
                setIsLoadingSessions(false);
            }).catch(() => {
                setIsLoadingSessions(false);
            });
        }
    }, [user, authLoading, navigate]);

    const handleRevokeSession = async (sessionId: string) => {
        await api.revokeSession(sessionId).then(() => {
            setSessions(prev => prev.filter(s => s._id !== sessionId));
        });

        toast.success('Сессия отозвана');
    };

    const handleLogoutAll = async () => {
        try {
            await api.logoutAll();
            toast.success('Вы вышли из всех сессий');
        } catch {
            toast.error('Не удалось выйти из всех сессий');
        }
        await logout();
        navigate('/');
    };

    if (!authLoading && !user) {
        return null;
    }

    const isCurrentSession = (token: string) => {
        const refreshToken = localStorage.getItem('refreshToken');
        return token == refreshToken;
    }

    return (
        <ProfileLayout
            title="Безопасность"
            description="Управляйте настройками безопасности вашего аккаунта"
        >
            {/* Active Sessions */}
            <Card className="p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Активные сессии</h2>
                        <Button variant="outline" size="sm" onClick={handleLogoutAll}>
                            Выйти из всех
                        </Button>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                        Управляйте устройствами, на которых выполнен вход в ваш аккаунт.
                        Если вы заметили подозрительную активность, отзовите доступ и смените пароль.
                    </p>

                    <div className="space-y-2">
                        {isLoadingSessions ? (
                            <>
                                <SessionSkeleton />
                                <SessionSkeleton />
                                <SessionSkeleton />
                            </>
                        ) : (
                            sessions.map((session) => (
                                <div
                                    key={session._id}
                                    className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                                        isCurrentSession(session.token)
                                            ? 'bg-blue-50 border-2 border-blue-200'
                                            : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {getSessionIcon(session.deviceInfo)}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">{getDeviceInfo(session.deviceInfo)}</span>
                                                {isCurrentSession(session.token) && (
                                                    <span
                                                        className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                                                        Текущая сессия
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {session.ipAddress} · {formatSessionDate(session.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    {!isCurrentSession(session.token) && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRevokeSession(session._id)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            Отозвать
                                        </Button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </Card>
        </ProfileLayout>
    );
}
