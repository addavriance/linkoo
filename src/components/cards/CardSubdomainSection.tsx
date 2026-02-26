import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Copy, Pencil, Check, Trash2, X} from 'lucide-react';
import {api} from '@/lib/api';
import {toast} from '@/lib/toast';

interface CardSubdomainSectionProps {
    cardId: string;
    subdomain?: string;
    onUpdated: (newSubdomain?: string) => void;
}

type Mode = 'view' | 'edit' | 'confirm-delete';

export function CardSubdomainSection({cardId, subdomain, onUpdated}: CardSubdomainSectionProps) {
    const [mode, setMode] = useState<Mode>('view');
    const [input, setInput] = useState('');
    const [deleteInput, setDeleteInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sanitize = (v: string) => {
        const lc = v.toLowerCase();
        return /^[a-z0-9-]*$/.test(lc) ? lc : input;
    };

    const handleSave = async () => {
        if (input === subdomain) { setMode('view'); return; }
        if (input.length < 3) return;
        setLoading(true);
        try {
            const card = await api.setCardSubdomain(cardId, input.trim());
            toast.success('Поддомен установлен', `${card.subdomain}.linkoo.dev`);
            onUpdated(card.subdomain);
            setMode('view');
            setInput('');
        } catch (e: any) {
            toast.error('Ошибка', e.response?.data?.message || 'Не удалось установить поддомен');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!subdomain || deleteInput !== subdomain) return;
        setLoading(true);
        try {
            await api.deleteCardSubdomain(cardId);
            toast.success('Поддомен удалён');
            onUpdated(undefined);
            setMode('view');
            setDeleteInput('');
        } catch {
            toast.error('Не удалось удалить поддомен');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(`https://${subdomain}.linkoo.dev`)
            .then(() => toast.success('Скопировано'))
            .catch(() => toast.error('Не удалось скопировать'));
    };

    if (!subdomain) {
        return (
            <div className="mb-3 p-2 bg-purple-50 rounded-lg border border-purple-100 flex items-center gap-1.5">
                <input
                    value={input}
                    onChange={e => setInput(sanitize(e.target.value))}
                    className="flex-1 text-xs font-mono bg-transparent outline-none min-w-0 text-purple-900"
                    placeholder="my-name"
                />
                <span className="text-xs text-purple-400 shrink-0 font-mono">.linkoo.dev</span>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0"
                        onClick={handleSave} disabled={loading || input.length < 3}>
                    <Check className="h-3 w-3 text-purple-600"/>
                </Button>
            </div>
        );
    }

    if (mode === 'confirm-delete') {
        return (
            <div className="mb-3 p-2 bg-red-50 rounded-lg border border-red-100 space-y-1.5">
                <p className="text-xs text-red-700">
                    Введите <span className="font-mono font-medium">{subdomain}</span> для удаления
                </p>
                <div className="flex items-center gap-1.5">
                    <input
                        value={deleteInput}
                        onChange={e => setDeleteInput(e.target.value)}
                        className="flex-1 text-xs font-mono border border-red-200 rounded px-2 py-1 outline-none bg-background min-w-0"
                        placeholder={subdomain}
                        autoFocus
                    />
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0"
                            onClick={handleDelete} disabled={deleteInput !== subdomain || loading}>
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
            <div className="mb-3 p-2 bg-purple-50 rounded-lg border border-purple-100 flex items-center gap-1.5">
                <input
                    value={input}
                    onChange={e => setInput(sanitize(e.target.value))}
                    className="flex-1 text-xs font-mono bg-transparent outline-none min-w-0 text-purple-900"
                    autoFocus
                    placeholder={subdomain}
                />
                <span className="text-xs text-purple-400 shrink-0 font-mono">.linkoo.dev</span>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0"
                        onClick={handleSave} disabled={loading || input.length < 3}>
                    <Check className="h-3 w-3 text-purple-600"/>
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
        <div className="mb-3 p-2 bg-purple-50 rounded-lg border border-purple-100 flex items-center gap-1.5">
            <input
                value={`https://${subdomain}.linkoo.dev`}
                readOnly
                className="flex-1 text-xs font-mono bg-transparent outline-none truncate text-purple-700"
            />
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0"
                    onClick={handleCopy} title="Копировать">
                <Copy className="h-3 w-3"/>
            </Button>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 shrink-0"
                    onClick={() => { setMode('edit'); setInput(subdomain); }} title="Редактировать поддомен">
                <Pencil className="h-3 w-3"/>
            </Button>
        </div>
    );
}