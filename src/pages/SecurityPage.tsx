import {useEffect, useState} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import {api} from '@/lib/api';
import {toast} from '@/lib/toast';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {useNavigate} from 'react-router-dom';
import {Monitor, Smartphone} from 'lucide-react';

// TODO: подключить к беку — GET /api/auth/sessions (модель RefreshToken)
interface Session {
    id: string;
    deviceInfo: string;
    ipAddress: string;
    createdAt: string;
    isCurrentSession: boolean;
}

const MOCK_SESSIONS: Session[] = [
    {
        id: 'session-1',
        deviceInfo: 'Chrome — macOS',
        ipAddress: '192.168.1.1',
        createdAt: new Date().toISOString(),
        isCurrentSession: true,
    },
    {
        id: 'session-2',
        deviceInfo: 'Safari — iPhone',
        ipAddress: '10.0.0.45',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isCurrentSession: false,
    },
    {
        id: 'session-3',
        deviceInfo: 'Firefox — Windows',
        ipAddress: '172.16.0.12',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        isCurrentSession: false,
    },
];

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

export default function SecurityPage() {
    const {user, isLoading: authLoading, logout} = useAuth();
    const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/');
        }
    }, [user, authLoading, navigate]);

    // TODO: подключить к беку — отозвать конкретный refresh token
    const handleRevokeSession = (sessionId: string) => {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
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

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        {/*<Shield className="h-8 w-8 text-blue-600"/>*/}
                        <h1 className="text-3xl font-bold">Безопасность</h1>
                    </div>
                    <p className="text-gray-600">
                        Управляйте активными сессиями и настройками безопасности вашего аккаунта
                    </p>
                </div>

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
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                                    session.isCurrentSession
                                        ? 'bg-blue-50 border-2 border-blue-200'
                                        : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {getSessionIcon(session.deviceInfo)}
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">{session.deviceInfo}</span>
                                            {session.isCurrentSession && (
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
                                {!session.isCurrentSession && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRevokeSession(session.id)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        Отозвать
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}
