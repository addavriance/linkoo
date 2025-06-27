import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Badge} from '@/components/ui/badge';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {
    User,
    Globe,
    Building,
    Plus,
    Trash2,
    Eye,
    Share2,
    Copy,
    Palette,
    Link,
    ExternalLink
} from 'lucide-react';

import {getThemeById, applyThemeStyles, getAllThemes} from '@/lib/themes';
import {generateCardUrl, shortenUrl, showShortenDialog, validatePhone} from '@/lib/compression';
import {useToast} from '@/components/ui/use-toast';
import {validateSocialInput, getSocialPlaceholder, socialPlatforms} from "@/lib/socialLinks.js";
import PhoneInput from "@/components/ui/phone-input.jsx";
import {FaGlobe} from "react-icons/fa";
import ImageUpload from "@/components/ui/image-upload.jsx";

const EditorPage = () => {
    const {toast} = useToast();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('basic');
    const [cardData, setCardData] = useState({
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
        theme: 'light_minimal'
    });

    const [exportUrl, setExportUrl] = useState('');
    const [availableThemes, setAvailableThemes] = useState({});
    const [isShortening, setIsShortening] = useState(false);

    // Загружаем темы при инициализации
    useEffect(() => {
        const themes = getAllThemes(); // Встроенные + кастомные из localStorage
        setAvailableThemes(themes);

        // Проверяем выбранную тему из localStorage
        const savedTheme = localStorage.getItem('linkoo_selected_theme');
        if (savedTheme && themes[savedTheme]) {
            setCardData(prev => ({...prev, theme: savedTheme}));
        }
    }, []);

    // Обновление URL при изменении данных
    useEffect(() => {
        if (cardData.name || cardData.email || cardData.phone) {
            const url = generateCardUrl(cardData);
            setExportUrl(url || '');
        }
    }, [cardData]);

    // Сохранение черновика в localStorage
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (cardData.name || cardData.email) {
                localStorage.setItem('linkoo_draft', JSON.stringify(cardData));
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [cardData]);

    // Загрузка черновика при инициализации
    useEffect(() => {
        const draft = localStorage.getItem('linkoo_draft');
        if (draft) {
            try {
                const draftData = JSON.parse(draft);
                setCardData(prev => ({...prev, ...draftData}));
            } catch (error) {
                console.error('Ошибка загрузки черновика:', error);
            }
        }
    }, []);

    // Обновление данных карточки
    const updateCardData = (field, value) => {
        setCardData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Добавление социальной сети
    const addSocialLink = () => {
        setCardData(prev => ({
            ...prev,
            socials: [...prev.socials, {platform: 'telegram', link: ''}]
        }));
    };

    // Удаление социальной сети
    const removeSocialLink = (index) => {
        setCardData(prev => ({
            ...prev,
            socials: prev.socials.filter((_, i) => i !== index)
        }));
    };

    // Обновление социальной сети
    const updateSocialLink = (index, field, value) => {
        setCardData(prev => {
            const newSocials = [...prev.socials];
            newSocials[index] = {...newSocials[index], [field]: value};

            // Валидация при изменении ссылки
            if (field === 'link') {
                const platform = newSocials[index].platform;
                const isValid = validateSocialInput(platform, value);

                // Можно добавить визуальную индикацию ошибки
                if (!isValid && value.trim()) {
                    console.warn(`Некорректный формат для ${platform}: ${value}`);
                }
            }

            return {
                ...prev,
                socials: newSocials
            };
        });
    };

    // Копирование URL
    const copyUrl = async () => {
        try {
            await navigator.clipboard.writeText(exportUrl);
            toast({
                title: "✅ Скопировано!",
                description: "Ссылка на визитку скопирована в буфер обмена",
            });
        } catch (error) {
            toast({
                title: "❌ Ошибка",
                description: "Не удалось скопировать ссылку",
                variant: "destructive",
            });
        }
    };

    // Сокращение ссылки
    const handleShortenUrl = async () => {
        if (!exportUrl) return;

        setIsShortening(true);

        try {
            const result = await shortenUrl(exportUrl);

            if (result.success) {
                setExportUrl(result.shortUrl);
                toast({
                    title: "✅ Ссылка сокращена!",
                    description: `Использован сервис: ${result.service}`,
                });
            } else {
                // Показываем диалог с альтернативными способами
                showShortenDialog(
                    exportUrl,
                    (message) => {
                        toast({
                            title: "📋 Успешно",
                            description: message,
                        });
                    },
                    () => {
                        // Диалог закрыт
                    }
                );
            }
        } catch (error) {
            toast({
                title: "❌ Ошибка",
                description: "Не удалось сократить ссылку",
                variant: "destructive",
            });
        } finally {
            setIsShortening(false);
        }
    };

    // Открытие карточки в новой вкладке
    const openPreview = () => {
        if (exportUrl) {
            window.open(exportUrl, '_blank');
        }
    };

    // Переход к галерее тем
    const goToThemes = () => {
        navigate('/themes');
    };

    // Очистка формы
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
            theme: 'light_minimal'
        });
        localStorage.removeItem('linkoo_draft');
        toast({
            title: "🗑️ Форма очищена",
            description: "Все данные удалены",
        });
    };

    // Текущая тема
    const currentTheme = getThemeById(cardData.theme);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            Создать Визитку
                        </h1>
                        <p className="text-lg text-gray-600">
                            Заполните информацию и создайте свою уникальную цифровую визитку
                        </p>

                        {/* Действия */}
                        <div className="flex justify-center gap-4 mt-4">
                            <Button variant="outline" onClick={goToThemes}>
                                <Palette className="h-4 w-4 mr-2"/>
                                Галерея тем
                            </Button>
                            <Button variant="outline" onClick={clearForm}>
                                <Trash2 className="h-4 w-4 mr-2"/>
                                Очистить
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Редактор */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5"/>
                                        Редактор Визитки
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="basic">Основное</TabsTrigger>
                                            <TabsTrigger value="social">Соц. сети</TabsTrigger>
                                            <TabsTrigger value="style">Стиль</TabsTrigger>
                                        </TabsList>

                                        {/* Основная информация */}
                                        <TabsContent value="basic" className="space-y-4 mt-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Имя *
                                                    </label>
                                                    <Input
                                                        placeholder="Иван Петров"
                                                        value={cardData.name}
                                                        onChange={(e) => updateCardData('name', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Должность
                                                    </label>
                                                    <Input
                                                        placeholder="Frontend Developer"
                                                        value={cardData.title}
                                                        onChange={(e) => updateCardData('title', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                    Описание
                                                </label>
                                                <Textarea
                                                    placeholder="Расскажите немного о себе..."
                                                    value={cardData.description}
                                                    onChange={(e) => updateCardData('description', e.target.value)}
                                                    rows={3}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Email
                                                    </label>
                                                    <Input
                                                        type="email"
                                                        placeholder="ivan@example.com"
                                                        value={cardData.email}
                                                        onChange={(e) => updateCardData('email', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Телефон
                                                    </label>
                                                    <PhoneInput
                                                        value={cardData.phone}
                                                        onChange={(phone) => updateCardData('phone', phone)}
                                                        placeholder="+7 (999) 123-45-67"
                                                    />
                                                    {cardData.phone && !validatePhone(cardData.phone) && (
                                                        <p className="text-xs text-amber-600 mt-6">
                                                            💡 Некорректный номер не будет включен в визитку
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Веб-сайт
                                                    </label>
                                                    <Input
                                                        placeholder="https://example.com"
                                                        value={cardData.website}
                                                        onChange={(e) => updateCardData('website', e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Компания
                                                    </label>
                                                    <Input
                                                        placeholder="Название компании"
                                                        value={cardData.company}
                                                        onChange={(e) => updateCardData('company', e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            {/* Фото и местоположение в отдельном ряду */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Фото профиля
                                                    </label>
                                                    <ImageUpload
                                                        value={cardData.avatar}
                                                        onChange={(url) => updateCardData('avatar', url)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                        Местоположение
                                                    </label>
                                                    <Input
                                                        placeholder="Москва, Россия"
                                                        value={cardData.location}
                                                        onChange={(e) => updateCardData('location', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </TabsContent>

                                        {/* Социальные сети */}
                                        <TabsContent value="social" className="space-y-4 mt-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-medium text-gray-900">Социальные сети</h3>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={addSocialLink}
                                                >
                                                    <Plus className="h-4 w-4 mr-2"/>
                                                    Добавить
                                                </Button>
                                            </div>

                                            {cardData.socials.length === 0 ? (
                                                <div className="text-center py-6 text-gray-500">
                                                    <Globe className="h-8 w-8 mx-auto mb-2 opacity-50"/>
                                                    <p>Добавьте ссылки на социальные сети</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-6">
                                                    {cardData.socials.map((social, index) => {
                                                        const isValid = validateSocialInput(social.platform, social.link);
                                                        const placeholder = getSocialPlaceholder(social.platform);

                                                        return (
                                                            <div key={index} className="flex gap-2">
                                                                <Select
                                                                    value={social.platform}
                                                                    onValueChange={(value) => updateSocialLink(index, 'platform', value)}
                                                                >
                                                                    <SelectTrigger className="w-40">
                                                                        <SelectValue/>
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {Object.entries(socialPlatforms).map(([key, platform]) => {
                                                                            const Icon = platform.icon;

                                                                            return (
                                                                                <SelectItem key={key} value={key}>
                                                                                    <span className="flex gap-1 items-center">
                                                                                        <Icon/> {platform.name}
                                                                                    </span>
                                                                                </SelectItem>
                                                                            )
                                                                        })}
                                                                    </SelectContent>
                                                                </Select>

                                                                <div className="flex-1 relative">
                                                                    <Input
                                                                        placeholder={placeholder}
                                                                        value={social.link}
                                                                        onChange={(e) => updateSocialLink(index, 'link', e.target.value)}
                                                                        className={`${
                                                                            social.link && !isValid
                                                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                                                                : ''
                                                                        }`}
                                                                    />
                                                                    {social.link && !isValid && (
                                                                        <div
                                                                            className="absolute -bottom-4 left-0 text-xs text-red-500">
                                                                            Некорректный формат
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => removeSocialLink(index)}
                                                                    className="hover:bg-red-50 hover:border-red-300"
                                                                >
                                                                    <Trash2 className="h-4 w-4"/>
                                                                </Button>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </TabsContent>

                                        {/* Стили */}
                                        <TabsContent value="style" className="space-y-4 mt-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-medium text-gray-900 mb-3">Выберите тему</h3>
                                                <Button variant="outline" size="sm" onClick={goToThemes}>
                                                    <ExternalLink className="h-4 w-4 mr-2"/>
                                                    Больше тем
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {Object.values(availableThemes).slice(0, 12).map((theme) => (
                                                    <button
                                                        key={theme.id}
                                                        onClick={() => updateCardData('theme', theme.id)}
                                                        className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                                                            cardData.theme === theme.id
                                                                ? 'border-blue-500 ring-2 ring-blue-200'
                                                                : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <div
                                                            className="w-full h-16 rounded mb-2"
                                                            style={applyThemeStyles(theme)}
                                                        />
                                                        <p className="text-xs font-medium text-gray-700">{theme.name}</p>
                                                        <span className="text-lg">{theme.preview}</span>
                                                        {theme.isCustom && (
                                                            <Badge className="absolute -top-1 -right-1 text-xs">
                                                                Custom
                                                            </Badge>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>

                            {/* Экспорт */}
                            {exportUrl && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Share2 className="h-5 w-5"/>
                                            Экспорт Визитки
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                                                Ссылка на визитку
                                            </label>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={exportUrl}
                                                    readOnly
                                                    className="font-mono text-xs"
                                                />
                                                <Button variant="outline" onClick={copyUrl}>
                                                    <Copy className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 flex-wrap">
                                            <Button onClick={openPreview} className="flex-1">
                                                <Eye className="h-4 w-4 mr-2"/>
                                                Предпросмотр
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={handleShortenUrl}
                                                disabled={isShortening}
                                            >
                                                {isShortening ? (
                                                    <>⏳ Сокращаем...</>
                                                ) : (
                                                    <>
                                                        <Link className="h-4 w-4 mr-2"/>
                                                        Сократить
                                                    </>
                                                )}
                                            </Button>
                                            <Button variant="outline" onClick={copyUrl}>
                                                <Copy className="h-4 w-4 mr-2"/>
                                                Копировать
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Превью */}
                        <div className="lg:sticky lg:top-8">
                            <Card className="transition-all duration-300 hover:shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="h-5 w-5"/>
                                        Превью
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="mx-auto max-w-sm">
                                        <div
                                            className="card-preview transition-all duration-300"
                                            style={applyThemeStyles(currentTheme)}
                                        >
                                            <div className="card-preview-content">
                                                {/* Аватар */}
                                                {cardData.avatar ? (
                                                    <img
                                                        src={cardData.avatar}
                                                        alt="Avatar"
                                                        className="card-preview-avatar"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="card-preview-avatar-placeholder">
                                                        👤
                                                    </div>
                                                )}

                                                {/* Основная информация */}
                                                <div className="space-y-1">
                                                    <h3 className="card-preview-name">
                                                        {cardData.name || 'Ваше имя'}
                                                    </h3>

                                                    {cardData.title && (
                                                        <p className="card-preview-title">{cardData.title}</p>
                                                    )}

                                                    {cardData.company && (
                                                        <p className="card-preview-company">
                                                            <Building className="h-3 w-3"/>
                                                            {cardData.company}
                                                        </p>
                                                    )}
                                                </div>

                                                {cardData.description && (
                                                    <p className="card-preview-description">
                                                        {cardData.description}
                                                    </p>
                                                )}

                                                {/* Контакты */}
                                                {(cardData.email || cardData.phone || cardData.website || cardData.location) && (
                                                    <div className="card-preview-contacts">
                                                        {cardData.email && (
                                                            <div className="card-preview-contact-item">
                                                                📧 {cardData.email}
                                                            </div>
                                                        )}
                                                        {cardData.phone && (
                                                            <div className="card-preview-contact-item">
                                                                📱 {cardData.phone}
                                                            </div>
                                                        )}
                                                        {cardData.website && (
                                                            <div className="card-preview-contact-item">
                                                                🌐 {cardData.website.replace(/^https?:\/\//, '')}
                                                            </div>
                                                        )}
                                                        {cardData.location && (
                                                            <div className="card-preview-contact-item">
                                                                📍 {cardData.location}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Социальные сети */}
                                                {cardData.socials.length > 0 && (
                                                    <div className="card-preview-socials">
                                                        {cardData.socials.slice(0, 6).map((social, index) => {
                                                            const Icon = socialPlatforms[social.platform]?.icon || FaGlobe;
                                                            return (
                                                                <span
                                                                    key={index}
                                                                    className="card-preview-social-item"
                                                                    title={socialPlatforms[social.platform]?.name}
                                                                    >
                                                                    <Icon/>
                                                                </span>
                                                            )
                                                        })}
                                                        {cardData.socials.length > 6 && (
                                                            <span
                                                                className="card-preview-social-item"
                                                                title={`+${cardData.socials.length - 6} еще`}
                                                            >
                                                                +{cardData.socials.length - 6}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditorPage;
