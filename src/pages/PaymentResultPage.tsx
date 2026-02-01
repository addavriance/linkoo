import {useEffect, useState, useRef} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {api} from '@/lib/api';
import {useAuth} from '@/contexts/AuthContext';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {CheckCircle2, XCircle, Loader2, Crown} from 'lucide-react';

type PaymentStatus = 'loading' | 'succeeded' | 'captured' | 'waiting_capture' | 'pending' | 'canceled' | 'error';

export default function PaymentResultPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const {refreshUser} = useAuth();
    const [status, setStatus] = useState<PaymentStatus>('loading');
    const [error, setError] = useState<string>('');
    const hasCheckedRef = useRef(false);

    useEffect(() => {
        // Защита от повторных вызовов
        if (hasCheckedRef.current) return;
        hasCheckedRef.current = true;

        const checkPayment = async () => {
            const paymentKey = searchParams.get('paymentKey');

            if (!paymentKey) {
                setStatus('error');
                setError('Ключ платежа не найден');
                return;
            }

            try {
                const payment = await api.getPaymentStatus(paymentKey);

                if (payment?.status === 'succeeded' && payment.paid) {
                    setStatus('succeeded');
                    // Обновляем информацию о пользователе
                    await refreshUser();
                } else if (payment?.status === 'waiting_for_capture') {
                    // Если это тестовый платеж на 1₽ - карта привязана
                    // Если это обычный платеж - ожидает подтверждения
                    const paymentData = payment as any;
                    if (paymentData?.amount === 1) {
                        setStatus('captured');
                    } else {
                        setStatus('waiting_capture');
                    }
                    await refreshUser();
                } else if (payment?.status === 'canceled') {
                    setStatus('canceled');
                } else if (payment?.status === 'pending') {
                    setStatus('pending');
                } else {
                    setStatus('error');
                    setError('Неизвестный статус платежа');
                }
            } catch (err: any) {
                console.error('Payment check failed:', err);
                setStatus('error');
                setError(err.response?.data?.message || 'Не удалось проверить статус платежа');
            }
        };

        checkPayment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Запускаем только один раз при монтировании

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <Card className="max-w-md mx-auto p-8 text-center">
                        <Loader2 className="h-16 w-16 mx-auto mb-4 text-blue-600 animate-spin"/>
                        <h2 className="text-2xl font-bold mb-2">Проверяем платеж...</h2>
                        <p className="text-gray-600">
                            Пожалуйста, подождите, это займет несколько секунд
                        </p>
                    </Card>
                );

            case 'succeeded':
                return (
                    <Card className="max-w-md mx-auto p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-green-600"/>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-green-700">Оплата успешна!</h2>
                        <p className="text-gray-600 mb-6">
                            Поздравляем! Ваша подписка на Linkoo Premium активирована.
                        </p>
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-center gap-2 text-blue-700 font-semibold mb-2">
                                <Crown className="h-5 w-5"/>
                                <span>Теперь у вас есть Premium</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                Все функции уже доступны в вашем аккаунте
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => navigate('/premium')}
                            >
                                Узнать больше
                            </Button>
                            <Button
                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                onClick={() => navigate('/editor')}
                            >
                                Начать использовать
                            </Button>
                        </div>
                    </Card>
                );

            case 'captured':
                return (
                    <Card className="max-w-md mx-auto p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="h-10 w-10 text-green-600"/>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-green-700">Карта привязана!</h2>
                        <p className="text-gray-600 mb-6">
                            Способ оплаты успешно добавлен в ваш аккаунт.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                className="flex-1"
                                onClick={() => navigate('/subscription')}
                            >
                                Платежи и подписки
                            </Button>
                        </div>
                    </Card>
                );

            case 'waiting_capture':
                return (
                    <Card className="max-w-md mx-auto p-8 text-center">
                        <Loader2 className="h-16 w-16 mx-auto mb-4 text-yellow-600 animate-spin"/>
                        <h2 className="text-2xl font-bold mb-2 text-yellow-700">Ожидает подтверждения</h2>
                        <p className="text-gray-600 mb-6">
                            Платеж успешно авторизован и ожидает финального подтверждения. Обычно это занимает несколько минут.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => navigate('/subscription')}
                            >
                                Проверить статус
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={() => navigate('/')}
                            >
                                На главную
                            </Button>
                        </div>
                    </Card>
                );

            case 'pending':
                return (
                    <Card className="max-w-md mx-auto p-8 text-center">
                        <Loader2 className="h-16 w-16 mx-auto mb-4 text-yellow-600 animate-spin"/>
                        <h2 className="text-2xl font-bold mb-2 text-yellow-700">Платеж обрабатывается</h2>
                        <p className="text-gray-600 mb-6">
                            Ваш платеж находится в обработке. Это может занять несколько минут.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/premium')}
                        >
                            Вернуться на главную
                        </Button>
                    </Card>
                );

            case 'canceled':
                return (
                    <Card className="max-w-md mx-auto p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <XCircle className="h-10 w-10 text-gray-600"/>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Платеж отменен</h2>
                        <p className="text-gray-600 mb-6">
                            Оплата была отменена. Вы можете попробовать еще раз.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => navigate('/')}
                            >
                                На главную
                            </Button>
                            <Button
                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                                onClick={() => navigate('/premium')}
                            >
                                Попробовать снова
                            </Button>
                        </div>
                    </Card>
                );

            case 'error':
                return (
                    <Card className="max-w-md mx-auto p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                            <XCircle className="h-10 w-10 text-red-600"/>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-red-700">Ошибка</h2>
                        <p className="text-gray-600 mb-6">
                            {error || 'Произошла ошибка при обработке платежа'}
                        </p>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => navigate('/')}
                            >
                                На главную
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={() => navigate('/premium')}
                            >
                                Попробовать снова
                            </Button>
                        </div>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            {renderContent()}
        </div>
    );
}
