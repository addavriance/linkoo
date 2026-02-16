import {useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {
    Sparkles, Share2, Palette, Zap, ArrowRight, Smartphone
} from 'lucide-react';
import {CardsCarousel} from '@/components/CardsCarousel';

const HomePage = () => {
    const navigate = useNavigate();

    const features = [{
        icon: <Palette className="h-6 w-6"/>,
        title: "30+ Тем оформления",
        description: "От минимализма до ярких градиентов",
        color: "bg-purple-500"
    }, {
        icon: <Share2 className="h-6 w-6"/>,
        title: "Короткие ссылки",
        description: "Компактные ссылки вида linkoo.dev/yourname",
        color: "bg-blue-500"
    }, {
        icon: <Zap className="h-6 w-6"/>,
        title: "Быстрое создание",
        description: "Создайте визитку за пару минут",
        color: "bg-green-500"
    }, {
        icon: <Smartphone className="h-6 w-6"/>,
        title: "Адаптивный дизайн",
        description: "Отлично работает на всех устройствах",
        color: "bg-orange-500"
    }];

    return (<div className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative px-6 pt-20 pb-16 text-center lg:px-8 lg:pt-32 lg:pb-24">
            <div className="mx-auto max-w-4xl">
                {/* Заголовок */}
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                    Создавай{" "}
                    <span className="relative">
              <span className="bg-gradient-to-r from-linkoo-600 to-accent-600 bg-clip-text text-transparent">визитки</span>
              <svg
                  className="absolute -bottom-2 left-0 h-3 w-full text-blue-300"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    d="M5 6C50 2 100 2 150 6 200 10 250 8 295 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="animate-pulse"
                />
              </svg>
            </span>{" "}
                    будущего
                </h1>

                {/* Подзаголовок */}
                <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
                    Linkoo — это современная платформа для создания интерактивных цифровых визиток.
                    Делись контактами одним тапом, создавай впечатление и строй связи.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button
                        size="lg"
                        className="hero-button btn-gradient w-full px-8 py-4 text-lg sm:w-auto click-feedback group"
                        onClick={() => navigate('/editor')}
                    >
                        Создать визитку
                        <ArrowRight
                            className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"/>
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="hero-button btn w-full px-8 py-4 text-lg sm:w-auto hover-lift click-feedback group"
                        onClick={() => navigate('/themes')}
                    >
                        Посмотреть темы
                        <Palette className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:rotate-12"/>
                    </Button>
                </div>
            </div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div
                    className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl"/>
                <div
                    className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-pink-400/20 to-orange-400/20 blur-3xl"/>
                <div
                    className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-green-400/20 to-blue-400/20 blur-3xl"/>
            </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                        Почему выбирают Linkoo?
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Мы создали самую современную платформу для цифровых визиток с фокусом на скорость и удобство
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="feature-card group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-soft hover:shadow-strong"
                        >
                            <CardContent className="p-6">
                                <div
                                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                    {feature.icon}
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-blue-600">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 transition-colors duration-200">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* Demo Section */}
        <section className="px-6 py-16 lg:px-8 bg-gray-50">
            <div className="mx-auto max-w-7xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-12">
                    Посмотрите как это работает
                </h2>
                <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
                    Реальные примеры визиток с разными темами оформления
                </p>

                <CardsCarousel />
            </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
                    Готовы произвести впечатление?
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Начните использовать Linkoo для эффективного нетворкинга и обмена контактами
                </p>

                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button
                        size="lg"
                        className="hero-button btn-gradient w-full px-8 py-4 text-lg sm:w-auto click-feedback group"
                        onClick={() => navigate('/editor')}
                    >
                        Создать бесплатно
                        <Sparkles
                            className="ml-2 h-5 w-5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110"/>
                    </Button>

                    <p className="text-sm text-gray-500 transition-colors duration-200 hover:text-gray-700">
                        Никаких регистраций • Полностью бесплатно • Мгновенный результат
                    </p>
                </div>
            </div>
        </section>
    </div>);
};

export default HomePage;
