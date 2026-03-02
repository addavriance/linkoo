import {useState} from 'react';
import {Copy, QrCode, Pencil, Check, Trash2, X} from 'lucide-react';
import {api} from '@/lib/api';
import {toast} from '@/lib/toast';
import {cn} from '@/lib/utils';
import {ActionButton, ActionButtons} from "@/components/cards/CardActionButtons.tsx";
import {LinkInput} from "@/components/cards/CardLinkInput.tsx";

interface CardLinkSectionProps {
    cardId: string;
    slug?: string;
    onUpdated: (newSlug?: string) => void;
    onQRCode: () => void;
    className?: string;
}

type Mode = 'view' | 'edit' | 'confirm-delete';

export function CardLinkSection({cardId, slug, onUpdated, onQRCode, className}: CardLinkSectionProps) {
    const [mode, setMode] = useState<Mode>('view');
    const [input, setInput] = useState('');
    const [deleteInput, setDeleteInput] = useState('');
    const [loading, setLoading] = useState(false);

    const origin = window.location.origin;

    const sanitize = (v: string) => {
        const lc = v.toLowerCase();
        return /^[a-z0-9-]*$/.test(lc) ? lc : input;
    };

    const handleCreate = async () => {
        setLoading(true);
        try {
            const link = await api.createCardLink(cardId, input || undefined);
            toast.success('Ссылка создана', `${origin}/${link.slug}`);
            onUpdated(link.slug);
            setInput('');
        } catch (e: any) {
            toast.error('Ошибка', e.response?.data?.message || 'Не удалось создать ссылку');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (input === slug) { setMode('view'); return; }
        setLoading(true);
        try {
            if (slug) await api.deleteCardLink(slug);
            const link = await api.createCardLink(cardId, input || undefined);
            toast.success('Ссылка обновлена', `${origin}/${link.slug}`);
            onUpdated(link.slug);
            setMode('view');
        } catch (e: any) {
            toast.error('Ошибка', e.response?.data?.message || 'Не удалось обновить ссылку');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!slug || deleteInput !== slug) return;
        setLoading(true);
        try {
            await api.deleteCardLink(slug);
            toast.success('Ссылка удалена');
            onUpdated(undefined);
            setMode('view');

            setDeleteInput('');
            setInput('');
        } catch {
            toast.error('Не удалось удалить ссылку');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(`${origin}/${slug}`)
            .then(() => toast.success('Скопировано'))
            .catch(() => toast.error('Не удалось скопировать'));
    };

    if (!slug) {
        return (
            <LinkInput
                value={input}
                onChange={e => setInput(sanitize(e.target.value))}
                placeholder="my-custom-slug"
                variant="default"
                className={className}
            >
                <ActionButtons>
                    <ActionButton onClick={handleCreate} disabled={loading}>
                        <Check className="h-3 w-3 text-green-600"/>
                    </ActionButton>
                </ActionButtons>
            </LinkInput>
        );
    }

    if (mode === 'confirm-delete') {
        return (
            <div className="mb-3 space-y-1.5">
                <p className="text-xs text-red-700 px-2">
                    Введите <span className="font-mono font-medium">{slug}</span> для удаления
                </p>
                <LinkInput
                    value={deleteInput}
                    onChange={e => setDeleteInput(e.target.value)}
                    placeholder={slug}
                    variant="delete"
                    prefix={undefined}
                    autoFocus
                    className={cn("flex-1 border-0", className)}
                >
                    <ActionButtons>
                        <ActionButton onClick={handleDelete} disabled={deleteInput !== slug || loading}>
                            <Check className="h-3 w-3 text-red-600"/>
                        </ActionButton>
                        <ActionButton onClick={() => { setMode('edit'); setDeleteInput(''); }}>
                            <X className="h-3 w-3"/>
                        </ActionButton>
                    </ActionButtons>
                </LinkInput>
            </div>
        );
    }

    // Режим: редактирование
    if (mode === 'edit') {
        return (
            <LinkInput
                value={input}
                onChange={e => setInput(sanitize(e.target.value))}
                variant="default"
                autoFocus
                className={className}
            >
                <ActionButtons>
                    <ActionButton onClick={handleSave} disabled={input === slug || loading}>
                        <Check className="h-3 w-3 text-green-600"/>
                    </ActionButton>
                    <ActionButton onClick={() => { setMode('confirm-delete'); setDeleteInput(''); }}>
                        <Trash2 className="h-3 w-3 text-red-500"/>
                    </ActionButton>
                    <ActionButton onClick={() => setMode('view')}>
                        <X className="h-3 w-3"/>
                    </ActionButton>
                </ActionButtons>
            </LinkInput>
        );
    }

    return (
        <LinkInput
            value={slug}
            variant="default"
            readOnly
            prefix={undefined}
            className={className}
        >
            <ActionButtons>
                <ActionButton onClick={handleCopy}>
                    <Copy className="h-3 w-3"/>
                </ActionButton>
                <ActionButton onClick={onQRCode}>
                    <QrCode className="h-3 w-3"/>
                </ActionButton>
                <ActionButton onClick={() => { setMode('edit'); setInput(slug); }}>
                    <Pencil className="h-3 w-3"/>
                </ActionButton>
            </ActionButtons>
        </LinkInput>
    );
}
