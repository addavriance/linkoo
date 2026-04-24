import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { cropImageToBlob } from '@/lib/cropImage';

interface Area {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface ImageCropModalProps {
    imageSrc: string;
    open: boolean;
    onClose: () => void;
    onCropped: (blob: Blob) => void;
    aspect?: number;
    circular?: boolean;
}

const ImageCropModal = ({
    imageSrc,
    open,
    onClose,
    onCropped,
    aspect = 1,
    circular = false,
}: ImageCropModalProps) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropComplete = useCallback((_: Area, pixelArea: Area) => {
        setCroppedAreaPixels(pixelArea);
    }, []);

    const handleConfirm = async () => {
        if (!croppedAreaPixels) return;
        setIsProcessing(true);
        try {
            const blob = await cropImageToBlob(imageSrc, croppedAreaPixels);
            onCropped(blob);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-[520px] p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-5 pb-0">
                    <DialogTitle>Обрезать изображение</DialogTitle>
                </DialogHeader>

                {/* Cropper area */}
                <div className="relative mx-6 mt-4 rounded-xl overflow-hidden bg-zinc-900" style={{ height: 320 }}>
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        cropShape={circular ? 'round' : 'rect'}
                        showGrid={!circular}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                        style={{
                            containerStyle: { borderRadius: 12 },
                            mediaStyle: {},
                            cropAreaStyle: circular
                                ? { border: '2px solid rgba(255,255,255,0.7)' }
                                : { border: '2px solid rgba(255,255,255,0.7)' },
                        }}
                    />
                </div>

                {/* Zoom control */}
                <div className="flex items-center gap-3 px-6 mt-4">
                    <ZoomOut className="h-4 w-4 text-muted-foreground shrink-0" />
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.05}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="flex-1 accent-blue-600"
                    />
                    <ZoomIn className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>

                <DialogFooter className="px-6 py-4 gap-2">
                    <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                        Отмена
                    </Button>
                    <Button onClick={handleConfirm} disabled={isProcessing}>
                        {isProcessing ? 'Обработка...' : 'Применить'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ImageCropModal;
