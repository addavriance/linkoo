import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {
    Sparkles, Share2, Palette, Zap, Globe, Users, ArrowRight, Star, TrendingUp, Smartphone
} from 'lucide-react';

const HomePage = () => {
    const navigate = useNavigate();
    // const [animationStep, setAnimationStep] = useState(0);

    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setAnimationStep(prev => (prev + 1) % 3);
    //     }, 2000);
    //     return () => clearInterval(timer);
    // }, []);

    const features = [{
        icon: <Palette className="h-6 w-6"/>,
        title: "30+ Тем",
        description: "От минимализма до ярких градиентов",
        color: "bg-purple-500"
    }, {
        icon: <Share2 className="h-6 w-6"/>,
        title: "Умное Сжатие",
        description: "Ссылки в 10 раз короче конкурентов",
        color: "bg-blue-500"
    }, {
        icon: <Zap className="h-6 w-6"/>,
        title: "Мгновенно",
        description: "Создание карточки за 30 секунд",
        color: "bg-green-500"
    }, {
        icon: <Smartphone className="h-6 w-6"/>,
        title: "Адаптивно",
        description: "Отлично работает на всех устройствах",
        color: "bg-orange-500"
    }];

    const stats = [{number: "500K+", label: "Карточек создано", icon: <Users className="h-5 w-5"/>}, {
        number: "150+",
        label: "Стран используют",
        icon: <Globe className="h-5 w-5"/>
    }, {number: "4.9", label: "Рейтинг пользователей", icon: <Star className="h-5 w-5"/>}, {
        number: "99.9%",
        label: "Время работы",
        icon: <TrendingUp className="h-5 w-5"/>
    }];

    return (<div className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative px-6 pt-20 pb-16 text-center lg:px-8 lg:pt-32 lg:pb-24">
            <div className="mx-auto max-w-4xl">
                {/* Badge */}
                <div className="mb-8 flex justify-center">
                    <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 text-sm font-medium">
                        <Sparkles className="h-4 w-4 text-yellow-500"/>
                        Новое поколение цифровых визиток
                    </Badge>
                </div>

                {/* Заголовок */}
                <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                    Создавай{" "}
                    <span className="relative">
              <span className="text-gradient-linkoo">визитки</span>
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
                        className="hero-button btn-gradient w-full px-8 py-4 text-lg sm:w-auto click-feedback"
                        onClick={() => navigate('/editor')}
                    >
                        Создать визитку
                        <ArrowRight
                            className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"/>
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="hero-button w-full px-8 py-4 text-lg sm:w-auto hover-lift click-feedback"
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

        {/* Stats Section */}
        <section className="px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center stat-item">
                            <div className="mb-2 flex justify-center text-blue-600 stat-icon">
                                {stat.icon}
                            </div>
                            <div
                                className="text-3xl font-bold text-gray-900 sm:text-4xl transition-colors duration-300">
                                {stat.number}
                            </div>
                            <div className="text-sm text-gray-600 sm:text-base">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Demo Section */}
        <section className="px-6 py-16 lg:px-8 bg-gray-50">
            <div className="mx-auto max-w-4xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
                    Посмотрите как это работает
                </h2>

                <div className="relative mx-auto max-w-lg select-none">
                    {/* Phone mockup */}
                    <div
                        className="relative mx-auto h-[600px] w-[300px] rounded-[3rem] border-8 border-gray-800 bg-gray-800">
                        <div className="absolute inset-2 rounded-[2rem] bg-white overflow-hidden">
                            {/* Demo card with animation */}
                            <div
                                className="p-6 h-full flex flex-col justify-center text-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                <div className="mb-4">
                                    <div
                                        className="mx-auto h-20 w-20 rounded-full bg-white/20 mb-4 flex items-center justify-center text-2xl">
                                        👨‍💻
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Иван Петров</h3>
                                    <p className="text-sm opacity-90 mb-4">Frontend Developer</p>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="bg-white/20 rounded-lg p-2">📧 ivan@linkoo.app</div>
                                    <div className="bg-white/20 rounded-lg p-2">📱 +7 999 123-45-67</div>
                                </div>

                                <div className="mt-4 flex justify-center space-x-2">
                                    <div className="h-8 w-8 rounded bg-white/20"></div>
                                    <div className="h-8 w-8 rounded bg-white/20"></div>
                                    <div className="h-8 w-8 rounded bg-white/20"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Animation indicators */}
                    {/*<div className="absolute -left-4 top-1/2 -translate-y-1/2">*/}
                    {/*    <div*/}
                    {/*        className={`h-4 w-4 rounded-full bg-green-500 transition-all duration-500 ${animationStep === 0 ? 'animate-ping' : ''}`}/>*/}
                    {/*    <p className="mt-2 text-sm font-medium text-gray-700">Тап</p>*/}
                    {/*</div>*/}

                    {/*<div className="absolute -right-4 top-1/2 -translate-y-1/2">*/}
                    {/*    <div*/}
                    {/*        className={`h-4 w-4 rounded-full bg-blue-500 transition-all duration-500 ${animationStep === 1 ? 'animate-ping' : ''}`}/>*/}
                    {/*    <p className="mt-2 text-sm font-medium text-gray-700">Сканирование</p>*/}
                    {/*</div>*/}

                    {/*<div className="absolute -bottom-4 left-1/2 -translate-x-1/2">*/}
                    {/*    <div*/}
                    {/*        className={`h-4 w-4 rounded-full bg-purple-500 transition-all duration-500 ${animationStep === 2 ? 'animate-ping' : ''}`}/>*/}
                    {/*    <p className="mt-2 text-sm font-medium text-gray-700">Готово!</p>*/}
                    {/*</div>*/}
                </div>
            </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
                    Готовы произвести впечатление?
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                    Присоединяйтесь к тысячам профессионалов, которые уже используют Linkoo для эффективного
                    нетворкинга
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
