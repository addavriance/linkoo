import {useState, useEffect} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useAuth} from '@/contexts/AuthContext';
import {api} from '@/lib/api';
import {toast} from '@/lib/toast';
import {generateCardUrl} from '@/lib/compression';
import type {Card} from '@/types';

interface UseCardEditorOptions {
    onSaveSuccess?: (card: Card) => void;
}

export const useCardEditor = (options: UseCardEditorOptions = {}) => {
    const {user, isAuthenticated} = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const cardId = searchParams.get('cardId');

    const [cardData, setCardData] = useState<Partial<Card>>({
        name: '',
        title: '',
        description: '',
        email: '',
        phone: '',
        website: '',
        company: '',
        location: '',
        avatar: '',
        socials: [],
        theme: 'light_minimal',
        visibility: {
            showEmail: true,
            showPhone: true,
            showLocation: true,
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [exportUrl, setExportUrl] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);

    // Определяем режим работы
    const isGuestMode = !isAuthenticated;
    const isAuthMode = isAuthenticated;

    // Загрузка карточки для редактирования (только для авторизованных)
    useEffect(() => {
        if (cardId && isAuthMode) {
            loadCard(cardId);
        }
    }, [cardId, isAuthMode]);

    // Загрузка черновика
    useEffect(() => {
        if (!cardId) {
            const draft = localStorage.getItem('linkoo_draft');
            if (draft) {
                try {
                    const draftData = JSON.parse(draft);
                    setCardData(prev => ({...prev, ...draftData}));
                } catch (error) {
                    console.error('Failed to load draft:', error);
                }
            }
        }
    }, [isGuestMode, cardId]);

    useEffect(() => {
        if (!isEditMode) {
            const timeoutId = setTimeout(() => {
                if (cardData.name || cardData.email) {
                    localStorage.setItem('linkoo_draft', JSON.stringify(cardData));
                }
            }, 1000);

            return () => clearTimeout(timeoutId);
        }
    }, [cardData, isGuestMode, isEditMode]);

    // Генерация URL для гостей
    useEffect(() => {
        if (isGuestMode && (cardData.name || cardData.email || cardData.phone)) {
            const url = generateCardUrl(cardData);
            setExportUrl(url || '');
        }
    }, [cardData, isGuestMode]);

    // Генерация URL для авторизованных пользователей с сохраненной карточкой
    useEffect(() => {
        if (isAuthMode && cardData._id && cardData.slug) {
            const baseUrl = window.location.origin;
            const shortUrl = `${baseUrl}/${cardData.slug}`;
            setExportUrl(shortUrl);
        } else if (isAuthMode && !cardData._id) {
            setExportUrl('');
        }
    }, [cardData._id, cardData.slug, isAuthMode]);

    const loadCard = async (id: string) => {
        try {
            setIsLoading(true);
            const card = await api.getCard(id);
            setCardData(card);
            setIsEditMode(true);
        } catch (error) {
            console.error('Failed to load card:', error);
            toast.error('Не удалось загрузить карточку');
            navigate('/profile');
        } finally {
            setIsLoading(false);
        }
    };

    const saveCard = async (): Promise<boolean> => {
        if (!cardData.name?.trim()) {
            toast.error('Укажите имя');
            return false;
        }

        // Режим гостя - генерируем URL
        if (isGuestMode) {
            const url = generateCardUrl(cardData);
            if (url) {
                setExportUrl(url);
                toast.success('Карточка готова!', 'Скопируйте ссылку ниже');
                return true;
            } else {
                toast.error('Не удалось создать карточку');
                return false;
            }
        }

        // Режим авторизованного пользователя - сохраняем через API
        try {
            setIsSaving(true);

            let savedCard: Card;
            if (isEditMode && cardId) {
                // Обновление существующей карточки
                savedCard = await api.updateCard(cardId, cardData);
                toast.success('Карточка обновлена');
            } else {
                // Создание новой карточки
                // Проверка лимитов для Free аккаунта
                if (user?.accountType === 'free') {
                    const cards = await api.getMyCards();
                    if (cards.length >= 1) {
                        toast.error(
                            'Лимит достигнут',
                            'Free аккаунт позволяет создать только 1 карточку. Обновитесь до Premium.'
                        );
                        return false;
                    }
                }

                savedCard = await api.createCard(cardData);
                toast.success('Карточка создана');
            }

            if (options.onSaveSuccess) {
                options.onSaveSuccess(savedCard);
            }

            // Переход в профиль
            setTimeout(() => {
                navigate('/profile');
            }, 1000);

            return true;
        } catch (error: any) {
            console.error('Failed to save card:', error);
            const errorMessage =
                error.response?.data?.message || 'Не удалось сохранить карточку';
            toast.error('Ошибка сохранения', errorMessage);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const updateField = <K extends keyof Card>(field: K, value: Card[K]) => {
        setCardData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    const clearForm = () => {
        setCardData({
            name: '',
            title: '',
            description: '',
            email: '',
            phone: '',
            website: '',
            company: '',
            location: '',
            avatar: '',
            socials: [],
            theme: 'light_minimal',
            visibility: {
                showEmail: true,
                showPhone: true,
                showLocation: true,
            },
        });

        localStorage.removeItem('linkoo_draft');

        setExportUrl('');
        toast.success('Форма очищена');
    };

    return {
        cardData,
        setCardData,
        updateField,
        saveCard,
        clearForm,
        isLoading,
        isSaving,
        exportUrl,
        isEditMode,
        isGuestMode,
        isAuthMode,
        user,
    };
};
