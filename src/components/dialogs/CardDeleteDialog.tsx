import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useState, useEffect} from "react";

interface DeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDelete: (id: string) => void;
    cardName: string;
    cardId: string | undefined;
}

export const CardDeleteDialog = ({
                                     open,
                                     onOpenChange,
                                     cardName,
                                     cardId,
                                     onDelete,
                                 }: DeleteDialogProps) => {
    const [value, setValue] = useState("");

    useEffect(() => {
        if (open) {
            setValue("");
        }
    }, [open]);

    const handleDelete = () => {
        if (!cardId) return;
        onDelete(cardId);
        onOpenChange(false);
    };

    const isMatch = value.trim() === cardName.trim();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[480px] rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-center">
                        Удалить карточку «{cardName}»?
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-center">
                        Это действие нельзя будет отменить. Чтобы подтвердить удаление, введите название карточки.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-2">
                    <label className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">
              Введите «{cardName}» для подтверждения
            </span>
                        <Input
                            autoFocus
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={cardName}
                        />
                    </label>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Отмена
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={!isMatch}
                        onClick={handleDelete}
                    >
                        Удалить
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
