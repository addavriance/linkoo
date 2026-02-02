import {Card} from "@/components/ui/card.tsx";
import {CheckCircle2, Clock, XCircle} from "lucide-react";
import {Payment} from "@/types";

interface PaymentHistoryProps {
    payment: Payment;
}

export const PaymentHistoryItem = ({payment}: PaymentHistoryProps) => {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getStatusIcon = (status: string, payment?: Payment) => {
        switch (status) {
            case 'succeeded':
                return <CheckCircle2 className="h-5 w-5 text-green-600"/>;
            case 'waiting_for_capture':
                // Зелёная галочка только для тестового платежа привязки карты (1₽)
                if (payment?.amount === 1) {
                    return <CheckCircle2 className="h-5 w-5 text-green-600"/>;
                }
                return <Clock className="h-5 w-5 text-yellow-600"/>;
            case 'canceled':
                return <XCircle className="h-5 w-5 text-red-600"/>;
            default:
                return <Clock className="h-5 w-5 text-yellow-600"/>;
        }
    };

    const getStatusText = (status: string, payment?: Payment) => {
        switch (status) {
            case 'succeeded':
                return 'Успешно';
            case 'canceled':
                return 'Отменен';
            case 'pending':
                return 'Ожидание';
            case 'waiting_for_capture':
                // Тестовый платеж на 1₽ для привязки карты
                if (payment?.amount === 1) {
                    return 'Карта привязана';
                }
                return 'Ожидает подтверждения';
            default:
                return status;
        }
    };

    const getPlanText = (plan?: string) => {
        if (plan === 'yearly') return 'Годовая подписка';
        if (plan === 'monthly') return 'Месячная подписка';
        return 'Подписка';
    };

    return (
        <Card key={payment._id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                        {getStatusIcon(payment.status, payment)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium truncate">
                                {payment.description || getPlanText(payment.plan)}
                            </p>
                            <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                    payment.status === 'succeeded' || (payment.status === 'waiting_for_capture' && payment.amount === 1)
                                        ? 'bg-green-100 text-green-700'
                                        : payment.status === 'canceled'
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                }`}
                            >
                                                                    {getStatusText(payment.status, payment)}
                                                                </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                            {formatDate(payment.createdAt)}
                        </p>
                        {payment.paymentMethod?.card && (
                            <div className="text-xs text-gray-500">
                                {payment.paymentMethod.card.card_type} •••• {payment.paymentMethod.card.last4}
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg">
                        {payment.amount} {payment.currency}
                    </p>
                </div>
            </div>
        </Card>
    )
}
