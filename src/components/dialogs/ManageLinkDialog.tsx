import {useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {toast} from '@/lib/toast';
import {api} from '@/lib/api';
import {Link, Trash2, AlertCircle, Globe, Crown} from 'lucide-react';

// DEPRECATED
interface ManageLinkDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cardId: string;
    currentSlug?: string;
    currentSubdomain?: string;
    isPaid?: boolean;
    onLinkUpdated: (slug?: string) => void;
    onSubdomainUpdated?: (subdomain?: string) => void;
}

export function ManageLinkDialog({
                                     open,
                                     onOpenChange,
                                     cardId,
                                     currentSlug,
                                     currentSubdomain,
                                     isPaid,
                                     onLinkUpdated,
                                     onSubdomainUpdated,
                                 }: ManageLinkDialogProps) {
    const [customSlug, setCustomSlug] = useState('');
    const [subdomainInput, setSubdomainInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSubdomainLoading, setIsSubdomainLoading] = useState(false);
    const [isSubdomainDeleting, setIsSubdomainDeleting] = useState(false);

    const handleCreateLink = async () => {
        try {
            setIsLoading(true);
            const link = await api.createCardLink(cardId, customSlug || undefined);
            toast.success('Ссылка создана', `linkoo.dev/${link.slug}`);
            onLinkUpdated(link.slug);
            onOpenChange(false);
            setCustomSlug('');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Не удалось создать ссылку';
            toast.error('Ошибка', errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteLink = async () => {
        if (!currentSlug) return;
        try {
            setIsDeleting(true);
            await api.deleteCardLink(currentSlug);
            toast.success('Ссылка удалена');
            onLinkUpdated(undefined);
            onOpenChange(false);
        } catch (error: any) {
            toast.error('Не удалось удалить ссылку');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSetSubdomain = async () => {
        if (!subdomainInput.trim()) return;
        try {
            setIsSubdomainLoading(true);
            const card = await api.setCardSubdomain(cardId, subdomainInput.trim());
            toast.success('Поддомен установлен', `${card.subdomain}.${hostname}}`);
            onSubdomainUpdated?.(card.subdomain);
            onOpenChange(false);
            setSubdomainInput('');
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Не удалось установить поддомен';
            toast.error('Ошибка', msg);
        } finally {
            setIsSubdomainLoading(false);
        }
    };

    const handleDeleteSubdomain = async () => {
        try {
            setIsSubdomainDeleting(true);
            await api.deleteCardSubdomain(cardId);
            toast.success('Поддомен удалён');
            onSubdomainUpdated?.(undefined);
            onOpenChange(false);
        } catch (error: any) {
            toast.error('Не удалось удалить поддомен');
        } finally {
            setIsSubdomainDeleting(false);
        }
    };

    const handleSlugChange = (value: string) => {
        const lc = value.toLowerCase();
        if (/^[a-z0-9-]*$/.test(lc)) setCustomSlug(lc);
    };

    const handleSubdomainChange = (value: string) => {
        const lc = value.toLowerCase();
        if (/^[a-z0-9-]*$/.test(lc)) setSubdomainInput(lc);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Link className="h-5 w-5"/>
                        Управление ссылкой
                    </DialogTitle>
                    <DialogDescription>
                        Настройте короткую ссылку или поддомен для вашей визитки.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="slug">
                    <TabsList className={`grid w-full ${isPaid ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        <TabsTrigger value="slug" className="flex items-center gap-1">
                            <Link className="h-3.5 w-3.5"/>
                            Ссылка
                        </TabsTrigger>
                        {isPaid && (
                            <TabsTrigger value="subdomain" className="flex items-center gap-1">
                                <Globe className="h-3.5 w-3.5"/>
                                Поддомен
                            </TabsTrigger>
                        )}
                    </TabsList>

                    {/* === Вкладка: Ссылка === */}
                    <TabsContent value="slug" className="space-y-4 mt-4">
                        {currentSlug ? (
                            <>
                                <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground mb-1">Текущая ссылка:</p>
                                    <p className="font-mono text-sm font-medium">
                                        {window.location.origin}/{currentSlug}
                                    </p>
                                </div>

                                <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5"/>
                                    <div className="text-sm text-yellow-800">
                                        <p className="font-medium mb-1">Удаление ссылки</p>
                                        <p className="text-yellow-700">
                                            После удаления старая ссылка перестанет работать. Вы сможете создать
                                            новую с любым доступным наименованием.
                                        </p>
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                                        Отмена
                                    </Button>
                                    <Button variant="destructive" onClick={handleDeleteLink} disabled={isDeleting}>
                                        <Trash2 className="h-4 w-4 mr-2"/>
                                        {isDeleting ? 'Удаление...' : 'Удалить ссылку'}
                                    </Button>
                                </DialogFooter>
                            </>
                        ) : (
                            <>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                                            {window.location.origin}/
                                        </span>
                                        <Input
                                            placeholder="my-custom-slug"
                                            value={customSlug}
                                            onChange={(e) => handleSlugChange(e.target.value)}
                                            className="flex-1"
                                            maxLength={50}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Разрешены только буквы (a-z), цифры (0-9) и дефис (-)
                                    </p>
                                </div>

                                {!customSlug && (
                                    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0"/>
                                        <p className="text-sm text-blue-800">
                                            Если не указать, сгенерируется случайный
                                        </p>
                                    </div>
                                )}

                                <DialogFooter>
                                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                                        Отмена
                                    </Button>
                                    <Button onClick={handleCreateLink} disabled={isLoading}>
                                        <Link className="h-4 w-4 mr-2"/>
                                        {isLoading ? 'Создание...' : 'Создать ссылку'}
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </TabsContent>

                    {/* === Вкладка: Поддомен (только для paid) === */}
                    {isPaid && (
                        <TabsContent value="subdomain" className="space-y-4 mt-4">
                            {currentSubdomain ? (
                                <>
                                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                                        <p className="text-sm text-muted-foreground mb-1">Текущий поддомен:</p>
                                        <p className="font-mono text-sm font-medium text-purple-700">
                                            https://{currentSubdomain}.linkoo.dev
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground">Изменить поддомен:</p>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                placeholder="new-subdomain"
                                                value={subdomainInput}
                                                onChange={(e) => handleSubdomainChange(e.target.value)}
                                                className="flex-1"
                                                maxLength={32}
                                            />
                                            <span className="text-sm text-muted-foreground whitespace-nowrap">.linkoo.dev</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            3–32 символа: строчные буквы, цифры и дефис
                                        </p>
                                    </div>

                                    <DialogFooter className="flex-col sm:flex-row gap-2">
                                        <Button
                                            variant="destructive"
                                            onClick={handleDeleteSubdomain}
                                            disabled={isSubdomainDeleting}
                                            className="sm:mr-auto"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2"/>
                                            {isSubdomainDeleting ? 'Удаление...' : 'Удалить поддомен'}
                                        </Button>
                                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                                            Отмена
                                        </Button>
                                        <Button
                                            onClick={handleSetSubdomain}
                                            disabled={isSubdomainLoading || subdomainInput.length < 3}
                                        >
                                            <Globe className="h-4 w-4 mr-2"/>
                                            {isSubdomainLoading ? 'Сохранение...' : 'Сохранить'}
                                        </Button>
                                    </DialogFooter>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-start gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                        <Crown className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5"/>
                                        <p className="text-sm text-purple-800">
                                            Ваша карточка будет доступна по адресу{' '}
                                            <span className="font-mono font-medium">название.linkoo.dev</span>
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                placeholder="my-name"
                                                value={subdomainInput}
                                                onChange={(e) => handleSubdomainChange(e.target.value)}
                                                className="flex-1"
                                                maxLength={32}
                                            />
                                            <span className="text-sm text-muted-foreground whitespace-nowrap">.linkoo.dev</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            3–32 символа: строчные буквы, цифры и дефис
                                        </p>
                                    </div>

                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                                            Отмена
                                        </Button>
                                        <Button
                                            onClick={handleSetSubdomain}
                                            disabled={isSubdomainLoading || subdomainInput.length < 3}
                                        >
                                            <Globe className="h-4 w-4 mr-2"/>
                                            {isSubdomainLoading ? 'Сохранение...' : 'Установить поддомен'}
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </TabsContent>
                    )}
                </Tabs>

                {!isPaid && (
                    <div className="mt-2 p-3 bg-gradient-to-r wd:(from-blue-50 to-purple-50) border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <Crown className="h-4 w-4 text-purple-600 flex-shrink-0"/>
                            <p className="text-sm text-muted-foreground">
                                Поддомен{' '}
                                <span className="font-mono font-medium">name.linkoo.dev</span>{' '}
                                доступен на Premium
                            </p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
