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
import {CreditCard, Loader2, Info, CheckCircle} from 'lucide-react';
import {Card} from '@/components/ui/card';

interface LinkCardDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LinkCardDialog({open, onOpenChange}: LinkCardDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleLinkCard = async () => {
        try {
            setIsLoading(true);

            const payment = await api.linkCard();

            if (payment.confirmation_url) {
                window.location.href = payment.confirmation_url;
            } else {
                throw new Error('URL привязки карты не получен');
            }
        } catch (error: any) {
            console.error('Link card failed:', error);
            const errorMessage = error.response?.data?.message || 'Не удалось привязать карту';
            toast.error('Ошибка', errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 flex items-center justify-center">
                            <CreditCard className="h-5 w-5"/>
                        </div>
                        <DialogTitle className="text-2xl">Добавить карту</DialogTitle>
                    </div>
                    <DialogDescription>
                        Привяжите карту для автоматического продления подписки
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Info Card */}
                    <Card className="p-4 bg-blue-50 border-blue-200">
                        <div className="flex gap-3">
                            <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5"/>
                            <div className="text-sm">
                                <p className="font-medium text-blue-900 mb-1">Как это работает?</p>
                                <ul className="text-blue-800 space-y-1">
                                    <li>• Мы проверим вашу карту тестовым платежом на 1₽</li>
                                    <li>• Деньги будут <strong>автоматически возвращены</strong></li>
                                    <li>• Карта сохранится для будущих оплат</li>
                                    <li>• Вы сможете удалить карту в любой момент</li>
                                </ul>
                            </div>
                        </div>
                    </Card>

                    {/* Benefits */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Преимущества:</p>
                        <div className="space-y-2">
                            <div className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5"/>
                                <div>
                                    <p className="font-medium text-sm">Автоматическое продление</p>
                                    <p className="text-xs text-gray-600">
                                        Подписка будет автоматически продлеваться
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5"/>
                                <div>
                                    <p className="font-medium text-sm">Без повторного ввода данных</p>
                                    <p className="text-xs text-gray-600">
                                        Не нужно каждый раз вводить данные карты
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5"/>
                                <div>
                                    <p className="font-medium text-sm">Полный контроль</p>
                                    <p className="text-xs text-gray-600">
                                        Вы можете отключить автопродление или удалить карту
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Notice */}
                    <div className="flex gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600">
                        <CreditCard className="h-4 w-4 shrink-0 mt-0.5"/>
                        <p>
                            Данные вашей карты надежно защищены и обрабатываются через
                            сертифицированную платежную систему ЮKassa (PCI DSS Level 1)
                        </p>
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
                        onClick={handleLinkCard}
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
                                Привязать карту
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
