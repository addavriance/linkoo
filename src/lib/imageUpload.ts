const FREEIMAGE_UPLOAD_URL = 'https://imgbb.com/json';
const FREEIMAGE_HOME_URL = 'https://imgbb.com/';
let AUTH_TOKEN = '74dde97a60260e7899e5ec94e413ceb8c85238dd';

const TOKEN_STORAGE_KEY = 'freeimage_auth_token';

const fetchAuthToken = async (proxyIndex = 0) => {
    if (proxyIndex >= CORS_PROXIES.length) {
        console.error('Все прокси для получения токена недоступны');
        return null;
    }

    try {
        console.log(`Получаем токен через прокси ${proxyIndex + 1}...`);

        const proxy = CORS_PROXIES[proxyIndex];
        let proxyUrl;

        if (proxy.needsEncoding) {
            proxyUrl = proxy.url + encodeURIComponent(FREEIMAGE_HOME_URL);
        } else {
            proxyUrl = proxy.url + FREEIMAGE_HOME_URL;
        }

        const response = await fetch(proxyUrl, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Ошибка запроса: ${response.status}`);
        }

        const html = await response.text();
        const match = html.match(/PF\.obj\.config\.auth_token\s*=\s*"([^"]+)"/);

        if (match && match[1]) {
            const newToken = match[1];
            console.log('Получен новый токен:', newToken.substring(0, 10) + '...');

            try {
                localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
            } catch (e) {
                console.warn('Не удалось сохранить токен в localStorage:', e);
            }

            return newToken;
        }

        throw new Error('Токен не найден в HTML');

    } catch (error) {
        console.error(`Прокси ${proxyIndex + 1} для токена не работает:`, error);

        return fetchAuthToken(proxyIndex + 1);
    }
};

const getAuthToken = async () => {
    try {
        const savedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (savedToken && savedToken !== AUTH_TOKEN) {
            console.log('Используем сохраненный токен');
            AUTH_TOKEN = savedToken;
            return savedToken;
        }
    } catch (e) {
        console.warn('Не удалось прочитать токен из localStorage:', e);
    }

    return AUTH_TOKEN;
};

export const uploadImageDirect = async (file: File, useNewToken = false): Promise<any> => {
    if (file.size > 10 * 1024 * 1024) {
        throw new Error('Файл слишком большой. Максимум 10MB.');
    }

    if (!file.type.startsWith('image/')) {
        throw new Error('Можно загружать только изображения.');
    }

    try {
        let currentToken = useNewToken ? await fetchAuthToken() : await getAuthToken();
        if (!currentToken) {
            throw new Error('Не удалось получить токен авторизации');
        }

        const formData = new FormData();
        formData.append('source', file);
        formData.append('type', 'file');
        formData.append('action', 'upload');
        formData.append('timestamp', Date.now().toString());
        formData.append('auth_token', currentToken);

        const response = await fetch(FREEIMAGE_UPLOAD_URL, {
            method: 'POST',
            body: formData,
            mode: 'cors',
        });

        if (response.status === 500 && !useNewToken) {
            console.log('Ошибка 500, пробуем с новым токеном...');
            return uploadImageDirect(file, true);
        }

        return await processResponse(response);

    } catch (error) {
        console.error('Прямой запрос не удался:', error);
        throw error;
    }
};

const CORS_PROXIES = [
    {
        url: 'https://image-uploader.linkoo.workers.dev/?',
        needsEncoding: false,
    },
];

export const uploadImageWithProxy = async (file: File, proxyIndex = 0, useNewToken = false): Promise<any> => {
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
        let currentToken = useNewToken ? await fetchAuthToken() : await getAuthToken();
        if (!currentToken) {
            throw new Error('Не удалось получить токен авторизации');
        }

        const formData = new FormData();
        formData.append('source', file);
        formData.append('type', 'file');
        formData.append('action', 'upload');
        formData.append('timestamp', Date.now().toString());
        formData.append('auth_token', currentToken);

        const proxy = CORS_PROXIES[proxyIndex];
        let proxyUrl;

        if (proxy.needsEncoding) {
            proxyUrl = proxy.url + encodeURIComponent(FREEIMAGE_UPLOAD_URL);
        } else {
            proxyUrl = proxy.url + FREEIMAGE_UPLOAD_URL;
        }

        const response = await fetch(proxyUrl, {
            method: 'POST',
            body: formData,
        });

        // Если ошибка 500 и мы еще не пробовали новый токен
        if (response.status === 500 && !useNewToken) {
            console.log('Ошибка 500, пробуем с новым токеном...');
            return uploadImageWithProxy(file, proxyIndex, true);
        }

        return await processResponse(response);

    } catch (error: any) {
        console.error(`Прокси ${proxyIndex} не работает:`, error);

        // Если ошибка 500 и мы еще не пробовали новый токен
        if (error.message?.includes('500') && !useNewToken) {
            console.log('Ошибка 500, пробуем с новым токеном...');
            return uploadImageWithProxy(file, proxyIndex, true);
        }

        // Пробуем следующий прокси только если это не повторная попытка с новым токеном
        if (proxyIndex < CORS_PROXIES.length - 1 && !useNewToken) {
            return uploadImageWithProxy(file, proxyIndex + 1, false);
        }
        throw error;
    }
};

export const uploadImage = async (file: File, retryWithNewToken = false): Promise<any> => {
    const methods = [
        () => uploadImageDirect(file, retryWithNewToken),
        () => uploadImageWithProxy(file, 0, retryWithNewToken),
    ];

    let lastError: any = null;
    let has500Error = false;

    for (let i = 0; i < methods.length; i++) {
        try {
            console.log(`Пробуем метод ${i + 1}${retryWithNewToken ? ' (с новым токеном)' : ''}...`);
            return await methods[i]();
        } catch (error: any) {
            console.error(`Метод ${i + 1} не удался:`, error);
            lastError = error;

            if (error.message?.includes('500') || (error.response && error.response.status === 500)) {
                has500Error = true;
            }
        }
    }

    // Если получили ошибку 500 и еще не пробовали с новым токеном
    if (has500Error && !retryWithNewToken) {
        console.log('Все методы вернули 500, пробуем с новым токеном...');
        try {
            // Принудительно получаем новый токен
            const newToken = await fetchAuthToken();
            if (newToken) {
                AUTH_TOKEN = newToken;
                return uploadImage(file, true);
            }
        } catch (tokenError) {
            console.error('Не удалось получить новый токен:', tokenError);
        }
    }

    throw new Error(`Все методы загрузки не удались. Последняя ошибка: ${lastError?.message || 'Неизвестная ошибка'}`);
};

const processResponse = async (response: Response) => {
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
            service: 'ImgBB'
        };
    } else {
        throw new Error(data.error?.message || 'Ошибка загрузки изображения');
    }
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
