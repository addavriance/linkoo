import React from 'react';
import {Button} from '@/components/ui/button';
import {Save} from 'lucide-react';
import {useAuth} from '@/contexts/AuthContext';

interface SaveButtonProps {
    onSave: () => Promise<boolean>;
    isSaving: boolean;
    isEditMode: boolean;
    disabled?: boolean;
    className?: string;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
                                                          onSave,
                                                          isSaving,
                                                          isEditMode,
                                                          disabled = false,
                                                          className = '',
                                                      }) => {
    const {isAuthenticated} = useAuth();

    const handleClick = async () => {
        await onSave();
    };

    if (!isAuthenticated) {
        // Гостевой режим - кнопка генерирует URL
        return (
            <Button
                onClick={handleClick}
                disabled={disabled || isSaving}
                className={`${className}`}
                size="lg"
            >
                <Save className="w-4 h-4 mr-2"/>
                {isSaving ? 'Создание...' : 'Создать карточку'}
            </Button>
        );
    }

    // Авторизованный режим - сохранение в БД
    return (
        <Button
            onClick={handleClick}
            disabled={disabled || isSaving}
            className={`${className}`}
            size="lg"
        >
            <Save className="w-4 h-4 mr-2"/>
            {isSaving
                ? 'Сохранение...'
                : isEditMode
                    ? 'Обновить карточку'
                    : 'Сохранить карточку'}
        </Button>
    );
};
