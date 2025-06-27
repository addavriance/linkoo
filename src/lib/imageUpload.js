const FREEIMAGE_UPLOAD_URL = 'https://freeimage.host/json';
const AUTH_TOKEN = '01d5e6ba55efefbd9901ca05d7bb8fd5bf407ea4';

export const uploadImageDirect = async (file) => {
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

        const response = await fetch(FREEIMAGE_UPLOAD_URL, {
            method: 'POST',
            body: formData,
            mode: 'cors', // Попробуем напрямую
        });

        return await processResponse(response);

    } catch (error) {
        console.error('Прямой запрос не удался:', error);
        throw error;
    }
};

const CORS_PROXIES = [
    'https://thingproxy.freeboard.io/fetch/',
    'https://cors.bridged.cc/',
    'https://yacdn.org/proxy/',
];

export const uploadImageWithProxy = async (file, proxyIndex = 0) => {
    if (file.size > 10 * 1024 * 1024) {
        throw new Error('Файл слишком большой. Максимум 10MB.');
    }

    if (!file.type.startsWith('image/')) {
        throw new Error('Можно загружать только изображения.');
    }

    if (proxyIndex >= CORS_PROXIES.length) {
        throw new Error('Все прокси недоступны');
    }

    try {
        const formData = new FormData();
        formData.append('source', file);
        formData.append('type', 'file');
        formData.append('action', 'upload');
        formData.append('timestamp', Date.now().toString());
        formData.append('auth_token', AUTH_TOKEN);

        const proxyUrl = CORS_PROXIES[proxyIndex] + FREEIMAGE_UPLOAD_URL;

        const response = await fetch(proxyUrl, {
            method: 'POST',
            body: formData,
        });

        return await processResponse(response);

    } catch (error) {
        console.error(`Прокси ${proxyIndex} не работает:`, error);

        // Пробуем следующий прокси
        if (proxyIndex < CORS_PROXIES.length - 1) {
            return uploadImageWithProxy(file, proxyIndex + 1);
        }
        throw error;
    }
};

export const uploadImageAsBase64 = async (file) => {
    if (file.size > 10 * 1024 * 1024) {
        throw new Error('Файл слишком большой. Максимум 10MB.');
    }

    if (!file.type.startsWith('image/')) {
        throw new Error('Можно загружать только изображения.');
    }

    try {
        const base64 = await fileToBase64(file);

        const payload = {
            source: base64,
            type: 'base64',
            action: 'upload',
            timestamp: Date.now().toString(),
            auth_token: AUTH_TOKEN,
        };

        const response = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(FREEIMAGE_UPLOAD_URL), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        return await processResponse(response);

    } catch (error) {
        console.error('Ошибка загрузки base64:', error);
        throw error;
    }
};

export const uploadImageViaBackend = async (file) => { // TODO: Когда-то потом...
    if (file.size > 10 * 1024 * 1024) {
        throw new Error('Файл слишком большой. Максимум 10MB.');
    }

    if (!file.type.startsWith('image/')) {
        throw new Error('Можно загружать только изображения.');
    }

    try {
        const formData = new FormData();
        formData.append('image', file);

        // Здесь должен быть ваш бэкенд endpoint
        const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData,
        });

        return await processResponse(response);

    } catch (error) {
        console.error('Ошибка загрузки через backend:', error);
        throw error;
    }
};

export const uploadImage = async (file) => {
    const methods = [
        () => uploadImageDirect(file),
        () => uploadImageWithProxy(file),
        () => uploadImageAsBase64(file),
    ];

    for (let i = 0; i < methods.length; i++) {
        try {
            console.log(`Пробуем метод ${i + 1}...`);
            return await methods[i]();
        } catch (error) {
            console.error(`Метод ${i + 1} не удался:`, error);
            if (i === methods.length - 1) {
                throw new Error('Все методы загрузки не удались');
            }
        }
    }
};

const processResponse = async (response) => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.status_code === 200 && data.success) {
        return {
            success: true,
            url: data.image.url,
            displayUrl: data.image.display_url,
            thumbUrl: data.image.thumb.url,
            viewerUrl: data.image.url_viewer,
            filename: data.image.filename,
            originalName: data.image.original_filename,
            size: data.image.size_formatted,
            dimensions: `${data.image.width}x${data.image.height}`,
            id: data.image.id_encoded,
            service: 'Freeimage.host'
        };
    } else {
        throw new Error(data.error?.message || 'Ошибка загрузки изображения');
    }
};

const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]); // Убираем data:image/...;base64,
        reader.onerror = error => reject(error);
    });
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
