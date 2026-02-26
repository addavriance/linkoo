import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Copy, QrCode, Pencil, Check, Trash2, X} from 'lucide-react';
import {api} from '@/lib/api';
import {toast} from '@/lib/toast';

interface CardLinkSectionProps {
    cardId: string;
    slug?: string;
    onUpdated: (newSlug?: string) => void;
    onQRCode: () => void;
}

type Mode = 'view' | 'edit' | 'confirm-delete';

export function CardLinkSection({cardId, slug, onUpdated, onQRCode}: CardLinkSectionProps) {
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
            <div className="mb-3 p-2 bg-muted rounded-lg flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground shrink-0 font-mono">{origin}/</span>
                <input
                    value={input}
                    onChange={e => setInput(sanitize(e.target.value))}
                    className="flex-1 text-xs font-mono bg-transparent outline-none min-w-0"
                    placeholder="my-custom-slug"
                />
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0"
                        onClick={handleCreate} disabled={loading}>
                    <Check className="h-3 w-3 text-green-600"/>
                </Button>
            </div>
        );
    }

    if (mode === 'confirm-delete') {
        return (
            <div className="mb-3 p-2 bg-red-50 rounded-lg border border-red-100 space-y-1.5">
                <p className="text-xs text-red-700">
                    Введите <span className="font-mono font-medium">{slug}</span> для удаления
                </p>
                <div className="flex items-center gap-1.5">
                    <input
                        value={deleteInput}
                        onChange={e => setDeleteInput(e.target.value)}
                        className="flex-1 text-xs font-mono border border-red-200 rounded px-2 py-1 outline-none bg-background min-w-0"
                        placeholder={slug}
                        autoFocus
                    />
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0"
                            onClick={handleDelete} disabled={deleteInput !== slug || loading}>
                        <Check className="h-3 w-3 text-red-600"/>
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0"
                            onClick={() => { setMode('edit'); setDeleteInput(''); }}>
                        <X className="h-3 w-3"/>
                    </Button>
                </div>
            </div>
        );
    }

    if (mode === 'edit') {
        return (
            <div className="mb-3 p-2 bg-muted rounded-lg flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground shrink-0 font-mono">{origin}/</span>
                <input
                    value={input}
                    onChange={e => setInput(sanitize(e.target.value))}
                    className="flex-1 text-xs font-mono bg-transparent outline-none min-w-0"
                    autoFocus
                />
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0"
                        onClick={handleSave} disabled={loading}>
                    <Check className="h-3 w-3 text-green-600"/>
                </Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0"
                        onClick={() => { setMode('confirm-delete'); setDeleteInput(''); }}>
                    <Trash2 className="h-3 w-3 text-red-500"/>
                </Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0"
                        onClick={() => setMode('view')}>
                    <X className="h-3 w-3"/>
                </Button>
            </div>
        );
    }

    return (
        <div className="mb-3 p-2 bg-muted rounded-lg flex items-center gap-1.5">
            <input
                value={`${origin}/${slug}`}
                readOnly
                className="flex-1 text-xs font-mono bg-transparent outline-none truncate"
            />
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0"
                    onClick={handleCopy} title="Копировать">
                <Copy className="h-3 w-3"/>
            </Button>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0"
                    onClick={onQRCode} title="QR-код">
                <QrCode className="h-3 w-3"/>
            </Button>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0"
                    onClick={() => { setMode('edit'); setInput(slug); }} title="Редактировать ссылку">
                <Pencil className="h-3 w-3"/>
            </Button>
        </div>
    );
}
