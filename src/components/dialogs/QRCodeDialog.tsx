import {useState, useEffect, useRef} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {toast} from '@/lib/toast';
import QRCodeStyling from 'qr-code-styling';
import {Download, QrCode as QrCodeIcon, Palette, Lock, Sparkles} from 'lucide-react';
import {CORNER_DOT_TYPES, CORNER_SQUARE_TYPES, DOT_TYPES, QR_SIZES} from "@/constants";
import {useAuth} from '@/contexts/AuthContext';
import {useNavigate} from 'react-router-dom';
import {LINKOO_LOGO_URL} from '@/constants';

interface QRCodeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    url: string;
    cardName: string;
    avatar?: string;
}

function PremiumLock({children, onUpgrade}: { children: React.ReactNode; onUpgrade: () => void }) {
    return (
        <div className="relative">
            <div className="opacity-40 pointer-events-none select-none">
                {children}
            </div>
            <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 cursor-pointer rounded-lg bg-background/60 backdrop-blur-[1px] border wd:border-blue-200"
                onClick={onUpgrade}
            >
                <div className="flex items-center gap-1.5 wd:text-blue-700">
                    <Lock className="h-4 w-4"/>
                    <span className="text-sm font-medium">Premium</span>
                </div>
                <span className="text-xs wd:text-blue-600">Нажмите, чтобы открыть</span>
            </div>
        </div>
    );
}

export function QRCodeDialog({open, onOpenChange, url, cardName, avatar}: QRCodeDialogProps) {
    const {user} = useAuth();
    const navigate = useNavigate();
    const isPremium = user?.accountType === 'paid';

    const containerRef = useRef<HTMLDivElement>(null);
    const qrCodeRef = useRef<QRCodeStyling | null>(null);
    const currentElementRef = useRef<HTMLDivElement | null>(null);

    const [foregroundColor, setForegroundColor] = useState('#000000');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [size, setSize] = useState(1024);
    const [dotType, setDotType] = useState<'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded'>('rounded');
    const [cornerSquareType, setCornerSquareType] = useState<'square' | 'dot' | 'extra-rounded'>('extra-rounded');
    const [cornerDotType, setCornerDotType] = useState<'square' | 'dot'>('dot');
    const [margin, setMargin] = useState(10);
    const [logoImage, setLogoImage] = useState<string | undefined>(
        isPremium ? avatar : LINKOO_LOGO_URL
    );
    const [logoSize, setLogoSize] = useState(0.2);

    useEffect(() => {
        if (isPremium && avatar) {
            setLogoImage(avatar);
        }
    }, [avatar, isPremium]);

    useEffect(() => {
        if (!open) {
            if (qrCodeRef.current) {
                qrCodeRef.current = null;
            }
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
            currentElementRef.current = null;
            setLogoImage(isPremium ? avatar : LINKOO_LOGO_URL);
            return;
        }

        const timer = setTimeout(() => {
            if (containerRef.current && !qrCodeRef.current) {
                generateQRCode();
            }
        }, 100);

        return () => {
            clearTimeout(timer);
        };
    }, [open]);

    useEffect(() => {
        if (open && qrCodeRef.current) {
            updateQRCode();
        }
    }, [url, foregroundColor, backgroundColor, dotType, cornerSquareType, cornerDotType, margin, logoImage, logoSize]);

    const createQRCode = () => {
        return new QRCodeStyling({
            width: 300,
            height: 300,
            data: url,
            margin: margin,
            qrOptions: {
                typeNumber: 0,
                mode: 'Byte',
                errorCorrectionLevel: 'H',
            },
            imageOptions: {
                hideBackgroundDots: true,
                imageSize: logoSize,
                margin: 5,
            },
            dotsOptions: {
                type: dotType,
                color: foregroundColor,
            },
            backgroundOptions: {
                color: backgroundColor,
            },
            cornersSquareOptions: {
                type: cornerSquareType,
                color: foregroundColor,
            },
            cornersDotOptions: {
                type: cornerDotType,
                color: foregroundColor,
            },
            image: logoImage,
        });
    };

    const generateQRCode = () => {
        if (!containerRef.current) return;

        const tempContainer = document.createElement('div');

        qrCodeRef.current = createQRCode();
        qrCodeRef.current.append(tempContainer);

        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(tempContainer);
        currentElementRef.current = tempContainer;
    };

    const updateQRCode = async () => {
        if (!qrCodeRef.current || !containerRef.current) return;

        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.top = '1rem';
        tempContainer.style.left = '1rem';
        tempContainer.style.opacity = '0';
        tempContainer.style.width = '100%';

        const newQR = createQRCode();

        await newQR.append(tempContainer);

        const oldElement = currentElementRef.current;

        containerRef.current.appendChild(tempContainer);

        requestAnimationFrame(() => {
            tempContainer.style.transition = 'opacity 150ms ease-in-out';
            tempContainer.style.opacity = '1';

            setTimeout(() => {
                if (oldElement && oldElement.parentNode) {
                    oldElement.parentNode.removeChild(oldElement);
                }

                tempContainer.style.position = 'static';
            }, 150);
        });

        currentElementRef.current = tempContainer;
        qrCodeRef.current = newQR;
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isPremium) return;
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Выберите изображение');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setLogoImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const removeLogo = () => {
        if (!isPremium) return;
        setLogoImage(undefined);
    };

    const downloadQRCode = async (format: 'png' | 'svg') => {
        if (!qrCodeRef.current) return;

        try {
            const tempQR = createQRCode();

            const fileName = `${cardName.replace(/\s+/g, '_')}_qr_code`;

            if (format === 'png') {
                const blob = await tempQR.getRawData('png');
                if (!blob) return;
                const url = URL.createObjectURL(blob as Blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = `${fileName}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } else {
                const blob = await tempQR.getRawData('svg');
                if (!blob) return;
                const url = URL.createObjectURL(blob as Blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${fileName}.svg`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }

            toast.success('QR код скачан');
        } catch (error) {
            console.error('Failed to download QR code:', error);
            toast.error('Не удалось скачать QR код');
        }
    };

    const goToPremium = () => {
        onOpenChange(false);
        navigate('/premium');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <QrCodeIcon className="h-5 w-5"/>
                        QR код визитки
                    </DialogTitle>
                    <DialogDescription>
                        Настройте стиль QR кода и скачайте в нужном формате
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Preview */}
                    <div className="lg:col-span-2 flex flex-col items-center justify-center bg-muted rounded-lg p-6">
                        <div
                            ref={containerRef}
                            className="bg-background p-4 rounded-lg shadow-md relative"
                        />
                        <p className="text-xs text-muted-foreground mt-1 text-center break-all max-w-[300px]">
                            {url}
                        </p>
                    </div>

                    {/* Settings */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Цвета — доступно всем */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Palette className="h-4 w-4"/>
                                Цвета
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="fg-color" className="text-xs">
                                        Передний план
                                    </Label>
                                    <div className="flex gap-2 mt-1">
                                        <Input
                                            id="fg-color"
                                            type="color"
                                            value={foregroundColor}
                                            onChange={(e) => setForegroundColor(e.target.value)}
                                            className="h-9 w-14 p-1"
                                        />
                                        <Input
                                            type="text"
                                            value={foregroundColor}
                                            onChange={(e) => setForegroundColor(e.target.value)}
                                            className="flex-1 h-9 font-mono text-xs"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="bg-color" className="text-xs">
                                        Фон
                                    </Label>
                                    <div className="flex gap-2 mt-1">
                                        <Input
                                            id="bg-color"
                                            type="color"
                                            value={backgroundColor}
                                            onChange={(e) => setBackgroundColor(e.target.value)}
                                            className="h-9 w-14 p-1"
                                        />
                                        <Input
                                            type="text"
                                            value={backgroundColor}
                                            onChange={(e) => setBackgroundColor(e.target.value)}
                                            className="flex-1 h-9 font-mono text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Размер для скачивания — доступно всем */}
                        <div className="space-y-2">
                            <Label>Размер для скачивания</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {QR_SIZES.map((s) => (
                                    <Button
                                        key={s.value}
                                        variant={size === s.value ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setSize(s.value)}
                                    >
                                        {s.label}
                                    </Button>
                                ))}
                            </div>
                            <p className="text-xs text-muted-foreground">{size} × {size} px</p>
                        </div>

                        {/* Форма точек — только Premium */}
                        {isPremium ? (
                            <div className="space-y-2">
                                <Label>Форма точек</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {DOT_TYPES.map((type) => (
                                        <Button
                                            key={type.value}
                                            variant={dotType === type.value ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setDotType(type.value)}
                                        >
                                            {type.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <PremiumLock onUpgrade={goToPremium}>
                                <div className="space-y-2">
                                    <Label>Форма точек</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {DOT_TYPES.slice(0, 3).map((type) => (
                                            <Button key={type.value} variant="outline" size="sm">
                                                {type.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </PremiumLock>
                        )}

                        {/* Форма углов — только Premium */}
                        {isPremium ? (
                            <div className="space-y-2">
                                <Label>Форма углов</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {CORNER_SQUARE_TYPES.map((type) => (
                                        <Button
                                            key={type.value}
                                            variant={cornerSquareType === type.value ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setCornerSquareType(type.value)}
                                        >
                                            {type.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <PremiumLock onUpgrade={goToPremium}>
                                <div className="space-y-2">
                                    <Label>Форма углов</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {CORNER_SQUARE_TYPES.map((type) => (
                                            <Button key={type.value} variant="outline" size="sm">
                                                {type.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </PremiumLock>
                        )}

                        {/* Форма точек углов — только Premium */}
                        {isPremium && (
                            <div className="space-y-2">
                                <Label>Форма точек углов</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {CORNER_DOT_TYPES.map((type) => (
                                        <Button
                                            key={type.value}
                                            variant={cornerDotType === type.value ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setCornerDotType(type.value)}
                                        >
                                            {type.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Логотип */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                Логотип в центре
                                {!isPremium && <Lock className="h-3.5 w-3.5 text-blue-500"/>}
                            </Label>

                            {isPremium ? (
                                /* Premium: полный контроль над логотипом */
                                logoImage ? (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 p-2 bg-muted rounded">
                                            <img src={logoImage} alt="Logo" className="h-10 w-10 object-contain"/>
                                            <span className="flex-1 text-sm text-muted-foreground">Логотип загружен</span>
                                            <Button variant="ghost" size="sm" onClick={removeLogo}>
                                                Удалить
                                            </Button>
                                        </div>
                                        <div>
                                            <Label htmlFor="logo-size">Размер: {Math.round(logoSize * 100)}%</Label>
                                            <Input
                                                id="logo-size"
                                                type="range"
                                                min="0.1"
                                                max="0.4"
                                                step="0.05"
                                                value={logoSize}
                                                onChange={(e) => setLogoSize(parseFloat(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="hidden"
                                            id="logo-upload"
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => document.getElementById('logo-upload')?.click()}
                                            className="w-full"
                                        >
                                            Загрузить логотип
                                        </Button>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            PNG, JPG, SVG (рекомендуется квадратное изображение)
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            Без логотипа — чистый QR код
                                        </p>
                                    </div>
                                )
                            ) : (
                                /* Free: логотип Linkoo всегда, нельзя изменить */
                                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-border">
                                    <img src={LINKOO_LOGO_URL} alt="Linkoo" className="h-8 w-8 object-contain"/>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-muted-foreground">Логотип Linkoo</p>
                                        <p className="text-xs text-muted-foreground">Всегда отображается в центре QR</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={goToPremium}
                                        className="wd:(text-blue-600 border-blue-200 hover:bg-blue-50) shrink-0"
                                    >
                                        <Sparkles className="h-3.5 w-3.5 mr-1"/>
                                        Убрать
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Отступ — только Premium */}
                        {isPremium ? (
                            <div className="space-y-2">
                                <Label htmlFor="margin">Отступ: {margin} пикселей</Label>
                                <Input
                                    id="margin"
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={margin}
                                    onChange={(e) => setMargin(parseInt(e.target.value))}
                                />
                            </div>
                        ) : (
                            <PremiumLock onUpgrade={goToPremium}>
                                <div className="space-y-2">
                                    <Label>Отступ: {margin} пикселей</Label>
                                    <Input type="range" min="0" max="50" value={margin} readOnly/>
                                </div>
                            </PremiumLock>
                        )}

                        {/* Плашка о Premium для бесплатников */}
                        {!isPremium && (
                            <div
                                className="flex items-center gap-3 p-3 bg-gradient-to-r wd:(from-blue-50 to-blue-50 border border-blue-200) rounded-lg cursor-pointer"
                                onClick={goToPremium}
                            >
                                <Sparkles className="h-5 w-5 wd:text-blue-600 shrink-0"/>
                                <div>
                                    <p className="text-sm font-medium wd:text-blue-800">
                                        Полная кастомизация с Premium
                                    </p>
                                    <p className="text-xs wd:text-blue-600">
                                        Форма, отступы, свой логотип или чистый QR — от 299 ₽/мес
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Отмена
                    </Button>
                    <Button variant="outline" onClick={() => downloadQRCode('svg')}>
                        <Download className="h-4 w-4 mr-2"/>
                        Скачать SVG
                    </Button>
                    <Button onClick={() => downloadQRCode('png')}>
                        <Download className="h-4 w-4 mr-2"/>
                        Скачать PNG
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
