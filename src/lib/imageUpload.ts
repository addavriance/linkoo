import { api } from '@/lib/api';
import { IMAGE_MAX_BYTES, IMAGE_MAX_MB } from '@/constants';

export const uploadImage = async (file: File): Promise<{ displayUrl: string; filename: string; size: string; service: string }> => {
    if (file.size > IMAGE_MAX_BYTES) {
        throw new Error(`Файл слишком большой. Максимум ${IMAGE_MAX_MB}MB.`);
    }

    if (!file.type.startsWith('image/')) {
        throw new Error('Можно загружать только изображения.');
    }

    const url = await api.uploadCardImage(file);

    return {
        displayUrl: url,
        filename: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        service: 'Linkoo',
    };
};

export const validateImageUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
        setTimeout(() => resolve(false), 5000);
    });
};
