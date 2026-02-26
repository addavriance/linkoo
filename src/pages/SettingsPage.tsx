import {useEffect} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import {useNavigate} from 'react-router-dom';
import {Sun, Moon, Monitor, Smartphone} from 'lucide-react';
import {ProfileLayout} from '@/components/layout/ProfileLayout';
import {useTheme} from '@/contexts/ThemeContext';

const themeOptions = [
    {
        id: 'light' as const,
        label: 'Светлая',
        icon: Sun,
        preview: (
            <div className="w-full h-10 rounded bg-white border border-gray-200 flex items-center px-2 gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gray-200"/>
                <div className="flex-1 space-y-1">
                    <div className="h-1.5 rounded bg-gray-200 w-3/4"/>
                    <div className="h-1 rounded bg-gray-100 w-1/2"/>
                </div>
            </div>
        ),
    },
    {
        id: 'dark' as const,
        label: 'Тёмная',
        icon: Moon,
        preview: (
            <div className="w-full h-10 rounded bg-gray-900 border border-gray-700 flex items-center px-2 gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gray-600"/>
                <div className="flex-1 space-y-1">
                    <div className="h-1.5 rounded bg-gray-600 w-3/4"/>
                    <div className="h-1 rounded bg-gray-700 w-1/2"/>
                </div>
            </div>
        ),
    },
    {
        id: 'system' as const,
        label: 'Системная',
        icon: Monitor,
        preview: (
            <div className="w-full h-10 rounded border border-gray-200 flex overflow-hidden">
                <div className="w-1/2 bg-white flex items-center px-2 gap-1">
                    <div className="flex-1 space-y-1">
                        <div className="h-1.5 rounded bg-gray-200 w-full"/>
                        <div className="h-1 rounded bg-gray-100 w-2/3"/>
                    </div>
                </div>
                <div className="w-1/2 bg-gray-900 flex items-center px-2 gap-1">
                    <div className="flex-1 space-y-1">
                        <div className="h-1.5 rounded bg-gray-600 w-full"/>
                        <div className="h-1 rounded bg-gray-700 w-2/3"/>
                    </div>
                </div>
            </div>
        ),
    },
    {
        id: 'oled' as const,
        label: 'OLED',
        icon: Smartphone,
        preview: (
            <div className="w-full h-10 rounded bg-black border border-gray-800 flex items-center px-2 gap-1.5">
                <div className="w-3 h-3 rounded-full bg-gray-800"/>
                <div className="flex-1 space-y-1">
                    <div className="h-1.5 rounded bg-gray-800 w-3/4"/>
                    <div className="h-1 rounded bg-gray-900 w-1/2"/>
                </div>
            </div>
        ),
    },
];

export default function SettingsPage() {
    const {user, isLoading: authLoading} = useAuth();
    const navigate = useNavigate();
    const {theme, setTheme} = useTheme();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/');
        }
    }, [user, authLoading, navigate]);

    if (!authLoading && !user) {
        return null;
    }

    return (
        <ProfileLayout
            title="Настройки"
            description="Персонализируйте работу с Linkoo под себя"
        >
            <div className="space-y-6">
                {/* Appearance section */}
                <div className="border border-border rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-1">Оформление</h2>
                    <p className="text-sm text-muted-foreground mb-5">
                        Выберите тему интерфейса
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {themeOptions.map(({id, label, icon: Icon, preview}) => {
                            const isActive = theme === id;
                            return (
                                <button
                                    key={id}
                                    onClick={() => setTheme(id)}
                                    className={`
                                        flex flex-col gap-3 rounded-xl border-2 p-3 text-left transition-all duration-150
                                        ${isActive
                                            ? 'border-primary ring-2 ring-primary/20 bg-muted'
                                            : 'border-border hover:border-primary/40 hover:bg-muted'
                                        }
                                    `}
                                >
                                    {preview}
                                    <div className="flex items-center gap-2">
                                        <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}/>
                                        <span className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                            {label}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </ProfileLayout>
    );
}
