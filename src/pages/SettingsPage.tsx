import {useEffect} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import {Card} from '@/components/ui/card';
import {useNavigate} from 'react-router-dom';
import {Settings, Moon, Globe, Bell, Palette} from 'lucide-react';

export default function SettingsPage() {
    const {user, isLoading: authLoading} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/');
        }
    }, [user, authLoading, navigate]);

    if (!authLoading && !user) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        {/*<Settings className="h-8 w-8 text-blue-600"/>*/}
                        <h1 className="text-3xl font-bold">Настройки</h1>
                    </div>
                    <p className="text-gray-600">
                        Персонализируйте работу с Linkoo под себя
                    </p>
                </div>

                {/* Coming Soon */}
                <Card className="p-12 text-center">
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mb-6">
                            <Settings className="h-10 w-10 text-blue-600"/>
                        </div>
                        <h2 className="text-2xl font-bold mb-3">Настройки в разработке</h2>
                        <p className="text-gray-600 max-w-md mb-8">
                            Скоро здесь появятся настройки темы, языка, уведомлений и другие возможности
                            персонализации
                        </p>

                        {/* Preview Features */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <Moon className="h-6 w-6 text-gray-400 mx-auto mb-2"/>
                                <p className="text-xs text-gray-600 font-medium">Темная тема</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <Globe className="h-6 w-6 text-gray-400 mx-auto mb-2"/>
                                <p className="text-xs text-gray-600 font-medium">Язык</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <Bell className="h-6 w-6 text-gray-400 mx-auto mb-2"/>
                                <p className="text-xs text-gray-600 font-medium">Уведомления</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <Palette className="h-6 w-6 text-gray-400 mx-auto mb-2"/>
                                <p className="text-xs text-gray-600 font-medium">Персонализация</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
