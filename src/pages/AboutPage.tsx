import {Card} from '@/components/ui/card';
import {
    Sparkles,
    Zap,
    Shield,
    Globe,
    Users,
    TrendingUp,
    Heart,
    Target,
} from 'lucide-react';
import {HOW_IT_WORKS} from "@/constants";

export default function AboutPage() {
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
        <div className="container mx-auto px-4 py-10">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Hero Section */}
                <section className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">
                        О проекте Linkoo
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Современная платформа для создания интерактивных цифровых визиток.
                        Мы делаем нетворкинг простым, быстрым и экологичным.
                    </p>
                </section>

                {/* Mission */}
                <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        <div className="flex-shrink-0">
                            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-rose-50">
                                <Heart className="h-8 w-8 text-rose-500" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-3">Наша миссия</h2>
                            <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                                Мы верим, что обмен контактами должен быть простым и экологичным.
                                Linkoo создан для того, чтобы каждый мог легко создать профессиональную
                                цифровую визитку и делиться ею одним касанием. Мы стремимся сделать
                                нетворкинг доступным для всех, сохраняя при этом планету от миллионов
                                бумажных визиток.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Features */}
                <section className="space-y-8">
                    <h2 className="text-3xl font-bold text-center">Почему Linkoo?</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <Card
                                    key={idx}
                                    className="p-6 hover:shadow-md transition-shadow border border-slate-100"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <Icon className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold mb-1">{feature.title}</h3>
                                            <p className="text-gray-600 text-sm md:text-base">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                {/* Use Cases */}
                <section className="space-y-8">
                    <h2 className="text-3xl font-bold text-center">Для кого Linkoo?</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {useCases.map((useCase, idx) => {
                            const Icon = useCase.icon;
                            return (
                                <Card
                                    key={idx}
                                    className="p-6 text-center hover:shadow-md transition-shadow border border-slate-100"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                                        <Icon className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                                    <p className="text-gray-600 text-sm md:text-base">
                                        {useCase.description}
                                    </p>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                {/* How it works */}
                <section>
                    <h2 className="text-3xl font-bold text-center mb-8">Как это работает?</h2>
                    <Card className="p-8">
                        <div className="space-y-6">
                            {HOW_IT_WORKS.map((item) => (
                                <div key={item.step} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                        {item.step}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg md:text-xl font-semibold mb-1">{item.title}</h3>
                                        <p className="text-gray-600 text-sm md:text-base">
                                            {item.text}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </section>


                {/* Environmental Impact */}
                <Card className="p-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-4">
                            <Globe className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3">Вклад в экологию</h2>
                        <p className="text-gray-700 text-base md:text-lg max-w-3xl mx-auto mb-4 leading-relaxed">
                            Цифровые визитки помогают сократить использование бумаги и защитить окружающую среду.
                            Один раз создав цифровую визитку, вы можете делиться ею неограниченное количество раз
                            без необходимости печати новых карточек.
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
