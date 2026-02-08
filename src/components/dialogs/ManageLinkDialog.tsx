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
import {Input} from '@/components/ui/input';
import {toast} from '@/lib/toast';
import {api} from '@/lib/api';
import {Link, Trash2, AlertCircle} from 'lucide-react';

interface ManageLinkDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cardId: string;
    currentSlug?: string;
    onLinkUpdated: (slug?: string) => void;
}

export function ManageLinkDialog({
                                     open,
                                     onOpenChange,
                                     cardId,
                                     currentSlug,
                                     onLinkUpdated,
                                 }: ManageLinkDialogProps) {
    const [customSlug, setCustomSlug] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleCreateLink = async () => {
        try {
            setIsLoading(true);
            const link = await api.createCardLink(cardId, customSlug || undefined);
            toast.success('Ссылка создана', `linkoo.dev/${link.slug}`);
            onLinkUpdated(link.slug);
            onOpenChange(false);
            setCustomSlug('');
        } catch (error: any) {
            console.error('Failed to create link:', error);
            const errorMessage = error.response?.data?.message || 'Не удалось создать ссылку';
            toast.error('Ошибка', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteLink = async () => {
        if (!currentSlug) return;
        // if (!confirm('Удалить ссылку на эту карточку?')) return;

        try {
            setIsDeleting(true);
            await api.deleteCardLink(currentSlug);
            toast.success('Ссылка удалена');
            onLinkUpdated(undefined);
            onOpenChange(false);
        } catch (error: any) {
            console.error('Failed to delete link:', error);
            toast.error('Не удалось удалить ссылку');
        } finally {
            setIsDeleting(false);
        }
    };

    const validateSlug = (value: string) => {
        // Разрешены только буквы, цифры и дефис
        return /^[a-z0-9-]*$/.test(value);
    };

    const handleSlugChange = (value: string) => {
        const lowercase = value.toLowerCase();
        if (validateSlug(lowercase)) {
            setCustomSlug(lowercase);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Link className="h-5 w-5"/>
                        {currentSlug ? 'Управление ссылкой' : 'Создать ссылку'}
                    </DialogTitle>
                    <DialogDescription>
                        {currentSlug
                            ? 'Вы можете удалить текущую ссылку и создать новую с другим наименованием.'
                            : 'Создайте короткую ссылку на вашу визитку.'}
                    </DialogDescription>
                </DialogHeader>

                {currentSlug ? (
                    <div className="space-y-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Текущая ссылка:</p>
                            <p className="font-mono text-sm font-medium">
                                {window.location.origin}/{currentSlug}
                            </p>
                        </div>

                        <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5"/>
                            <div className="text-sm text-yellow-800">
                                <p className="font-medium mb-1">Удаление ссылки</p>
                                <p className="text-yellow-700">
                                    После удаления старая ссылка перестанет работать. Вы сможете создать новую с любым
                                    доступным наименованием.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">{window.location.origin}/</span>
                                <Input
                                    placeholder="my-custom-slug"
                                    value={customSlug}
                                    onChange={(e) => handleSlugChange(e.target.value)}
                                    className="flex-1"
                                    maxLength={50}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Разрешены только буквы (a-z), цифры (0-9) и дефис (-)
                            </p>
                        </div>

                        {!customSlug && (
                            <div className="flex center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5"/>
                                <p className="text-sm text-blue-800">
                                    Если не указать, сгенерируется случайный
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter>
                    {currentSlug ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Отмена
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteLink}
                                disabled={isDeleting}
                            >
                                <Trash2 className="h-4 w-4 mr-2"/>
                                {isDeleting ? 'Удаление...' : 'Удалить ссылку'}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Отмена
                            </Button>
                            <Button onClick={handleCreateLink} disabled={isLoading}>
                                <Link className="h-4 w-4 mr-2"/>
                                {isLoading ? 'Создание...' : 'Создать ссылку'}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
