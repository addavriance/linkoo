import {useState} from 'react';
import {Copy, Pencil, Check, Trash2, X} from 'lucide-react';
import {api} from '@/lib/api';
import {toast} from '@/lib/toast';
import {cn} from '@/lib/utils';
import {ActionButton, ActionButtons} from "@/components/cards/CardActionButtons.tsx";
import {SubdomainInput} from "@/components/cards/CardSubdomainInput.tsx";

interface CardSubdomainSectionProps {
    cardId: string;
    subdomain?: string;
    className?: string;
    onUpdated: (newSubdomain?: string) => void;
}

type Mode = 'view' | 'edit' | 'confirm-delete';

export function CardSubdomainSection({cardId, subdomain, className, onUpdated}: CardSubdomainSectionProps) {
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

    // Режим: нет поддомена
    if (!subdomain) {
        return (
            <SubdomainInput
                value={input}
                onChange={e => setInput(sanitize(e.target.value))}
                placeholder="my-name"
                variant="default"
                className={className}
            >
                <ActionButtons>
                    <ActionButton onClick={handleSave} disabled={loading || input.length < 3}>
                        <Check className="h-3 w-3 text-purple-600"/>
                    </ActionButton>
                </ActionButtons>
            </SubdomainInput>
        );
    }

    if (mode === 'confirm-delete') {
        return (
            <div className="mb-3 space-y-1.5">
                <p className="text-xs text-red-700 px-2">
                    Введите <span className="font-mono font-medium">{subdomain}</span> для удаления
                </p>
                <SubdomainInput
                    value={deleteInput}
                    onChange={e => setDeleteInput(e.target.value)}
                    placeholder={subdomain}
                    variant="delete"
                    suffix={null}
                    autoFocus
                    className={cn("flex-1", className)}
                >
                    <ActionButtons>
                        <ActionButton onClick={handleDelete} disabled={deleteInput !== subdomain || loading}>
                            <Check className="h-3 w-3 text-red-600"/>
                        </ActionButton>
                        <ActionButton onClick={() => { setMode('edit'); setDeleteInput(''); }}>
                            <X className="h-3 w-3"/>
                        </ActionButton>
                    </ActionButtons>
                </SubdomainInput>

            </div>
        );
    }

    if (mode === 'edit') {
        return (
            <SubdomainInput
                value={input}
                onChange={e => setInput(sanitize(e.target.value))}
                placeholder={subdomain}
                variant="default"
                autoFocus
                className={className}
            >
                <ActionButtons>
                    <ActionButton onClick={handleSave} disabled={loading || input.length < 3}>
                        <Check className="h-3 w-3 text-purple-600"/>
                    </ActionButton>
                    <ActionButton onClick={() => { setMode('confirm-delete'); setDeleteInput(''); }}>
                        <Trash2 className="h-3 w-3 text-red-500"/>
                    </ActionButton>
                    <ActionButton onClick={() => setMode('view')}>
                        <X className="h-3 w-3"/>
                    </ActionButton>
                </ActionButtons>
            </SubdomainInput>
        );
    }

    return (
        <SubdomainInput
            value={`https://${subdomain}.linkoo.dev`}
            variant="default"
            readOnly
            suffix={null}
            className={className}
        >
            <ActionButtons>
                <ActionButton onClick={handleCopy}>
                    <Copy className="h-3 w-3"/>
                </ActionButton>
                <ActionButton onClick={() => { setMode('edit'); setInput(subdomain); }}>
                    <Pencil className="h-3 w-3"/>
                </ActionButton>
            </ActionButtons>
        </SubdomainInput>
    );
}
