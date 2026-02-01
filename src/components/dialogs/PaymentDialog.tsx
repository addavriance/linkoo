import {useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {toast} from '@/lib/toast';
import {api} from '@/lib/api';
import {Crown, CreditCard, Loader2, Check, Info} from 'lucide-react';
import {Card} from '@/components/ui/card';

interface PaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PaymentDialog({open, onOpenChange}: PaymentDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

    const plans = {
        monthly: {
            price: 299,
            period: 'месяц',
            description: 'Оплата каждый месяц',
            savings: null,
        },
        yearly: {
            price: 2870,
            period: 'год',
            description: 'Выгоднее на 20%',
            savings: '720₽',
        },
    };

    const handlePayment = async () => {
        try {
            setIsLoading(true);

            const payment = await api.createPayment({
                plan: selectedPlan,
            });

            if (payment.confirmation_url) {
                window.location.href = payment.confirmation_url;
            } else {
                throw new Error('URL оплаты не получен');
            }
        } catch (error: any) {
            console.error('Payment creation failed:', error);
            const errorMessage = error.response?.data?.message || 'Не удалось создать платеж';
            toast.error('Ошибка оплаты', errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                            <Crown className="h-5 w-5 text-white"/>
                        </div>
                        <DialogTitle className="text-2xl">Оформление Premium</DialogTitle>
                    </div>
                    <DialogDescription>
                        Выберите план подписки и перейдите к оплате
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Monthly Plan */}
                    <Card
                        className={`p-4 cursor-pointer transition-all border-2 ${
                            selectedPlan === 'monthly'
                                ? 'border-blue-500 bg-blue-50/50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPlan('monthly')}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-lg">Месячная подписка</h3>
                                    {selectedPlan === 'monthly' && (
                                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                            <Check className="h-3 w-3 text-white"/>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                    {plans.monthly.description}
                                </p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-2xl font-bold">{plans.monthly.price}₽</span>
                                    <span className="text-gray-600">/{plans.monthly.period}</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Yearly Plan */}
                    <Card
                        className={`p-4 cursor-pointer transition-all border-2 relative ${
                            selectedPlan === 'yearly'
                                ? 'border-blue-500 bg-blue-50/50'
                                : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPlan('yearly')}
                    >
                        <div className="absolute -top-3 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Экономия {plans.yearly.savings}
                        </div>
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-lg">Годовая подписка</h3>
                                    {selectedPlan === 'yearly' && (
                                        <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                                            <Check className="h-3 w-3 text-white"/>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                    {plans.yearly.description}
                                </p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold">{plans.yearly.price}₽</span>
                                    <span className="text-gray-600">/{plans.yearly.period}</span>
                                    <span className="text-sm text-gray-500 line-through">3590₽</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Info Block */}
                    <div className="flex gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5"/>
                        <div className="text-sm text-gray-700">
                            <p className="font-medium mb-1">Безопасная оплата через ЮKassa</p>
                            <p className="text-gray-600">
                                После нажатия кнопки вы будете перенаправлены на защищенную страницу оплаты.
                                Принимаются карты, SberPay, ЮMoney и другие способы.
                            </p>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2 pt-2">
                        <p className="text-sm font-medium text-gray-700">Что входит в Premium:</p>
                        <ul className="text-sm text-gray-600 space-y-1.5">
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600"/>
                                <span>Неограниченные карточки</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600"/>
                                <span>Custom домены</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600"/>
                                <span>Расширенная аналитика</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-600"/>
                                <span>Приоритетная поддержка</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={handlePayment}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white min-w-[140px]"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                                Загрузка...
                            </>
                        ) : (
                            <>
                                <CreditCard className="h-4 w-4 mr-2"/>
                                Перейти к оплате
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
