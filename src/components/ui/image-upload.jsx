import {useState, useRef, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Upload, X, Link2, Loader2} from 'lucide-react';
import {uploadImage, validateImageUrl} from '@/lib/imageUpload';
import {useToast} from '@/components/ui/use-toast';

const ImageUpload = ({value, onChange, className = ''}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlValue, setUrlValue] = useState('');
    const [isValidatingUrl, setIsValidatingUrl] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);
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

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);

        try {
            const result = await uploadImage(file);
            onChange(result.displayUrl);

            toast({
                title: "✅ Изображение загружено!",
                description: `${result.filename} (${result.size}) через ${result.service}`,
            });
        } catch (error) {
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

    const removeImage = () => {
        setImageLoaded(false);
        // Небольшая задержка для анимации исчезновения
        setTimeout(() => {
            onChange('');
            setShowUrlInput(false);
            setUrlValue('');
        }, 200);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const event = {target: {files}};
            handleFileSelect(event);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
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
                                        e.target.src = '/placeholder-avatar.png';
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
                    onClick={() => fileInputRef.current?.click()}
                >
                    {isUploading ? (
                        <div className="upload-content flex flex-col items-center">
                            <Loader2 className="upload-spinner h-8 w-8 text-blue-500"/>
                            <p className="text-sm text-gray-600 mt-2">Загружаем изображение...</p>
                            <div className="upload-progress"></div>
                        </div>
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
                <div className="w-full flex gap-2">
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

            {/* Подсказка */}
            <p className="text-xs text-gray-500 text-center transition-opacity duration-200">
                Максимум 10MB. Поддерживаются JPG, PNG, GIF, WebP
            </p>

            {/* Скрытый input для файлов */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* CSS стили для плавных анимаций */}
            <style jsx>{`
                .preview-container {
                    opacity: 0;
                    transform: translateY(10px) scale(0.95);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .preview-container.loaded {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                
                .preview-image {
                    opacity: 0;
                    transform: scale(0.9);
                    filter: blur(4px);
                }
                
                .preview-image.loaded {
                    opacity: 1;
                    transform: scale(1);
                    filter: blur(0);
                }
                
                .remove-btn {
                    opacity: 0;
                    transform: scale(0.8);
                    transition: all 0.2s ease-out;
                }
                
                .preview-container:hover .remove-btn {
                    opacity: 1;
                    transform: scale(1);
                }
                
                .drop-zone {
                    width: 100%;
                    border: 2px dashed #d1d5db;
                    border-radius: 12px;
                    padding: 24px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    background: linear-gradient(45deg, transparent 0%, rgba(59, 130, 246, 0.02) 50%, transparent 100%);
                    position: relative;
                    overflow: hidden;
                }
                
                .drop-zone:hover {
                    border-color: #3b82f6;
                    background: linear-gradient(45deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.1) 50%, rgba(59, 130, 246, 0.05) 100%);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
                }
                
                .drop-zone.drag-over {
                    border-color: #2563eb;
                    background: rgba(59, 130, 246, 0.1);
                    transform: scale(1.02);
                    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.2);
                }
                
                .drop-zone.uploading {
                    border-color: #10b981;
                    background: linear-gradient(45deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.1) 50%, rgba(16, 185, 129, 0.05) 100%);
                }
                
                .upload-content {
                    transition: all 0.3s ease-out;
                }
                
                .drop-zone:hover .upload-content {
                    transform: translateY(-2px);
                }
                
                .upload-spinner {
                    animation: spin 1s linear infinite, pulse 2s ease-in-out infinite;
                }
                
                .upload-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    width: 100%;
                    background: linear-gradient(90deg, #10b981, #3b82f6);
                    animation: progress 2s ease-in-out infinite;
                }
                
                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(0%); }
                    100% { transform: translateX(100%); }
                }
                
                .url-input-container {
                    max-height: 0;
                    opacity: 0;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .url-input-container.show {
                    max-height: 60px;
                    opacity: 1;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
};

export default ImageUpload;
