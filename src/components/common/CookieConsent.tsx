import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Switch} from '@/components/ui/switch';
import {Label} from '@/components/ui/label';
import {Cookie, Settings, X} from 'lucide-react';
import {Link} from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'linkoo_cookie_consent';

interface CookiePreferences {
    necessary: boolean;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
}

export function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true, // Всегда включены
        functional: false,
        analytics: false,
        marketing: false,
    });

    useEffect(() => {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            setTimeout(() => setShowBanner(true), 1000);
        }
    }, []);

    const savePreferences = (prefs: CookiePreferences) => {
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
        setShowBanner(false);
        setShowSettings(false);

        if (prefs.analytics) {
            /* логика для аналитики */
            // console.log('Analytics enabled');
        }
        if (prefs.marketing) {
            /* логика для маркетинга */
            // console.log('Marketing cookies enabled');
        }
    };

    const acceptAll = () => {
        const allAccepted: CookiePreferences = {
            necessary: true,
            functional: true,
            analytics: true,
            marketing: true,
        };
        savePreferences(allAccepted);
    };

    const rejectAll = () => {
        const onlyNecessary: CookiePreferences = {
            necessary: true,
            functional: false,
            analytics: false,
            marketing: false,
        };
        savePreferences(onlyNecessary);
    };

    const saveCustomPreferences = () => {
        savePreferences(preferences);
    };

    if (!showBanner) {
        return null;
    }

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5">
                <Card className="max-w-4xl mx-auto p-6 shadow-2xl border-2">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <Cookie className="h-8 w-8 text-blue-600"/>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">Мы используем файлы cookie</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Мы используем файлы cookie и аналогичные технологии для улучшения работы сайта,
                                анализа трафика и персонализации контента. Продолжая использовать наш сервис,
                                вы соглашаетесь с использованием cookie в соответствии с нашей{' '}
                                <Link to="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                                    Политикой конфиденциальности
                                </Link>.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <Button onClick={acceptAll} size="sm">
                                    Принять все
                                </Button>
                                <Button onClick={rejectAll} variant="outline" size="sm">
                                    Только необходимые
                                </Button>
                                <Button
                                    onClick={() => setShowSettings(true)}
                                    variant="outline"
                                    size="sm"
                                >
                                    <Settings className="h-4 w-4 mr-2"/>
                                    Настроить
                                </Button>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowBanner(false)}
                            className="flex-shrink-0"
                        >
                            <X className="h-4 w-4"/>
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Cookie Settings Dialog */}
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5"/>
                            Настройки cookie
                        </DialogTitle>
                        <DialogDescription>
                            Управляйте своими предпочтениями cookie. Вы можете изменить эти настройки в любое время.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Необходимые cookie */}
                        <div className="flex items-start justify-between space-x-4 pb-4 border-b">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Label className="text-base font-semibold">Необходимые cookie</Label>
                                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">Всегда активны</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Эти файлы cookie необходимы для базовой работы сайта и не могут быть отключены.
                                    Они используются для аутентификации, безопасности и сохранения ваших настроек.
                                </p>
                            </div>
                            <Switch checked={true} disabled/>
                        </div>

                        {/* Функциональные cookie */}
                        <div className="flex items-start justify-between space-x-4 pb-4 border-b">
                            <div className="flex-1">
                                <Label className="text-base font-semibold mb-2 block">Функциональные cookie</Label>
                                <p className="text-sm text-gray-600">
                                    Эти файлы cookie позволяют сайту запоминать ваши предпочтения (например, выбор темы,
                                    язык) и предоставлять расширенные функции и персонализацию.
                                </p>
                            </div>
                            <Switch
                                checked={preferences.functional}
                                onCheckedChange={(checked) =>
                                    setPreferences({...preferences, functional: checked})
                                }
                            />
                        </div>

                        {/* Аналитические cookie */}
                        <div className="flex items-start justify-between space-x-4 pb-4 border-b">
                            <div className="flex-1">
                                <Label className="text-base font-semibold mb-2 block">Аналитические cookie</Label>
                                <p className="text-sm text-gray-600">
                                    Эти файлы cookie помогают нам понять, как посетители взаимодействуют с сайтом,
                                    собирая и передавая информацию анонимно. Это помогает нам улучшать работу сайта.
                                </p>
                            </div>
                            <Switch
                                checked={preferences.analytics}
                                onCheckedChange={(checked) =>
                                    setPreferences({...preferences, analytics: checked})
                                }
                            />
                        </div>

                        {/* Маркетинговые cookie */}
                        <div className="flex items-start justify-between space-x-4">
                            <div className="flex-1">
                                <Label className="text-base font-semibold mb-2 block">Маркетинговые cookie</Label>
                                <p className="text-sm text-gray-600">
                                    Эти файлы cookie используются для отслеживания посетителей на веб-сайтах.
                                    Намерение состоит в том, чтобы показывать рекламу, которая актуальна и интересна
                                    для отдельного пользователя.
                                </p>
                            </div>
                            <Switch
                                checked={preferences.marketing}
                                onCheckedChange={(checked) =>
                                    setPreferences({...preferences, marketing: checked})
                                }
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                        <Button onClick={saveCustomPreferences} className="flex-1">
                            Сохранить настройки
                        </Button>
                        <Button onClick={acceptAll} variant="outline" className="flex-1">
                            Принять все
                        </Button>
                    </div>

                    <p className="text-xs text-gray-500 text-center mt-4">
                        Подробнее о том, как мы используем cookie, читайте в нашей{' '}
                        <Link to="/privacy" className="text-blue-600 hover:text-blue-800 underline">
                            Политике конфиденциальности
                        </Link>.
                    </p>
                </DialogContent>
            </Dialog>
        </>
    );
}
