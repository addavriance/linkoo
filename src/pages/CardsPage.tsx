import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '@/contexts/AuthContext';
import {api} from '@/lib/api';
import {toast} from '@/lib/toast';
import {Button} from '@/components/ui/button';
import {Card} from '@/components/ui/card';
import {ProfileLayout} from '@/components/layout/ProfileLayout';
import {CardSkeleton} from '@/components/cards/CardSkeleton';
import {CardLinkSection} from '@/components/cards/CardLinkSection';
import {CardSubdomainSection} from '@/components/cards/CardSubdomainSection';
import {QRCodeDialog} from '@/components/dialogs/QRCodeDialog';
import {CardDeleteDialog} from '@/components/dialogs/CardDeleteDialog';
import type {Card as CardType} from '@/types';
import {Eye, Globe, Lock, Edit, Trash2, Plus, BarChart2} from 'lucide-react';



export default function CardsPage() {
    const {user, isLoading: authLoading} = useAuth();
    const [cards, setCards] = useState<CardType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [qrTarget, setQrTarget] = useState<{slug: string; name: string; avatar?: string} | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<{id: string; name: string} | null>(null);

    const navigate = useNavigate();
    const isPaid = user?.accountType === 'paid';

    useEffect(() => {
        if (!authLoading && !user) navigate('/');
        else if (user) loadCards();
    }, [user, authLoading, navigate]);

    const loadCards = async () => {
        try {
            setIsLoading(true);
            setCards(await api.getMyCards());
        } catch {
            toast.error('Не удалось загрузить карточки');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        try {
            await api.deleteCard(cardId);
            setCards(prev => prev.filter(c => c._id !== cardId));
            toast.success('Карточка удалена');
        } catch {
            toast.error('Не удалось удалить карточку');
        }
    };

    const handleLinkUpdated = (cardId: string, newSlug?: string) =>
        setCards(prev => prev.map(c => c._id === cardId ? {...c, slug: newSlug} : c));

    const handleSubdomainUpdated = (cardId: string, newSubdomain?: string) =>
        setCards(prev => prev.map(c => c._id === cardId ? {...c, subdomain: newSubdomain} : c));

    const canCreateMore = isPaid || (cards.length === 0 && user?.accountType === 'free');

    if (!authLoading && !user) return null;

    return (
        <ProfileLayout title="Мои карточки" description="Управляйте своими цифровыми визитками">
            {user?.accountType === 'free' && cards.length >= 1 && (
                <Card className="p-6 mb-6 bg-gradient-to-r wd:(from-blue-50 to-purple-50 border-blue-200)">
                    <h3 className="font-semibold text-lg mb-2">Лимит карточек достигнут</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                        Обновитесь до Premium для создания неограниченного количества карточек и получения custom доменов.
                    </p>
                    <Button
                        onClick={() => navigate('/premium')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600
                         hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                        Перейти на Premium
                    </Button>
                </Card>
            )}

            {canCreateMore && (
                <div className="mb-6">
                    <Button onClick={() => navigate('/editor')} size="lg">
                        <Plus className="h-5 w-5 mr-2"/>
                        Создать карточку
                    </Button>
                </div>
            )}

            {isLoading && cards.length === 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                    <CardSkeleton/>
                    <CardSkeleton/>
                </div>
            ) : cards.length === 0 ? (
                <Card className="p-12 text-center">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Plus className="h-8 w-8 text-muted-foreground"/>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">У вас пока нет карточек</h3>
                        <p className="text-muted-foreground mb-6">Создайте свою первую цифровую визитку</p>
                        <Button onClick={() => navigate('/editor')} size="lg">
                            Создать первую карточку
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className={`grid gap-4 md:grid-cols-2 transition-opacity duration-300 ${isLoading ? 'opacity-60' : ''}`}>
                    {cards.map((card) => (
                        <Card key={card._id} className="p-4 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-3 mb-3">
                                {card.avatar && (
                                    <img
                                        src={card.avatar}
                                        alt={card.name}
                                        className="w-12 h-12 rounded-full object-cover shrink-0"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold truncate">{card.name}</h3>
                                    {card.title && <p className="text-sm text-muted-foreground truncate">{card.title}</p>}
                                    {card.description && (
                                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{card.description}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 text-xs text-muted-foreground mb-3">
                                <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3"/>
                                    {card.viewCount || 0} просмотров
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    {card.isPublic
                                        ? <><Globe className="h-3 w-3"/>Публичная</>
                                        : <><Lock className="h-3 w-3"/>Приватная</>
                                    }
                                </span>
                            </div>

                            <CardLinkSection
                                cardId={card._id!}
                                slug={card.slug}
                                onUpdated={(slug) => handleLinkUpdated(card._id!, slug)}
                                onQRCode={() => setQrTarget({slug: card.slug!, name: card.name, avatar: card.avatar})}
                                className="mb-2"
                            />

                            {isPaid && (
                                <CardSubdomainSection
                                    cardId={card._id!}
                                    subdomain={card.subdomain}
                                    onUpdated={(sub) => handleSubdomainUpdated(card._id!, sub)}
                                    className="mb-5"
                                />
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
                                {isPaid && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => navigate(`/analytics/${card._id}`)}
                                        title="Аналитика"
                                    >
                                        <BarChart2 className="h-4 w-4"/>
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setDeleteTarget({id: card._id!, name: card.name})}
                                    className="wd:(text-red-600 hover:text-red-700 hover:bg-red-100)"
                                >
                                    <Trash2 className="h-4 w-4"/>
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {qrTarget && (
                <QRCodeDialog
                    open={!!qrTarget}
                    onOpenChange={(open) => !open && setQrTarget(null)}
                    url={`${window.location.origin}/${qrTarget.slug}`}
                    cardName={qrTarget.name}
                    avatar={qrTarget.avatar}
                />
            )}

            <CardDeleteDialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                cardName={deleteTarget?.name ?? ''}
                cardId={deleteTarget?.id}
                onDelete={handleDeleteCard}
            />
        </ProfileLayout>
    );
}
