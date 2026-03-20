import {useState} from 'react';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {CreditCard, Trash2, Loader2} from 'lucide-react';
import type {PaymentMethod} from '@/types';

interface PaymentMethodCardProps {
    method: PaymentMethod;
    onDelete: (id: string) => Promise<void>;
    isDefault?: boolean;
}

export function PaymentMethodCard({method, onDelete, isDefault}: PaymentMethodCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Вы уверены, что хотите удалить этот способ оплаты?')) {
            return;
        }

        try {
            setIsDeleting(true);
            await onDelete(method.id);
        } catch (error) {
            console.error('Failed to delete payment method:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const getCardIcon = (_cardType?: string) => {
        return <CreditCard className="h-6 w-6 text-blue-600 dark:text-white" />;
    };

    const formatExpiryDate = () => {
        if (!method.card) return '';
        return `${method.card.expiry_month}/${method.card.expiry_year.slice(-2)}`;
    };

    return (
        <Card className="p-4 hover:bg-muted transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-600 dark:to-purple-600 flex items-center justify-center text-white">
                        {getCardIcon(method.card?.card_type)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-medium">
                                {method.title || `${method.card?.card_type} •••• ${method.card?.last4}`}
                            </p>
                            {isDefault && (
                                <span className="text-xs px-2 py-0.5 rounded-full wd:(bg-blue-100 text-blue-700)">
                                    По умолчанию
                                </span>
                            )}
                        </div>
                        {method.card && (
                            <p className="text-sm text-muted-foreground">
                                Истекает {formatExpiryDate()}
                            </p>
                        )}
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-destructive-foreground hover:bg-destructive"
                >
                    {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin"/>
                    ) : (
                        <>
                            <Trash2 className="h-4 w-4 mr-2"/>
                            Удалить
                        </>
                    )}
                </Button>
            </div>
        </Card>
    );
}
