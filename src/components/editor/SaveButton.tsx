import React from 'react';
import {Button} from '@/components/ui/button';
import {Save, LogIn, Star} from 'lucide-react';
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

// Компонент с информацией о режиме работы
export const EditorModeInfo: React.FC = () => {
    const {isAuthenticated, user} = useAuth();

    if (!isAuthenticated) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                    <LogIn className="w-5 h-5 text-blue-600 mt-0.5"/>
                    <div className="flex-1">
                        <h3 className="font-semibold text-blue-900 mb-1">
                            Гостевой режим
                        </h3>
                        <p className="text-sm text-blue-800 mb-2">
                            Ваша карточка будет сохранена в URL. Для сохранения карточек в облаке
                            и получения коротких ссылок - войдите в аккаунт.
                        </p>
                        <Button size="sm" variant="outline" className="border-blue-300">
                            Войти
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (user?.accountType === 'free') {
        return (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                    <div className="flex-1">
                        <h3 className="font-semibold text-purple-900 mb-1">
                            Free аккаунт
                        </h3>
                        <p className="text-sm text-purple-800 mb-2">
                            Вы можете создать 1 карточку. Для неограниченного количества
                            карточек и custom доменов - обновитесь до Premium.
                        </p>
                        <Button size="sm" variant="outline" className="border-purple-300">
                            Обновить до Premium
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
                <div className="flex-1">
                    <h3 className="font-semibold text-green-900 mb-1 flex items-center gap-1">
                        <Star className="h-4 w-4"/>
                        Premium аккаунт
                    </h3>
                    <p className="text-sm text-green-800">
                        Неограниченное количество карточек, custom домены и расширенная
                        аналитика доступны.
                    </p>
                </div>
            </div>
        </div>
    );
};
