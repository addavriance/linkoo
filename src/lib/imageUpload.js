const FREEIMAGE_UPLOAD_URL = 'https://freeimage.host/json';
const FREEIMAGE_HOME_URL = 'https://freeimage.host/';
let AUTH_TOKEN = '01d5e6ba55efefbd9901ca05d7bb8fd5bf407ea4';

const TOKEN_STORAGE_KEY = 'freeimage_auth_token';

const fetchAuthToken = async (proxyIndex = 0) => {
    if (proxyIndex >= CORS_PROXIES.length) {
        console.error('Все прокси для получения токена недоступны');
        return null;
    }

    const baseHeaders = {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,es;q=0.6",
        "cache-control": "no-cache",
        "pragma": "no-cache",
        "priority": "u=0, i",
        "sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1"
    };

    try {
        console.log(`Получаем токен через прокси ${proxyIndex + 1}...`);

        const proxy = CORS_PROXIES[proxyIndex];
        let proxyUrl;

        if (proxy.needsEncoding) {
            proxyUrl = proxy.url + encodeURIComponent(FREEIMAGE_HOME_URL);
        } else {
            proxyUrl = proxy.url + FREEIMAGE_HOME_URL;
        }

        const headers = { ...baseHeaders, ...proxy.headers };

        const response = await fetch(proxyUrl, {
            headers,
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

export const uploadImageDirect = async (file, useNewToken = false) => {
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
        url: 'https://thingproxy.freeboard.io/fetch/',
        needsEncoding: false,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'http://localhost:3000/',
            'Origin': 'http://localhost:3000'
        }
    },
    {
        url: 'https://api.allorigins.win/raw?url=',
        needsEncoding: true,
        headers: {}
    },
    {
        url: 'https://cors-anywhere.herokuapp.com/',
        needsEncoding: false,
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    },
    {
        url: 'https://api.codetabs.com/v1/proxy?quest=',
        needsEncoding: false,
        headers: {}
    },
    {
        url: 'https://cors.bridged.cc/',
        needsEncoding: false,
        headers: {}
    },
    {
        url: 'https://yacdn.org/proxy/',
        needsEncoding: false,
        headers: {}
    },
];

export const uploadImageWithProxy = async (file, proxyIndex = 0, useNewToken = false) => {
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
            headers: proxy.headers,
            body: formData,
        });

        // Если ошибка 500 и мы еще не пробовали новый токен
        if (response.status === 500 && !useNewToken) {
            console.log('Ошибка 500, пробуем с новым токеном...');
            return uploadImageWithProxy(file, proxyIndex, true);
        }

        return await processResponse(response);

    } catch (error) {
        console.error(`Прокси ${proxyIndex} не работает:`, error);

        // Если ошибка 500 и мы еще не пробовали новый токен
        if (error.message.includes('500') && !useNewToken) {
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

export const uploadImageAsBase64 = async (file, useNewToken = false) => {
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

        // Конвертируем файл в base64
        const base64 = await fileToBase64(file);

        const payload = {
            source: base64,
            type: 'base64',
            action: 'upload',
            timestamp: Date.now().toString(),
            auth_token: currentToken,
        };

        const response = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(FREEIMAGE_UPLOAD_URL), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        // Если ошибка 500 и мы еще не пробовали новый токен
        if (response.status === 500 && !useNewToken) {
            console.log('Ошибка 500, пробуем с новым токеном...');
            return uploadImageAsBase64(file, true);
        }

        return await processResponse(response);

    } catch (error) {
        console.error('Ошибка загрузки base64:', error);

        // Если ошибка 500 и мы еще не пробовали новый токен
        if (error.message.includes('500') && !useNewToken) {
            console.log('Ошибка 500, пробуем с новым токеном...');
            return uploadImageAsBase64(file, true);
        }

        throw error;
    }
};

export const uploadImage = async (file, retryWithNewToken = false) => {
    const methods = [
        () => uploadImageDirect(file, retryWithNewToken),
        () => uploadImageWithProxy(file, 0, retryWithNewToken),
        () => uploadImageAsBase64(file, retryWithNewToken),
    ];

    let lastError = null;
    let has500Error = false;

    for (let i = 0; i < methods.length; i++) {
        try {
            console.log(`Пробуем метод ${i + 1}${retryWithNewToken ? ' (с новым токеном)' : ''}...`);
            return await methods[i]();
        } catch (error) {
            console.error(`Метод ${i + 1} не удался:`, error);
            lastError = error;

            // Проверяем на ошибку 500
            if (error.message.includes('500') || (error.response && error.response.status === 500)) {
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

export const validateImageUrl = (url) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;

        setTimeout(() => resolve(false), 5000);
    });
};
