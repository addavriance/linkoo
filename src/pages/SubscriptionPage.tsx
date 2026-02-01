import {useState, useEffect} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import {useDialog} from '@/contexts/DialogContext';
import {api} from '@/lib/api';
import {toast} from '@/lib/toast';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {PaymentMethodCard} from '@/components/subscription/PaymentMethodCard';
import {Crown, Check, Sparkles, CreditCard, History, Plus, Loader2} from 'lucide-react';
import type {PaymentMethod, Payment} from '@/types';
import {useNavigate} from "react-router-dom";
import {PREMIUM_FEATURES} from "@/constants";
import {PaymentHistoryItem} from "@/components/subscription/PaymentHistoryItem.tsx";

export default function SubscriptionPage() {
    const {user, isAuthenticated, isLoading: authLoading} = useAuth();
    const {openPaymentDialog, openLinkCardDialog} = useDialog();
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
    const [isLoadingMethods, setIsLoadingMethods] = useState(true);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [activeTab, setActiveTab] = useState('methods');

    const navigate = useNavigate();

    const isPremium = user?.accountType === 'paid';

    useEffect(() => {
        if (isAuthenticated) {
            loadPaymentMethods();
            loadPaymentHistory();
        } else if (!authLoading) {
            navigate('/premium')
        }
    }, [isAuthenticated, authLoading, navigate]);

    const loadPaymentMethods = async () => {
        try {
            setIsLoadingMethods(true);
            const methods = await api.getPaymentMethods();
            setPaymentMethods(methods);
        } catch (error) {
            console.error('Failed to load payment methods:', error);
        } finally {
            setIsLoadingMethods(false);
        }
    };

    const loadPaymentHistory = async () => {
        try {
            setIsLoadingHistory(true);
            const history = await api.getPaymentHistory();
            setPaymentHistory(history);
        } catch (error) {
            console.error('Failed to load payment history:', error);
            toast.error('Ошибка', 'Не удалось загрузить историю платежей');
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const handleDeleteMethod = async (methodId: string) => {
        try {
            await api.deletePaymentMethod(methodId);
            toast.success('Способ оплаты удален');
            await loadPaymentMethods();
        } catch (error) {
            toast.error('Ошибка', 'Не удалось удалить способ оплаты');
        }
    };

    const formatExpiryDate = () => {
        if (!user?.subscription?.expiresAt) return '';
        const date = new Date(user.subscription.expiresAt);
        return new Intl.DateTimeFormat('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Подписки</h1>
                        <p className="text-gray-600">Управляйте своими подписками на Linkoo Premium</p>
                    </div>

                    {/* Current Subscription */}
                    <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"/>

                        <div className="relative">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                        <Crown className="h-6 w-6 text-white"/>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">
                                            {isPremium ? 'Linkoo Premium' : 'Попробуйте Premium!'}
                                        </h2>
                                        <p className="text-gray-300 text-sm">
                                            {isPremium
                                                ? `Активна до ${formatExpiryDate()}`
                                                : 'Получите доступ ко всем возможностям'}
                                        </p>
                                    </div>
                                </div>
                                {!isPremium && (
                                    <div className="text-right">
                                        <p className="text-3xl font-bold">299₽</p>
                                        <p className="text-sm text-gray-300">месяц</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Или 2870₽ / год (экономия 20%)
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mb-6">
                                <p className="text-sm font-semibold mb-3 text-gray-300">Преимущества:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {PREMIUM_FEATURES.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <Check className="h-3 w-3 text-green-400"/>
                                            </div>
                                            <span className="text-sm text-gray-200">{feature.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {!isPremium && (
                                <Button
                                    onClick={openPaymentDialog}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white w-full md:w-auto"
                                >
                                    <Sparkles className="h-4 w-4 mr-2"/>
                                    Оформить подписку
                                </Button>
                            )}
                        </div>
                    </Card>

                    {/* Payment Methods & History - Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="methods" className="gap-2">
                                <CreditCard className="h-4 w-4"/>
                                Способы оплаты
                            </TabsTrigger>
                            <TabsTrigger
                                value="history"
                                className="gap-2"
                            >
                                <History className="h-4 w-4"/>
                                История платежей
                            </TabsTrigger>
                        </TabsList>

                        {/* Payment Methods Tab */}
                        <TabsContent value="methods" className="mt-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Управляйте способами оплаты для подписки
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={openLinkCardDialog}
                                        size="sm"
                                    >
                                        <Plus className="h-4 w-4 mr-2"/>
                                        Добавить карту
                                    </Button>
                                </div>

                                {isLoadingMethods ? (
                                    <Card className="p-8">
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-gray-400"/>
                                        </div>
                                    </Card>
                                ) : paymentMethods.length === 0 ? (
                                    <Card className="p-8 bg-gray-50 border-dashed">
                                        <div className="text-center">
                                            <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-400"/>
                                            <p className="text-gray-500 mb-4">
                                                У вас нет добавленных способов оплаты.
                                            </p>
                                            <Button
                                                variant="outline"
                                                onClick={openLinkCardDialog}
                                            >
                                                <Plus className="h-4 w-4 mr-2"/>
                                                Добавить первую карту
                                            </Button>
                                        </div>
                                    </Card>
                                ) : (
                                    <div className="space-y-3">
                                        {paymentMethods.map((method, index) => (
                                            <PaymentMethodCard
                                                key={method.id}
                                                method={method}
                                                onDelete={handleDeleteMethod}
                                                isDefault={index === 0}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        {/* Payment History Tab */}
                        <TabsContent value="history" className="mt-6">
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">
                                    Все ваши платежи и транзакции
                                </p>

                                {isLoadingHistory ? (
                                    <Card className="p-8">
                                        <div className="flex items-center justify-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-gray-400"/>
                                        </div>
                                    </Card>
                                ) : paymentHistory.length === 0 ? (
                                    <Card className="p-8 bg-gray-50 border-dashed">
                                        <div className="text-center">
                                            <History className="h-12 w-12 mx-auto mb-3 text-gray-400"/>
                                            <p className="text-gray-500">
                                                Нет истории платежей
                                            </p>
                                        </div>
                                    </Card>
                                ) : (
                                    <div className="space-y-3">
                                        {paymentHistory.map((payment) => (
                                            <PaymentHistoryItem payment={payment}></PaymentHistoryItem>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

        </div>
    );
}
