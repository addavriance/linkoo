import {useEffect, useState} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import {api} from '@/lib/api';
import {toast} from '@/lib/toast';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import type {Card as CardType} from '@/types';
import {useNavigate} from 'react-router-dom';
import {
    Star,
    Award,
    Eye,
    Globe,
    Lock,
    Edit,
    Trash2,
    Plus,
    Copy,
    ExternalLink,
    Link as LinkIcon,
    QrCode
} from 'lucide-react';
import {ManageLinkDialog} from '@/components/dialogs/ManageLinkDialog.tsx';
import {QRCodeDialog} from '@/components/dialogs/QRCodeDialog.tsx';
import { CardDeleteDialog } from "@/components/dialogs/CardDeleteDialog";

export default function ProfilePage() {
    const {user, isLoading: authLoading, logout} = useAuth();
    const [cards, setCards] = useState<CardType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [manageLinkDialogOpen, setManageLinkDialogOpen] = useState(false);
    const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [selectedCardId, setSelectedCardId] = useState<string | undefined>();
    const [selectedCardSlug, setSelectedCardSlug] = useState<string | undefined>();
    const [selectedCardName, setSelectedCardName] = useState<string>('');
    const [selectedCardAvatar, setSelectedCardAvatar] = useState<string | undefined>();

    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/');
        } else if (user) {
            loadCards();
        }
    }, [user, authLoading, navigate]);

    const loadCards = async () => {
        try {
            setIsLoading(true);
            const userCards = await api.getMyCards();
            setCards(userCards);
        } catch (error) {
            console.error('Failed to load cards:', error);
            toast.error('Не удалось загрузить карточки');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteConfirm = (cardId: string, cardName: string) => {
        setSelectedCardId(cardId);
        setSelectedCardName(cardName);
        setDeleteDialogOpen(true)
    }

    const handleDeleteCard = async (cardId: string) => {
        try {
            await api.deleteCard(cardId);
            setCards(cards.filter(c => c._id !== cardId));
            toast.success('Карточка удалена');
        } catch (error) {
            console.error('Failed to delete card:', error);
            toast.error('Не удалось удалить карточку');
        }
    };

    const getCardUrl = (slug?: string) => {
        if (!slug) return null;
        return `${window.location.origin}/${slug}`;
    };

    const handleCopyLink = async (slug?: string) => {
        const url = getCardUrl(slug);
        if (!url) {
            toast.error('Ссылка недоступна');
            return;
        }

        try {
            await navigator.clipboard.writeText(url);
            toast.success('Ссылка скопирована');
        } catch (error) {
            toast.error('Не удалось скопировать ссылку');
        }
    };

    const handleOpenCard = (slug?: string) => {
        const url = getCardUrl(slug);
        if (url) {
            window.open(url, '_blank');
        }
    };

    const handleManageLink = (cardId: string, currentSlug?: string) => {
        setSelectedCardId(cardId);
        setSelectedCardSlug(currentSlug);
        setManageLinkDialogOpen(true);
    };

    const handleLinkUpdated = (cardId: string, newSlug?: string) => {
        setCards(cards.map(card =>
            card._id === cardId ? {...card, slug: newSlug} : card
        ));
    };

    const handleShowQRCode = (slug: string, cardName: string, avatar?: string) => {
        setSelectedCardSlug(slug);
        setSelectedCardName(cardName);
        setSelectedCardAvatar(avatar);
        setQrCodeDialogOpen(true);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (authLoading || isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">Загрузка...</div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const canCreateMore = user.accountType === 'paid' || cards.length === 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* User Profile */}
                <Card className="p-6 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        {user.profile.avatar && (
                            <img
                                src={user.profile.avatar}
                                alt={user.profile.name}
                                className="w-16 h-16 rounded-full"
                            />
                        )}
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold">{user.profile.name}</h1>
                            <p className="text-gray-600">{user.email}</p>
                            <div className="flex gap-2 mt-2">
                                <span
                                    className={`px-2 py-1 rounded text-sm ${
                                        user.accountType === 'paid'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {user.accountType === 'paid' ? (
                                        <span className="flex items-center gap-1">
                                            <Star className="h-3 w-3"/>
                                            Premium
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1">
                                            <Award className="h-3 w-3"/>
                                            Free
                                        </span>
                                    )}
                                </span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                    {user.provider.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <Button variant="outline" onClick={handleLogout}>
                            Выйти
                        </Button>
                    </div>

                    {user.accountType === 'free' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                            <p className="text-sm text-blue-900">
                                <strong>Free аккаунт:</strong> Вы можете создать только 1 карточку.
                                Обновитесь до Premium для неограниченного количества карточек и custom доменов.
                            </p>
                            <Button className="mt-2" size="sm">
                                Обновить до Premium
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Cards List */}
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Мои карточки</h2>
                    {canCreateMore && (
                        <Button onClick={() => navigate('/editor')}>
                            <Plus className="h-4 w-4 mr-2"/>
                            Создать карточку
                        </Button>
                    )}
                </div>

                {cards.length === 0 ? (
                    <Card className="p-8 text-center">
                        <p className="text-gray-600 mb-4">У вас пока нет карточек</p>
                        <Button onClick={() => navigate('/editor')}>
                            Создать первую карточку
                        </Button>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {cards.map((card) => (
                            <Card key={card._id} className="p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    {card.avatar && (
                                        <img
                                            src={card.avatar}
                                            alt={card.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold truncate">{card.name}</h3>
                                        {card.title && (
                                            <p className="text-sm text-gray-600 truncate">{card.title}</p>
                                        )}
                                        {card.description && (
                                            <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                                                {card.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2 text-xs text-gray-600 mb-3">
                                    <span className="flex items-center gap-1">
                                        <Eye className="h-3 w-3"/>
                                        {card.viewCount || 0} просмотров
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        {card.isPublic ? (
                                            <>
                                                <Globe className="h-3 w-3"/>
                                                Публичная
                                            </>
                                        ) : (
                                            <>
                                                <Lock className="h-3 w-3"/>
                                                Приватная
                                            </>
                                        )}
                                    </span>
                                </div>

                                {/* Короткая ссылка */}
                                {card.slug ? (
                                    <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={getCardUrl(card.slug) || ''}
                                                readOnly
                                                className="flex-1 px-2 py-1 bg-white border border-gray-200 rounded text-xs font-mono truncate"
                                            />
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleCopyLink(card.slug)}
                                                className="h-7 w-7 p-0"
                                                title="Копировать ссылку"
                                            >
                                                <Copy className="h-3 w-3"/>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleOpenCard(card.slug)}
                                                className="h-7 w-7 p-0"
                                                title="Открыть в новой вкладке"
                                            >
                                                <ExternalLink className="h-3 w-3"/>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleManageLink(card._id!, card.slug)}
                                                className="h-7 w-7 p-0"
                                                title="Управление ссылкой"
                                            >
                                                <Edit className="h-3 w-3"/>
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleShowQRCode(card.slug!, card.name, card.avatar)}
                                                className="h-7 w-7 p-0"
                                                title="QR код"
                                            >
                                                <QrCode className="h-3 w-3"/>
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-3">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleManageLink(card._id!)}
                                            className="w-full"
                                        >
                                            <LinkIcon className="h-4 w-4 mr-2"/>
                                            Создать ссылку
                                        </Button>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => navigate(`/editor?cardId=${card._id}`)}
                                        className="flex-1"
                                    >
                                        <Edit className="h-4 w-4 mr-2"/>
                                        Редактировать
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDeleteConfirm(card._id!, card.name)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Диалог управления ссылкой */}
            {selectedCardId && (
                <ManageLinkDialog
                    open={manageLinkDialogOpen}
                    onOpenChange={setManageLinkDialogOpen}
                    cardId={selectedCardId}
                    currentSlug={selectedCardSlug}
                    onLinkUpdated={(newSlug) => handleLinkUpdated(selectedCardId, newSlug)}
                />
            )}

            {/* Диалог QR кода */}
            {selectedCardSlug && (
                <QRCodeDialog
                    open={qrCodeDialogOpen}
                    onOpenChange={setQrCodeDialogOpen}
                    url={getCardUrl(selectedCardSlug) || ''}
                    cardName={selectedCardName}
                    avatar={selectedCardAvatar}
                />
            )}
            <CardDeleteDialog open={deleteDialogOpen} cardName={selectedCardName} cardId={selectedCardId} onDelete={handleDeleteCard} onOpenChange={setDeleteDialogOpen}/>
        </div>
    );
}
