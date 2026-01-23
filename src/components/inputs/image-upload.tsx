import {useState, useRef, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Upload, X, Link2, Loader2} from 'lucide-react';
import {uploadImage, validateImageUrl} from '@/lib/imageUpload';
import {useToast} from '@/components/ui/use-toast';
import './image-upload.css';

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const ImageUpload = ({value, onChange, className = ''}: ImageUploadProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlValue, setUrlValue] = useState('');
    const [isValidatingUrl, setIsValidatingUrl] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {toast} = useToast();

    // Сброс состояния загрузки изображения при смене value
    useEffect(() => {
        if (value) {
            setImageLoaded(false);
            // Небольшая задержка для плавности
            setTimeout(() => setImageLoaded(true), 50);
        } else {
            setImageLoaded(false);
        }
    }, [value]);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        try {
            const result = await uploadImage(file);
            onChange(result.displayUrl);

            toast({
                title: "✅ Изображение загружено!",
                description: `${result.filename} (${result.size}) через ${result.service}`,
            });
        } catch (error: any) {
            toast({
                title: "❌ Ошибка загрузки",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleUrlSubmit = async () => {
        if (!urlValue.trim()) return;

        setIsValidatingUrl(true);

        try {
            const isValid = await validateImageUrl(urlValue.trim());

            if (isValid) {
                onChange(urlValue.trim());
                setUrlValue('');
                setShowUrlInput(false);

                toast({
                    title: "✅ Ссылка добавлена!",
                    description: "Изображение загружено из ссылки",
                });
            } else {
                toast({
                    title: "❌ Неверная ссылка",
                    description: "Не удалось загрузить изображение по этой ссылке",
                    variant: "destructive",
                });
            }
        } finally {
            setIsValidatingUrl(false);
        }
    };

    const handleInputClick = (e: React.MouseEvent) => {
        if (isUploading) {
            return e.preventDefault();
        }

        fileInputRef.current?.click()
    }

    const removeImage = () => {
        setImageLoaded(false);
        // Небольшая задержка для анимации исчезновения
        setTimeout(() => {
            onChange('');
            setShowUrlInput(false);
            setUrlValue('');
        }, 200);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const event = {target: {files}} as React.ChangeEvent<HTMLInputElement>;
            handleFileSelect(event);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    return (
        <div className={`w-full space-y-3 ${className}`}>
            {/* Превью изображения */}
            {value && (
                <div className={`preview-container ${imageLoaded ? 'loaded' : ''}`}>
                    <div className="relative bg-gray-50 rounded-xl p-3 transition-all duration-300">
                        <div className="flex justify-center">
                            <div className="relative">
                                <img
                                    src={value}
                                    alt="Превью"
                                    className={`preview-image w-32 h-32 rounded-lg object-cover border-2 border-gray-200 transition-all duration-500 ${
                                        imageLoaded ? 'loaded' : ''
                                    }`}
                                    onLoad={() => setImageLoaded(true)}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/placeholder-avatar.png';
                                    }}
                                />
                                <button
                                    onClick={removeImage}
                                    className="remove-btn absolute -top-2 -right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 hover:scale-110"
                                    title="Удалить изображение"
                                >
                                    <X className="h-3 w-3"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Зона перетаскивания */}
            {!value && (
                <div
                    className={`drop-zone ${isDragOver ? 'drag-over' : ''} ${isUploading ? 'uploading' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={handleInputClick}
                >
                    {isUploading ? (
                        <>
                            <div className="upload-content flex flex-col items-center">
                                <Loader2 className="upload-spinner h-8 w-8 text-blue-500"/>
                                <p className="text-sm text-gray-600 mt-2">Загружаем изображение...</p>
                            </div>
                            <div className="upload-progress"></div>
                        </>
                    ) : (
                        <div className="upload-content flex flex-col items-center">
                            <Upload className="h-8 w-8 text-gray-400 transition-transform duration-200"/>
                            <p className="text-sm text-gray-600 mt-2">
                                <span className="text-blue-500 font-medium">Выберите файл</span> или перетащите сюда
                            </p>
                            <p className="text-xs text-gray-400 mt-1">До 10MB • JPG, PNG, GIF, WebP</p>
                        </div>
                    )}
                </div>
            )}

            {/* Кнопки действий */}
            <div className="w-full flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex-1 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin"/>
                            Загрузка...
                        </>
                    ) : (
                        <>
                            <Upload className="h-4 w-4 mr-2 transition-transform duration-200"/>
                            {value ? 'Заменить' : 'Выбрать файл'}
                        </>
                    )}
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    disabled={isUploading}
                    className={`shrink-0 transition-all duration-200 hover:scale-105 ${
                        showUrlInput ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                    title="Добавить по ссылке"
                >
                    <Link2 className="h-4 w-4 transition-transform duration-200"/>
                </Button>
            </div>

            {/* Ввод URL */}
            <div className={`url-input-container ${showUrlInput ? 'show' : ''}`}>
                <div className="w-full flex gap-2 items-center">
                    <Input
                        placeholder="https://example.com/image.jpg"
                        value={urlValue}
                        onChange={(e) => setUrlValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                        className="flex-1 transition-all duration-200 focus:scale-[1.01]"
                        disabled={isValidatingUrl}
                    />
                    <Button
                        onClick={handleUrlSubmit}
                        size="sm"
                        disabled={!urlValue.trim() || isValidatingUrl}
                        className="shrink-0 transition-all duration-200 hover:scale-105"
                    >
                        {isValidatingUrl ? <Loader2 className="h-4 w-4 animate-spin"/> : '✓'}
                    </Button>
                </div>
            </div>

            {/* Скрытый input для файлов */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
};

export default ImageUpload;
