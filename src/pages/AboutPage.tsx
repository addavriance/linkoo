import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Link, useNavigate} from 'react-router-dom';
import {
    Sparkles,
    Zap,
    Shield,
    Globe,
    Users,
    TrendingUp,
    Heart,
    Target,
    CheckCircle,
    Star,
    Award,
    Rocket,
} from 'lucide-react';

export default function AboutPage() {
    const navigate = useNavigate();

    const features = [
        {
            icon: Zap,
            title: 'Молниеносная скорость',
            description: 'Создавайте и делитесь визитками за считанные секунды',
        },
        {
            icon: Shield,
            title: 'Безопасность',
            description: 'Ваши данные защищены современными методами шифрования',
        },
        {
            icon: Globe,
            title: 'Доступность',
            description: 'Работает на всех устройствах и платформах',
        },
        {
            icon: Users,
            title: 'Удобство',
            description: 'Интуитивный интерфейс, понятный каждому',
        },
    ];

    const stats = [
        {label: 'Активных пользователей', value: '1000+', icon: Users},
        {label: 'Созданных визиток', value: '5000+', icon: Star},
        {label: 'Стран', value: '50+', icon: Globe},
        {label: 'Рейтинг', value: '4.9/5', icon: Award},
    ];

    const useCases = [
        {
            title: 'Для бизнеса',
            description: 'Профессиональные визитки для нетворкинга и деловых встреч',
            icon: Target,
        },
        {
            title: 'Для творческих людей',
            description: 'Портфолио и контакты в одной красивой визитке',
            icon: Sparkles,
        },
        {
            title: 'Для мероприятий',
            description: 'Быстрый обмен контактами на конференциях и встречах',
            icon: TrendingUp,
        },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-3xl mb-6">
                        L
                    </div>
                    <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        О проекте Linkoo
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Современная платформа для создания интерактивных цифровых визиток.
                        Мы делаем нетворкинг простым, быстрым и экологичным.
                    </p>
                </div>

                {/* Mission */}
                <Card className="p-8 mb-12 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <Heart className="h-12 w-12 text-red-500"/>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Наша миссия</h2>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                Мы верим, что обмен контактами должен быть простым и экологичным.
                                Linkoo создан для того, чтобы каждый мог легко создать профессиональную
                                цифровую визитку и делиться ею одним касанием. Мы стремимся сделать
                                нетворкинг доступным для всех, сохраняя при этом планету от миллионов
                                бумажных визиток.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={idx} className="p-6 text-center hover:shadow-lg transition-shadow">
                                <Icon className="h-8 w-8 mx-auto mb-2 text-blue-600"/>
                                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </Card>
                        );
                    })}
                </div>

                {/* Features */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-center mb-8">Почему Linkoo?</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <Icon className="h-6 w-6 text-blue-600"/>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                            <p className="text-gray-600">{feature.description}</p>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* Use Cases */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-center mb-8">Для кого Linkoo?</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {useCases.map((useCase, idx) => {
                            const Icon = useCase.icon;
                            return (
                                <Card
                                    key={idx}
                                    className="p-6 text-center hover:shadow-lg transition-shadow hover:border-blue-300"
                                >
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
                                        <Icon className="h-8 w-8 text-white"/>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                                    <p className="text-gray-600">{useCase.description}</p>
                                </Card>
                            );
                        })}
                    </div>
                </div>

                {/* How it works */}
                <Card className="p-8 mb-12">
                    <h2 className="text-3xl font-bold text-center mb-8">Как это работает?</h2>
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                1
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">Регистрация</h3>
                                <p className="text-gray-600">
                                    Войдите через удобный OAuth-провайдер (Google, VK, Discord, GitHub)
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                2
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">Создание визитки</h3>
                                <p className="text-gray-600">
                                    Добавьте информацию о себе, выберите тему и социальные сети
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                3
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">Получите короткую ссылку</h3>
                                <p className="text-gray-600">
                                    Автоматически создается короткая ссылка linkoo.dev/yourname
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                4
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-semibold mb-2">Делитесь</h3>
                                <p className="text-gray-600">
                                    Отправляйте ссылку, показывайте QR-код или используйте NFC
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Free vs Premium */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-center mb-8">Выберите подходящий план</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Free */}
                        <Card className="p-6 hover:shadow-lg transition-shadow">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                                    <Award className="h-6 w-6 text-gray-600"/>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Free</h3>
                                <div className="text-3xl font-bold text-gray-900">
                                    0 ₽<span className="text-lg text-gray-500">/месяц</span>
                                </div>
                            </div>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600"/>
                                    <span>1 визитка</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600"/>
                                    <span>Базовые темы</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600"/>
                                    <span>QR-код</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600"/>
                                    <span>Базовая статистика</span>
                                </li>
                            </ul>
                            <Button variant="outline" className="w-full" onClick={() => navigate('/editor')}>
                                Начать бесплатно
                            </Button>
                        </Card>

                        {/* Premium */}
                        <Card className="p-6 border-2 border-purple-600 hover:shadow-lg transition-shadow relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                Популярный
                            </div>
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 mb-3">
                                    <Star className="h-6 w-6 text-purple-600"/>
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                                <div className="text-3xl font-bold text-purple-600">
                                    299 ₽<span className="text-lg text-gray-500">/месяц</span>
                                </div>
                            </div>
                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-purple-600"/>
                                    <span className="font-semibold">Неограниченно визиток</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-purple-600"/>
                                    <span>Все темы и настройки</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-purple-600"/>
                                    <span>Пользовательские ссылки</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-purple-600"/>
                                    <span>Расширенная статистика</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-purple-600"/>
                                    <span>Приоритетная поддержка</span>
                                </li>
                            </ul>
                            <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                Обновить до Premium
                            </Button>
                        </Card>
                    </div>
                </div>

                {/* Environmental Impact */}
                <Card className="p-8 mb-12 bg-gradient-to-r from-green-50 to-blue-50">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                            <Globe className="h-8 w-8 text-green-600"/>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Вклад в экологию</h2>
                        <p className="text-gray-700 text-lg max-w-3xl mx-auto mb-6">
                            Каждая цифровая визитка Linkoo спасает до 10 бумажных карточек от производства.
                            Вместе мы уже сэкономили более 50,000 бумажных визиток и продолжаем делать мир
                            немного чище каждый день. 🌱
                        </p>
                        <div className="text-5xl mb-2">🌍</div>
                        <p className="text-gray-600">За экологичный нетворкинг!</p>
                    </div>
                </Card>

                {/* CTA */}
                <Card className="p-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <Rocket className="h-12 w-12 mx-auto mb-4"/>
                    <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
                    <p className="text-xl mb-6 opacity-90">
                        Создайте свою первую цифровую визитку прямо сейчас
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-gray-100"
                            onClick={() => navigate('/editor')}
                        >
                            Создать визитку
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white text-white hover:bg-white/10"
                            onClick={() => navigate('/themes')}
                        >
                            Посмотреть темы
                        </Button>
                    </div>
                </Card>

                {/* Footer */}
                <div className="text-center pt-8 mt-8 border-t">
                    <p className="text-gray-600 mb-4">
                        Есть вопросы? Свяжитесь с нами:{' '}
                        <a href="mailto:hello@linkoo.dev" className="text-blue-600 hover:text-blue-800">
                            hello@linkoo.dev
                        </a>
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
                            Конфиденциальность
                        </Link>
                        <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                            Условия использования
                        </Link>
                        <Link to="/api" className="text-blue-600 hover:text-blue-800">
                            API
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
