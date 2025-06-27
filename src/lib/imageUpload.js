const FREEIMAGE_UPLOAD_URL = 'https://freeimage.host/json';
const CORS_PROXY = 'https://thingproxy.freeboard.io/fetch/';
const AUTH_TOKEN = '01d5e6ba55efefbd9901ca05d7bb8fd5bf407ea4';

export const uploadImage = async (file) => {
    if (file.size > 10 * 1024 * 1024) {
        throw new Error('Файл слишком большой. Максимум 10MB.');
    }

    if (!file.type.startsWith('image/')) {
        throw new Error('Можно загружать только изображения.');
    }

    try {
        const formData = new FormData();
        formData.append('source', file);
        formData.append('type', 'file');
        formData.append('action', 'upload');
        formData.append('timestamp', Date.now().toString());
        formData.append('auth_token', AUTH_TOKEN);

        // Используем thingproxy, вроде удобнее
        const response = await fetch(CORS_PROXY + FREEIMAGE_UPLOAD_URL, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status_code === 200 && data.success) {
            return {
                success: true,
                url: data.image.url,                    // https://iili.io/%image%.jpg
                displayUrl: data.image.display_url,     // Основной URL для показа
                thumbUrl: data.image.thumb.url,         // Миниатюра
                viewerUrl: data.image.url_viewer,       // Страница просмотра
                filename: data.image.filename,          // %image_name%.jpg
                originalName: data.image.original_filename,
                size: data.image.size_formatted,        // 15.1 KB
                dimensions: `${data.image.width}x${data.image.height}`,
                id: data.image.id_encoded,              // %image_name%
                service: 'Freeimage.host'
            };
        } else {
            throw new Error(data.error?.message || 'Ошибка загрузки изображения');
        }

    } catch (error) {
        console.error('Ошибка загрузки через thingproxy:', error);
        throw new Error('Не удалось загрузить изображение: ' + error.message);
    }
};

// Функция для проверки доступности изображения по URL
export const validateImageUrl = (url) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;

        setTimeout(() => resolve(false), 5000);
    });
};
