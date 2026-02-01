import {useAuth} from '@/contexts/AuthContext';
import {useDialog} from '@/contexts/DialogContext';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {useNavigate} from 'react-router-dom';
import {
    Check,
    Sparkles,
    Crown,
} from 'lucide-react';
import {FREE_FEATURES, PREMIUM_FEATURES} from "@/constants";

export default function PremiumPage() {
    const {user, isAuthenticated} = useAuth();
    const {openPaymentDialog, openLoginDialog} = useDialog();
    const navigate = useNavigate();

    const isPremium = user?.accountType === 'paid';

    const handleUpgradeToPremium = () => {
        if (!isAuthenticated) {
            openLoginDialog();
            return;
        }
        openPaymentDialog();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full mb-6">
                            <Crown className="h-5 w-5"/>
                            <span className="font-semibold">Linkoo Premium</span>
                        </div>
                        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Раскройте весь потенциал
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Получите неограниченные возможности для создания и управления вашими цифровыми визитками
                        </p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid md:grid-cols-2 gap-8 mb-16">
                        {/* Free Plan */}
                        <Card className="p-8 relative">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold mb-2">Free</h3>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-4xl font-bold">0₽</span>
                                    <span className="text-gray-600">/месяц</span>
                                </div>
                                <p className="text-gray-600">
                                    Базовый функционал для старта
                                </p>
                            </div>

                            <div className="space-y-3 mb-8">
                                {FREE_FEATURES.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <Check className="h-5 w-5 text-gray-400 shrink-0"/>
                                        <span className="text-gray-600">{feature.text}</span>
                                    </div>
                                ))}
                            </div>

                            {!isAuthenticated && (
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate('/')}
                                >
                                    Начать бесплатно
                                </Button>
                            )}
                        </Card>

                        {/* Premium Plan */}
                        <Card className="p-8 relative border-2 border-blue-500 shadow-2xl">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                    <Sparkles className="h-4 w-4"/>
                                    Популярный выбор
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Premium
                                </h3>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        299₽
                                    </span>
                                    <span className="text-gray-600">/месяц</span>
                                </div>
                                <p className="text-gray-600">
                                    Все возможности без ограничений
                                </p>
                            </div>

                            <div className="space-y-3 mb-8">
                                {PREMIUM_FEATURES.map((feature, index) => {
                                    return (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                                                <Check className="h-4 w-4 text-blue-600"/>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium mb-1">{feature.title}</p>
                                                <p className="text-sm text-gray-600">{feature.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {isPremium ? (
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 text-center">
                                    <div className="flex items-center justify-center gap-2 text-blue-700 font-semibold">
                                        <Crown className="h-5 w-5"/>
                                        <span>У вас уже Premium</span>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg h-12"
                                    onClick={handleUpgradeToPremium}
                                >
                                    <Sparkles className="h-5 w-5 mr-2"/>
                                    Перейти на Premium
                                </Button>
                            )}
                        </Card>
                    </div>

                    {/* Features Grid */}
                    {/* Данная секция на уточнении */}
                    {/*<div className="mb-16">*/}
                    {/*    <h2 className="text-3xl font-bold text-center mb-12">*/}
                    {/*        Что вы получаете с Premium*/}
                    {/*    </h2>*/}
                    {/*    <div className="grid md:grid-cols-3 gap-6">*/}
                    {/*        {PREMIUM_FEATURES.map((feature, index) => {*/}
                    {/*            const Icon = feature.icon;*/}
                    {/*            return (*/}
                    {/*                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">*/}
                    {/*                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mb-4">*/}
                    {/*                        <Icon className="h-6 w-6 text-blue-600"/>*/}
                    {/*                    </div>*/}
                    {/*                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>*/}
                    {/*                    <p className="text-gray-600 text-sm">{feature.description}</p>*/}
                    {/*                </Card>*/}
                    {/*            );*/}
                    {/*        })}*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    {/* FAQ Section */}
                    <Card className="p-8">
                        <h2 className="text-2xl font-bold mb-6 text-center">Часто задаваемые вопросы</h2>
                        <div className="space-y-6 max-w-3xl mx-auto">
                            <div>
                                <h3 className="font-semibold mb-2">Можно ли отменить подписку?</h3>
                                <p className="text-gray-600 text-sm">
                                    Да, вы можете отменить подписку в любой момент. После отмены доступ к Premium
                                    функциям сохранится до конца оплаченного периода.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Что происходит с моими карточками после
                                    отмены?</h3>
                                <p className="text-gray-600 text-sm">
                                    Все ваши карточки сохранятся, но вы сможете редактировать только одну (остальные
                                    будут в режиме просмотра). Custom домены перестанут работать.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Есть ли годовая подписка?</h3>
                                <p className="text-gray-600 text-sm">
                                    Да, годовая подписка доступна со скидкой 20%. Свяжитесь с нами для подробностей.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
