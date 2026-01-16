import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {User, Palette, Share2, Copy, Eye, Trash2, Link as LinkIcon, Mail, Phone, Globe as GlobeIcon, Building, MapPin, Lightbulb} from 'lucide-react';

import {useCardEditor} from '@/hooks/useCardEditor';
import {SaveButton, EditorModeInfo} from '@/components/editor/SaveButton';
import {BasicInfoSection} from '@/components/editor/BasicInfoSection';
import {SocialLinksSection} from '@/components/editor/SocialLinksSection';
import {ThemeSection} from '@/components/editor/ThemeSection';
import {getThemeById, applyThemeStyles} from '@/lib/themes';
import {shortenUrl} from '@/lib/compression';
import {toast} from '@/lib/toast';
import {socialPlatforms} from "@/lib/socialLinks.ts";
import {FaGlobe} from "react-icons/fa";

const EditorPage: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('basic');
    const [isShortening, setIsShortening] = useState(false);

    const {
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
    } = useCardEditor();

    const currentTheme = getThemeById(cardData.theme || 'light_minimal');

    const copyUrl = async () => {
        if (!exportUrl) {
            toast.warning('Сначала создайте карточку');
            return;
        }

        try {
            await navigator.clipboard.writeText(exportUrl);
            toast.success('Ссылка скопирована');
        } catch (error) {
            toast.error('Не удалось скопировать ссылку');
        }
    };

    const handleShortenUrl = async () => {
        if (!exportUrl) return;

        setIsShortening(true);
        try {
            const result = await shortenUrl(exportUrl);
            if (result.success && result.shortUrl) {
                await navigator.clipboard.writeText(result.shortUrl);
                toast.success('Короткая ссылка скопирована', `Сервис: ${result.service}`);
            } else {
                toast.error('Не удалось сократить ссылку');
            }
        } catch (error) {
            toast.error('Ошибка сокращения ссылки');
        } finally {
            setIsShortening(false);
        }
    };

    const openPreview = () => {
        if (exportUrl) {
            window.open(exportUrl, '_blank');
        } else if (isAuthMode && cardData._id) {
            // TODO: Открыть публичную версию карточки
            toast.info('Просмотр для сохраненных карточек скоро появится');
        } else {
            toast.warning('Сначала создайте карточку');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Загрузка...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {isEditMode ? 'Редактировать визитку' : 'Создать визитку'}
                        </h1>
                        <p className="text-lg text-gray-600">
                            Заполните информацию и создайте свою уникальную цифровую визитку
                        </p>

                        {/* Actions */}
                        <div className="flex justify-center gap-4 mt-4">
                            <Button variant="outline" onClick={() => navigate('/themes')}>
                                <Palette className="h-4 w-4 mr-2"/>
                                Галерея тем
                            </Button>
                            <Button variant="outline" onClick={clearForm}>
                                <Trash2 className="h-4 w-4 mr-2"/>
                                Очистить
                            </Button>
                        </div>
                    </div>

                    {/* Mode Info */}
                    <EditorModeInfo/>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Editor */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5"/>
                                        Редактор визитки
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="basic">Основное</TabsTrigger>
                                            <TabsTrigger value="social">Соц. сети</TabsTrigger>
                                            <TabsTrigger value="style">Стиль</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="basic" className="mt-4">
                                            <BasicInfoSection
                                                cardData={cardData}
                                                updateField={updateField}
                                            />
                                        </TabsContent>

                                        <TabsContent value="social" className="mt-4">
                                            <SocialLinksSection
                                                cardData={cardData}
                                                setCardData={setCardData}
                                            />
                                        </TabsContent>

                                        <TabsContent value="style" className="mt-4">
                                            <ThemeSection
                                                cardData={cardData}
                                                updateField={updateField}
                                            />
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>

                            {/* Export Section - для всех с сохраненной карточкой */}
                            {exportUrl && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Share2 className="h-5 w-5"/>
                                            Ваша ссылка
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={exportUrl}
                                                readOnly
                                                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
                                            />
                                            <Button variant="outline" size="icon" onClick={copyUrl}>
                                                <Copy className="h-4 w-4"/>
                                            </Button>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                                onClick={openPreview}
                                            >
                                                <Eye className="h-4 w-4 mr-2"/>
                                                Просмотр
                                            </Button>
                                            {isGuestMode && (
                                                <Button
                                                    variant="outline"
                                                    className="flex-1"
                                                    onClick={handleShortenUrl}
                                                    disabled={isShortening}
                                                >
                                                    <LinkIcon className="h-4 w-4 mr-2"/>
                                                    {isShortening ? 'Сокращение...' : 'Сократить'}
                                                </Button>
                                            )}
                                        </div>

                                        <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
                                            <Lightbulb className="h-3 w-3" />
                                            {isGuestMode
                                                ? 'Ссылка содержит все данные вашей визитки'
                                                : 'Короткая ссылка на вашу визитку'
                                            }
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Save Button */}
                            <SaveButton
                                onSave={saveCard}
                                isSaving={isSaving}
                                isEditMode={isEditMode}
                                disabled={!cardData.name}
                                className="w-full"
                            />
                        </div>

                        {/* Preview */}
                        <div className="lg:sticky lg:top-24 h-fit">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Eye className="h-5 w-5"/>
                                        Предпросмотр
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        className="relative overflow-hidden rounded-xl p-8 min-h-[500px] transition-all duration-300"
                                        style={applyThemeStyles(currentTheme)}
                                    >
                                        <div className="max-w-md mx-auto space-y-6">
                                            {/* Avatar */}
                                            {cardData.avatar && (
                                                <div className="flex justify-center">
                                                    <img
                                                        src={cardData.avatar}
                                                        alt={cardData.name || 'Avatar'}
                                                        className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-lg"
                                                    />
                                                </div>
                                            )}

                                            {/* Name & Title */}
                                            <div className="text-center space-y-2">
                                                <h2 className="text-2xl font-bold">
                                                    {cardData.name || 'Ваше имя'}
                                                </h2>
                                                {cardData.title && (
                                                    <p className="text-lg opacity-90">{cardData.title}</p>
                                                )}
                                            </div>

                                            {/* Description */}
                                            {cardData.description && (
                                                <p className="text-center opacity-80 text-sm">
                                                    {cardData.description}
                                                </p>
                                            )}

                                            {/* Contact Info */}
                                            <div className="space-y-2">
                                                {cardData.email && (
                                                    <div className="flex items-center justify-center gap-2 text-sm">
                                                        <Mail className="h-4 w-4 opacity-75" />
                                                        <span>{cardData.email}</span>
                                                    </div>
                                                )}
                                                {cardData.phone && (
                                                    <div className="flex items-center justify-center gap-2 text-sm">
                                                        <Phone className="h-4 w-4 opacity-75" />
                                                        <span>{cardData.phone}</span>
                                                    </div>
                                                )}
                                                {cardData.website && (
                                                    <div className="flex items-center justify-center gap-2 text-sm">
                                                        <GlobeIcon className="h-4 w-4 opacity-75" />
                                                        <span>{cardData.website}</span>
                                                    </div>
                                                )}
                                                {cardData.company && (
                                                    <div className="flex items-center justify-center gap-2 text-sm">
                                                        <Building className="h-4 w-4 opacity-75" />
                                                        <span>{cardData.company}</span>
                                                    </div>
                                                )}
                                                {cardData.location && (
                                                    <div className="flex items-center justify-center gap-2 text-sm">
                                                        <MapPin className="h-4 w-4 opacity-75" />
                                                        <span>{cardData.location}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Social Links */}
                                            {cardData.socials && cardData.socials.length > 0 && (
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
