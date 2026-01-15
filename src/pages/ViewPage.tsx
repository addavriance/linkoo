import {useState, useEffect, ReactNode} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {
    Download,
    Share2,
    Mail,
    Phone,
    Globe,
    MapPin,
    Building,
    Heart,
    Plus,
    ExternalLink,
    HelpCircle,
    User as UserIcon
} from 'lucide-react';
import {getThemeById, applyThemeStyles} from '@/lib/themes';
import {extractCardDataFromUrl} from '@/lib/compression';
import {useToast} from '@/components/ui/use-toast';
import {openInNewTab} from "@/lib/navigation.js";
import {socialPlatforms, openSocialLink, processSocialLink, formatSocialLink} from "@/lib/socialLinks.js";
import {api} from '@/lib/api';
import type {Card as CardType} from '@/types';

const ViewPage = () => {
    const navigate = useNavigate();
    const {slug} = useParams<{slug?: string}>();
    const {toast} = useToast();
    const [cardData, setCardData] = useState<Partial<CardType> | null>(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    useEffect(() => {
        const loadCardData = async () => {
            if (slug) {
                try {
                    setLoading(true);
                    setError(null);

                    // Получаем информацию о ссылке
                    const linkInfo = await api.getLinkInfo(slug);

                    if (linkInfo.targetType === 'card' && linkInfo.cardId) {
                        // Загружаем карточку
                        const card = await api.getCard(linkInfo.cardId);
                        setCardData(card);

                        window.scrollTo({ top: 0, behavior: 'instant' });
                    } else if (linkInfo.targetType === 'url' && linkInfo.originalUrl) {
                        // Редирект на внешний URL
                        window.location.href = linkInfo.originalUrl;
                        return;
                    } else {
                        setError('Неверная ссылка');
                        setCardData(null);
                    }
                } catch (err: any) {
                    console.error('Failed to load link:', err);
                    setError(err.response?.data?.message || 'Ссылка не найдена');
                    setCardData(null);
                } finally {
                    setLoading(false);
                }
            } else {
                const urlData = extractCardDataFromUrl();
                if (urlData) {
                    setCardData(urlData);
                } else {
                    setError('Визитка не найдена');
                }
                setLoading(false);
            }
        };

        loadCardData();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Загружаем визитку...</p>
                </div>
            </div>
        );
    }

    if (!cardData) {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
                <Card className="max-w-md w-full text-center">
                    <CardContent className="p-8">
                        <HelpCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Визитка не найдена
                        </h1>
                        <p className="text-gray-600 mb-6">
                            {error || 'Ссылка повреждена или визитка не существует'}
                        </p>
                        <Button
                            onClick={() => navigate("/")}
                            className="w-full"
                        >
                            Создать свою визитку
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const theme = getThemeById(cardData.theme || 'light_minimal');

    // Сохранить контакт
    const saveContact = () => {
        const vCard = generateVCard(cardData);
        const blob = new Blob([vCard], {type: 'text/vcard'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cardData.name || 'contact'}.vcf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setSaved(true);
        toast({
            title: "Контакт сохранён",
            description: "Визитка добавлена в ваши контакты",
        });
    };

    // Поделиться визиткой
    const shareCard = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Визитка ${cardData.name}`,
                    text: `Посмотрите мою цифровую визитку!`,
                    url: url,
                });
            } catch (error) {
                copyToClipboard(url);
            }
        } else {
            copyToClipboard(url);
        }
    };

    // Копировать в буфер
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({
                title: "Скопировано",
                description: "Ссылка скопирована в буфер обмена",
            });
        } catch (error) {
            toast({
                title: "Ошибка",
                description: "Не удалось скопировать ссылку",
                variant: "destructive",
            });
        }
    };

    const openLink = (url: string) => {
        // Если это обычная ссылка (website)
        if (url.startsWith('http://') || url.startsWith('https://')) {
            window.open(url, '_blank', 'noopener,noreferrer');
            return;
        }

        // Если это не полная ссылка, добавляем https://
        const fullUrl = url.startsWith('http') ? url : `https://${url}`;
        window.open(fullUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-6 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Главная карточка */}
                    <Card className="mb-6 overflow-hidden shadow-xl">
                        <div
                            className="card-preview p-8 text-center relative rounded-none"
                            style={applyThemeStyles(theme)}
                        >
                            {/* Аватар */}
                            {cardData.avatar ? (
                                <img
                                    src={cardData.avatar}
                                    alt={cardData.name!}
                                    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-white/30 shadow-lg"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            ) : (
                                <div
                                    className="w-32 h-32 rounded-full mx-auto mb-6 bg-white/20 flex items-center justify-center border-4 border-white/30">
                                    <UserIcon className="h-16 w-16" />
                                </div>
                            )}

                            {/* Основная информация */}
                            <h1 className="text-3xl font-bold mb-2">
                                {cardData.name || 'Имя не указано'}
                            </h1>

                            {cardData.title && (
                                <p className="text-lg opacity-90 mb-2">{cardData.title}</p>
                            )}

                            {cardData.company && (
                                <p className="text-sm opacity-80 mb-4 flex items-center justify-center gap-1">
                                    <Building className="h-4 w-4"/>
                                    {cardData.company}
                                </p>
                            )}

                            {cardData.description && (
                                <p className="text-sm opacity-90 mb-6 max-w-md mx-auto leading-relaxed break-words">
                                    {cardData.description}
                                </p>
                            )}

                            {/* Действия */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button
                                    onClick={saveContact}
                                    variant="outline"
                                    disabled={saved}
                                >
                                    {saved ? (
                                        <>
                                            <Heart className="h-4 w-4 mr-2 fill-current"/>
                                            Сохранено
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-4 w-4 mr-2"/>
                                            Сохранить контакт
                                        </> as ReactNode
                                    )}
                                </Button>

                                <Button
                                    onClick={shareCard}
                                    variant="outline"
                                >
                                    <Share2 className="h-4 w-4 mr-2"/>
                                    Поделиться
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Контактная информация */}
                    <div className="grid gap-4 mb-6">
                        {cardData.email && (
                            <Card className="card-hover transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <CardContent className="p-4">
                                    <button
                                        onClick={() => window.location.href = `mailto:${cardData?.email}`}
                                        className="flex items-center space-x-3 w-full text-left hover:text-blue-600 transition-colors duration-200"
                                    >
                                        <div className="p-3 bg-blue-100 rounded-xl transition-colors duration-200 group-hover:bg-blue-200">
                                            <Mail className="h-5 w-5 text-blue-600"/>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 mb-1">Email</p>
                                            <p className="text-sm text-gray-600 break-all">{cardData.email}</p>
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-gray-400 transition-colors duration-200"/>
                                    </button>
                                </CardContent>
                            </Card>
                        )}

                        {cardData.phone && (
                            <Card className="card-hover transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <CardContent className="p-4">
                                    <button
                                        onClick={() => window.location.href = `tel:${cardData?.phone}`}
                                        className="flex items-center space-x-3 w-full text-left hover:text-green-600 transition-colors duration-200"
                                    >
                                        <div className="p-3 bg-green-100 rounded-xl transition-colors duration-200 group-hover:bg-green-200">
                                            <Phone className="h-5 w-5 text-green-600"/>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 mb-1">Телефон</p>
                                            <p className="text-sm text-gray-600">{cardData.phone}</p>
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-gray-400 transition-colors duration-200"/>
                                    </button>
                                </CardContent>
                            </Card>
                        )}

                        {cardData.website && (
                            <Card className="card-hover transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <CardContent className="p-4">
                                    <button
                                        onClick={() => openLink(cardData?.website || '')}
                                        className="flex items-center space-x-3 w-full text-left hover:text-purple-600 transition-colors duration-200"
                                    >
                                        <div className="p-3 bg-purple-100 rounded-xl transition-colors duration-200 group-hover:bg-purple-200">
                                            <Globe className="h-5 w-5 text-purple-600"/>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 mb-1">Веб-сайт</p>
                                            <p className="text-sm text-gray-600 break-all">{cardData.website}</p>
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-gray-400 transition-colors duration-200"/>
                                    </button>
                                </CardContent>
                            </Card>
                        )}

                        {cardData.location && (
                            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-orange-100 rounded-xl">
                                            <MapPin className="h-5 w-5 text-orange-600"/>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 mb-1">Местоположение</p>
                                            <p className="text-sm text-gray-600">{cardData.location}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {cardData.company && (
                            <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-indigo-100 rounded-xl">
                                            <Building className="h-5 w-5 text-indigo-600"/>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-900 mb-1">Компания</p>
                                            <p className="text-sm text-gray-600">{cardData.company}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Социальные сети */}
                    {cardData.socials && cardData.socials.length > 0 && (
                        <Card className="mb-6">
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Share2 className="h-5 w-5"/>
                                    Социальные сети
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {cardData.socials.map((social: any, index: number) => {
                                        const platformKey = social.platform as keyof typeof socialPlatforms;
                                        const platform = socialPlatforms[platformKey] || socialPlatforms.custom;
                                        const Icon = platform.icon;

                                        const processedUrl = social.platform === 'custom'
                                            ? social.link
                                            : processSocialLink(social.platform, social.link);

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => openSocialLink(social.platform, processedUrl)}
                                                className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left w-full group"
                                            >
                                                <div className={`p-2 rounded-lg text-white transition-transform group-hover:scale-110`}>
                                                    <Icon className="text-2xl text-gray-900"/>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900">{platform.name}</p>
                                                    <p className="text-sm text-gray-600 truncate">
                                                        {formatSocialLink(social)}
                                                    </p>
                                                </div>
                                                <ExternalLink className="h-4 w-4 text-gray-400 transition-colors group-hover:text-blue-600"/>
                                            </button>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Футер */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                            <span>Создано с помощью</span>
                            <Badge variant="secondary" className="font-medium">
                                Linkoo
                            </Badge>
                        </div>

                        <Button
                            variant="outline"
                            onClick={() => openInNewTab('/')}
                            className="w-full sm:w-auto"
                        >
                            <Plus className="h-4 w-4 mr-2"/>
                            Создать свою визитку
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Генерация vCard для сохранения контакта
const generateVCard = (cardData: Partial<CardType>) => {
    const vCard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${cardData.name || ''}`,
        cardData.title ? `TITLE:${cardData.title}` : '',
        cardData.company ? `ORG:${cardData.company}` : '',
        cardData.email ? `EMAIL:${cardData.email}` : '',
        cardData.phone ? `TEL:${cardData.phone}` : '',
        cardData.website ? `URL:${cardData.website}` : '',
        cardData.location ? `ADR:;;${cardData.location};;;;` : '',
        cardData.description ? `NOTE:${cardData.description}` : '',
        'END:VCARD'
    ].filter(line => line !== '').join('\n');

    return vCard;
};

export default ViewPage;
