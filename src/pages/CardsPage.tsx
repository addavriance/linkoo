import {useEffect, useState} from 'react';
import {useAuth} from '@/contexts/AuthContext';
import {api} from '@/lib/api';
import {toast} from '@/lib/toast';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import type {Card as CardType} from '@/types';
import {useNavigate} from 'react-router-dom';
import {
    Eye,
    Globe,
    Lock,
    Edit,
    Trash2,
    Plus,
    Copy,
    QrCode,
} from 'lucide-react';
import {ManageLinkDialog} from '@/components/dialogs/ManageLinkDialog';
import {QRCodeDialog} from '@/components/dialogs/QRCodeDialog';
import {CardDeleteDialog} from '@/components/dialogs/CardDeleteDialog';

function Skeleton({className = ''}: { className?: string }) {
    return <div className={`animate-pulse bg-gray-200 rounded ${className}`}/>;
}

function CardSkeleton() {
    return (
        <Card className="p-4 space-y-3">
            <div className="flex items-start gap-3">
                <Skeleton className="w-12 h-12 rounded-full shrink-0"/>
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32"/>
                    <Skeleton className="h-4 w-24"/>
                </div>
            </div>
            <Skeleton className="h-3 w-3/4"/>
            <Skeleton className="h-10 w-full"/>
            <div className="flex gap-2">
                <Skeleton className="h-8 flex-1"/>
                <Skeleton className="h-8 w-8"/>
            </div>
        </Card>
    );
}

export default function CardsPage() {
    const {user, isLoading: authLoading} = useAuth();
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
        setDeleteDialogOpen(true);
    };

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

    if (!authLoading && !user) {
        return null;
    }

    const canCreateMore = user?.accountType === 'paid' || (cards.length === 0 && user?.accountType === 'free');

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Мои карточки</h1>
                    <p className="text-gray-600 mt-2">Управляйте своими цифровыми визитками</p>
                </div>

                {/* Premium Notice for Free Users */}
                {user?.accountType === 'free' && cards.length >= 1 && (
                    <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-2">Лимит карточек достигнут</h3>
                                <p className="text-sm text-gray-700 mb-3">
                                    Обновитесь до Premium для создания неограниченного количества карточек и получения custom доменов.
                                </p>
                                <Button
                                    onClick={() => navigate('/premium')}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                    Перейти на Premium
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Create Button */}
                {canCreateMore && (
                    <div className="mb-6">
                        <Button onClick={() => navigate('/editor')} size="lg">
                            <Plus className="h-5 w-5 mr-2"/>
                            Создать карточку
                        </Button>
                    </div>
                )}

                {/* Cards Grid */}
                {isLoading && cards.length === 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        <CardSkeleton/>
                        <CardSkeleton/>
                    </div>
                ) : cards.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <Plus className="h-8 w-8 text-gray-400"/>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">У вас пока нет карточек</h3>
                            <p className="text-gray-600 mb-6">Создайте свою первую цифровую визитку</p>
                            <Button onClick={() => navigate('/editor')} size="lg">
                                Создать первую карточку
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div
                        className={`grid gap-4 md:grid-cols-2 transition-opacity duration-300 ${isLoading ? 'opacity-60' : ''}`}>
                        {cards.map((card) => (
                            <Card key={card._id} className="p-4 hover:shadow-lg transition-shadow">
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

                                {/* Short Link */}
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
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Dialogs */}
            {selectedCardId && (
                <ManageLinkDialog
                    open={manageLinkDialogOpen}
                    onOpenChange={setManageLinkDialogOpen}
                    cardId={selectedCardId}
                    currentSlug={selectedCardSlug}
                    onLinkUpdated={(newSlug) => handleLinkUpdated(selectedCardId, newSlug)}
                />
            )}

            {selectedCardSlug && (
                <QRCodeDialog
                    open={qrCodeDialogOpen}
                    onOpenChange={setQrCodeDialogOpen}
                    url={getCardUrl(selectedCardSlug) || ''}
                    cardName={selectedCardName}
                    avatar={selectedCardAvatar}
                />
            )}

            <CardDeleteDialog
                open={deleteDialogOpen}
                cardName={selectedCardName}
                cardId={selectedCardId}
                onDelete={handleDeleteCard}
                onOpenChange={setDeleteDialogOpen}
            />
        </div>
    );
}
