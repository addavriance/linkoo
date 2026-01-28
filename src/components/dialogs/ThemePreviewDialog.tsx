import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { ThemeIcon } from '@/components/common/ThemeIcon.tsx';
import { Theme, themeCategories } from '@/lib/themes.ts';
import {
    Star,
    Plus,
} from 'lucide-react';
import {CardPreview} from "@/components/CardPreview.tsx";
import {CARD_SAMPLES} from "@/constants";
import {randInt} from "@/lib/utils.ts";

interface ThemePreviewDialogProps {
    theme: Theme | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUseTheme: (themeId: string) => void;
}

export default function ThemePreviewDialog({
    theme,
    open,
    onOpenChange,
    onUseTheme,
}: ThemePreviewDialogProps) {
    if (!theme) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{theme.name}</DialogTitle>
                </DialogHeader>

                {/* Превью карточки */}
                <CardPreview cardData={CARD_SAMPLES[randInt(0, CARD_SAMPLES.length-1)]} theme={theme}></CardPreview>

                {/* Информация о теме */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Категория:</span>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <ThemeIcon name={themeCategories[theme.category]?.icon} className="h-3 w-3" />
                            {themeCategories[theme.category]?.name}
                        </Badge>
                    </div>
                    {theme.popular && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Статус:</span>
                            <Badge variant="secondary">
                                <Star className="h-3 w-3 mr-1" />
                                Популярная тема
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Действия */}
                <DialogFooter>
                    <Button
                        onClick={() => {
                            onUseTheme(theme.id);
                            onOpenChange(false);
                        }}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Использовать
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
