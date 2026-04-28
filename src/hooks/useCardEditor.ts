import {useState, useEffect} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useAuth} from '@/contexts/AuthContext';
import {api} from '@/lib/api';
import {toast} from '@/lib/toast';
import {generateCardUrl} from '@/lib/compression';
import type {Card} from '@/types';
import {STORAGE_KEYS, MIN_EDITS_TIME} from "@/constants";

interface UseCardEditorOptions {
    onSaveSuccess?: (card: Card) => void;
}

export const useCardEditor = (options: UseCardEditorOptions = {}, onChange?: () => void) => {
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

    const [lastEditsTime, setLastEditsTime] = useState(Date.now());

    const isGuestMode = !isAuthenticated;
    const isAuthMode = isAuthenticated;

    useEffect(() => {
        if (cardId && isAuthMode) {
            loadCard(cardId);
        }
    }, [cardId, isAuthMode]);

    useEffect(() => {
        if (!cardId) {
            const draft = localStorage.getItem(STORAGE_KEYS.DRAFT);
            if (draft) {
                try {
                    const draftData = JSON.parse(draft);
                    setCardData(prev => ({...prev, ...draftData}));
                    toast.info('Карточка загружена из черновика');
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
                    localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(cardData));

                    if (Date.now() - lastEditsTime > MIN_EDITS_TIME) {
                        toast.info('Карточка сохранена в черновик');
                        setLastEditsTime(Date.now())
                    }
                }
            }, 1000);

            return () => clearTimeout(timeoutId);
        }
    }, [cardData, isGuestMode, isEditMode]);

    useEffect(() => {
        if (isGuestMode && (cardData.name || cardData.email || cardData.phone)) {
            const url = generateCardUrl(cardData);
            setExportUrl(url || '');
            onChange && onChange();
        }
    }, [cardData, isGuestMode]);

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
            const { name, title, description, email, phone, website, company,
                location, avatar, socials, theme, customTheme, visibility, isPublic,
                _id, slug } = card;
            setCardData({ name, title, description, email, phone, website, company,
                location, avatar, socials, theme, customTheme, visibility, isPublic,
                _id, slug });
            setIsEditMode(true);
        } catch (error) {
            console.error('Failed to load card:', error);
            toast.error('Не удалось загрузить карточку');
        } finally {
            setIsLoading(false);
        }
    };

    const saveCard = async (): Promise<boolean> => {
        if (!cardData.name?.trim()) {
            toast.error('Укажите имя');
            return false;
        }

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

        try {
            setIsSaving(true);

            let savedCard: Card;
            if (isEditMode && cardId) {
                savedCard = await api.updateCard(cardId, cardData);
                toast.success('Карточка обновлена');
            } else {
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

            setTimeout(() => {
                navigate(`/cards?highlight=${savedCard._id}`);
                clearForm();
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

        localStorage.removeItem(STORAGE_KEYS.DRAFT);

        setExportUrl('');
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
        setExportUrl,
        isEditMode,
        isGuestMode,
        isAuthMode,
        user,
    };
};
