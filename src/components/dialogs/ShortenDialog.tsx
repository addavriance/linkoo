/* WARN: DEPRECATED MODULE */
/* Раньше использовался, пока приложение было без бекенда и полагалось на сторонние сервисы */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link as LinkIcon, Smartphone, Flame, Zap, Clipboard, X } from 'lucide-react';

interface ShortenDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    url: string;
    onCopy?: (message: string) => void;
}

interface Service {
    name: string;
    url: string;
    icon: React.ReactNode;
    color: string;
}

export const ShortenDialog: React.FC<ShortenDialogProps> = ({
    open,
    onOpenChange,
    url,
    onCopy,
}) => {
    const services: Service[] = [
        {
            name: 'TinyURL.com',
            url: 'https://tinyurl.com',
            icon: <Smartphone className="h-4 w-4" />,
            color: 'bg-indigo-600 hover:bg-indigo-700',
        },
        {
            name: 'Bit.ly',
            url: 'https://bit.ly',
            icon: <Flame className="h-4 w-4" />,
            color: 'bg-orange-600 hover:bg-orange-700',
        },
        {
            name: 'Is.gd',
            url: 'https://is.gd',
            icon: <Zap className="h-4 w-4" />,
            color: 'bg-green-600 hover:bg-green-700',
        },
    ];

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(url);
            if (onCopy) onCopy('Ссылка скопирована!');
            onOpenChange(false);
        } catch (error) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = url;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            if (onCopy) onCopy('Ссылка скопирована!');
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <LinkIcon className="h-5 w-5" />
                        Сокращение ссылки
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 text-center">
                        Автоматическое сокращение недоступно. Выберите один из способов:
                    </p>
                    <div className="space-y-3">
                        {services.map((service) => (
                            <Button
                                key={service.name}
                                onClick={() => window.open(service.url, '_blank')}
                                className={`w-full ${service.color} text-white`}
                                variant="default"
                            >
                                {service.icon}
                                <span className="ml-2">{service.name}</span>
                            </Button>
                        ))}
                        <Button
                            onClick={handleCopyUrl}
                            variant="secondary"
                            className="w-full"
                        >
                            <Clipboard className="h-4 w-4 mr-2" />
                            Скопировать полную ссылку
                        </Button>
                    </div>
                    <Button
                        onClick={() => onOpenChange(false)}
                        variant="outline"
                        className="w-full"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Закрыть
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
