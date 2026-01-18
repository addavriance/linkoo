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
import {Download, QrCode as QrCodeIcon, Palette, Upload, X} from 'lucide-react';

interface QRCodeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    url: string;
    cardName: string;
    avatar?: string;
}

const QR_SIZES = [
    {label: 'Маленький', value: 512},
    {label: 'Средний', value: 1024},
    {label: 'Большой', value: 2048},
];

const DOT_TYPES = [
    {label: 'Квадраты', value: 'square'},
    {label: 'Точки', value: 'dots'},
    {label: 'Скругленные', value: 'rounded'},
    {label: 'Экстра', value: 'extra-rounded'},
    {label: 'Classy', value: 'classy'},
    {label: 'Classy Round', value: 'classy-rounded'},
] as const;

const CORNER_SQUARE_TYPES = [
    {label: 'Квадрат', value: 'square'},
    {label: 'Точка', value: 'dot'},
    {label: 'Экстра', value: 'extra-rounded'},
] as const;

const CORNER_DOT_TYPES = [
    {label: 'Квадрат', value: 'square'},
    {label: 'Точка', value: 'dot'},
] as const;

export function QRCodeDialog({open, onOpenChange, url, cardName, avatar}: QRCodeDialogProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const qrCodeRef = useRef<QRCodeStyling | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [foregroundColor, setForegroundColor] = useState('#000000');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [size, setSize] = useState(1024);
    const [dotType, setDotType] = useState<'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded'>('rounded');
    const [cornerSquareType, setCornerSquareType] = useState<'square' | 'dot' | 'extra-rounded'>('extra-rounded');
    const [cornerDotType, setCornerDotType] = useState<'square' | 'dot'>('dot');
    const [margin, setMargin] = useState(10);
    const [logoImage, setLogoImage] = useState<string | undefined>(avatar);
    const [logoSize, setLogoSize] = useState(0.2);

    // Обновление логотипа при изменении аватара
    useEffect(() => {
        if (avatar) {
            setLogoImage(avatar);
        }
    }, [avatar]);

    // Генерация QR кода при открытии диалога
    useEffect(() => {
        if (!open) {
            // Cleanup when dialog closes
            if (qrCodeRef.current) {
                qrCodeRef.current = null;
            }
            return;
        }

        // Wait for dialog animation and DOM to be ready
        const timer = setTimeout(() => {
            if (containerRef.current && !qrCodeRef.current) {
                generateQRCode();
            }
        }, 100);

        return () => {
            clearTimeout(timer);
        };
    }, [open]);

    // Обновление QR кода при изменении параметров
    useEffect(() => {
        if (open && qrCodeRef.current) {
            updateQRCode();
        }
    }, [url, foregroundColor, backgroundColor, dotType, cornerSquareType, cornerDotType, margin, logoImage, logoSize]);

    const generateQRCode = () => {
        if (!containerRef.current) return;

        // Очищаем предыдущий QR код
        containerRef.current.innerHTML = '';

        qrCodeRef.current = new QRCodeStyling({
            width: 300, // Фиксированный размер для превью
            height: 300,
            data: url,
            margin: margin,
            qrOptions: {
                typeNumber: 0,
                mode: 'Byte',
                errorCorrectionLevel: 'H', // Высокий для логотипа
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

        qrCodeRef.current.append(containerRef.current);
    };

    const updateQRCode = () => {
        if (!qrCodeRef.current) return;

        qrCodeRef.current.update({
            data: url,
            margin: margin,
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
            imageOptions: {
                hideBackgroundDots: true,
                imageSize: logoSize,
                margin: 5,
            },
        });
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setLogoImage(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const downloadQRCode = async (format: 'png' | 'svg') => {
        if (!qrCodeRef.current) return;

        try {
            // Создаем временный QR код с нужным размером
            const tempQR = new QRCodeStyling({
                width: size,
                height: size,
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

            const fileName = `${cardName.replace(/\s+/g, '_')}_qr_code`;

            if (format === 'png') {
                const blob = await tempQR.getRawData('png');
                if (!blob) return;
                const url = URL.createObjectURL(blob);
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
                const url = URL.createObjectURL(blob);
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
                    <div className="lg:col-span-2 flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6">
                        <div
                            ref={containerRef}
                            className="bg-white p-4 rounded-lg shadow-md"
                        />
                        <p className="text-xs text-gray-500 mt-3 text-center break-all max-w-[300px]">
                            {url}
                        </p>
                    </div>

                    {/* Settings */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Цвета */}
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

                        {/* Размер для скачивания */}
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
                            <p className="text-xs text-gray-500">{size} × {size} px</p>
                        </div>

                        {/* Форма точек */}
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

                        {/* Форма углов */}
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

                        {/* Форма точек углов */}
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

                        {/* Логотип */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                                <Upload className="h-4 w-4"/>
                                Логотип в центре
                            </Label>
                            {logoImage ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                        <img src={logoImage} alt="Logo" className="h-10 w-10 object-contain"/>
                                        <span className="flex-1 text-sm text-gray-600">Логотип загружен</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={removeLogo}
                                        >
                                            <X className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                    <div>
                                        <Label htmlFor="logo-size">Размер логотипа: {Math.round(logoSize * 100)}%</Label>
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
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full"
                                    >
                                        <Upload className="h-4 w-4 mr-2"/>
                                        Загрузить логотип
                                    </Button>
                                    <p className="text-xs text-gray-500 mt-1">
                                        PNG, JPG, SVG (рекомендуется квадратное изображение)
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Отступ */}
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
