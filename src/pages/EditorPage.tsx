import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {
    User,
    Share2,
    Copy,
    Eye,
    Trash2,
    Link as LinkIcon,
    Lightbulb, LogIn
} from 'lucide-react';

import {useCardEditor} from '@/hooks/useCardEditor';
import {SaveButton} from '@/components/editor/SaveButton';
import {BasicInfoSection} from '@/components/editor/BasicInfoSection';
import {SocialLinksSection} from '@/components/editor/SocialLinksSection';
import {ThemeSection} from '@/components/editor/ThemeSection';
import {getThemeById} from '@/lib/themes';
import {shortenGuestCardUrl} from '@/lib/compression';
import {toast} from '@/lib/toast';
import {CardPreview} from '@/components/CardPreview';
import {useAuth} from "@/contexts/AuthContext.tsx";
import {useDialog} from "@/contexts/DialogContext.tsx";

const EditorPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('basic');
    const [isShortening, setIsShortening] = useState(false);
    const {isAuthenticated} = useAuth();
    const { openLoginDialog } = useDialog();


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
            const result = await shortenGuestCardUrl(exportUrl);
            if (result.success && result.shortUrl) {
                await navigator.clipboard.writeText(result.shortUrl);
                toast.success('Короткая ссылка скопирована');
            } else {
                toast.error(result.error || 'Не удалось создать короткую ссылку');
            }
        } catch (error) {
            toast.error('Ошибка создания короткой ссылки');
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
                        <h1 className="text-3xl font-bold">
                            {isEditMode ? 'Редактировать визитку' : 'Создать визитку'}
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Заполните информацию и создайте свою уникальную цифровую визитку
                        </p>
                    </div>

                    {!isAuthenticated && (
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
                                    <Button onClick={openLoginDialog} size="sm" variant="outline" className="border-blue-300">
                                        Войти
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Editor */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex justify-between">
                                        <div className="flex gap-2 items-center">
                                            <User className="h-5 w-5"/>
                                            Редактор визитки
                                        </div>
                                        {/* Actions */}
                                        <div className="flex justify-center gap-4">
                                            <Button variant="outline" onClick={clearForm}>
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </div>
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
                                    <CardPreview
                                        cardData={cardData}
                                        theme={currentTheme}
                                    />
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
