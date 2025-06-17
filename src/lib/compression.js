// Система сжатия данных для URL в Linkoo

// Сокращённые ключи для максимального сжатия
const COMPRESSION_MAP = {
    // Основная информация
    name: 'n',
    title: 't',
    description: 'd',
    email: 'e',
    phone: 'p',
    website: 'w',
    avatar: 'a',

    // Социальные сети (используем однобуквенные коды)
    socials: 's',
    telegram: 'tg',
    whatsapp: 'wa',
    instagram: 'ig',
    youtube: 'yt',
    linkedin: 'li',
    twitter: 'tw',
    facebook: 'fb',
    github: 'gh',
    tiktok: 'tk',
    discord: 'dc',
    vk: 'vk',
    custom: 'cu',

    // Тема и стиль
    theme: 'th',
    customTheme: 'ct',

    // Дополнительные поля
    company: 'co',
    location: 'lo',
    birthday: 'bd',
    skills: 'sk',
    languages: 'lg',
    portfolio: 'pf',
    resume: 'rs',
    calendar: 'cl',
    payment: 'py',

    // Настройки приватности
    showEmail: 'se',
    showPhone: 'sp',
    showLocation: 'sl',
};

// Обратная карта для распаковки
const DECOMPRESSION_MAP = Object.fromEntries(Object.entries(COMPRESSION_MAP).map(([key, value]) => [value, key]));

// Сжатие объекта данных
export const compressCardData = (data) => {
    try {
        const compressed = {};

        // Сжимаем основные поля
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                const compressedKey = COMPRESSION_MAP[key] || key;

                // Специальная обработка социальных сетей
                if (key === 'socials' && Array.isArray(value)) {
                    const compressedSocials = value
                        .filter(social => social.platform && social.link)
                        .map(social => ({
                            [COMPRESSION_MAP[social.platform] || social.platform]: social.link
                        }));

                    if (compressedSocials.length > 0) {
                        compressed[compressedKey] = compressedSocials;
                    }
                } else {
                    compressed[compressedKey] = value;
                }
            }
        });

        // Преобразуем в JSON и кодируем в base64
        const jsonString = JSON.stringify(compressed);
        const base64 = btoa(unescape(encodeURIComponent(jsonString)));

        // Дополнительное сжатие - убираем padding
        return base64.replace(/=/g, '');

    } catch (error) {
        console.error('Ошибка сжатия данных:', error);
        return null;
    }
};

// Распаковка данных из сжатого формата
export const decompressCardData = (compressedData) => {
    try {
        // Восстанавливаем padding для base64
        let base64 = compressedData;
        while (base64.length % 4) {
            base64 += '=';
        }

        // Декодируем из base64
        const jsonString = decodeURIComponent(escape(atob(base64)));
        const compressed = JSON.parse(jsonString);

        const decompressed = {};

        // Распаковываем поля
        Object.entries(compressed).forEach(([key, value]) => {
            const originalKey = DECOMPRESSION_MAP[key] || key;

            // Специальная обработка социальных сетей
            if (key === 's' && Array.isArray(value)) { // 's' = socials
                decompressed.socials = value.map(socialObj => {
                    const [[platform, link]] = Object.entries(socialObj);
                    return {
                        platform: DECOMPRESSION_MAP[platform] || platform, link: link
                    };
                });
            } else {
                decompressed[originalKey] = value;
            }
        });

        return decompressed;

    } catch (error) {
        console.error('Ошибка распаковки данных:', error);
        return {};
    }
};

// Генерация полного URL с данными
export const generateCardUrl = (cardData, baseUrl = window.location.origin) => {
    const compressed = compressCardData(cardData);
    if (!compressed) return null;

    const currentPath = window.location.pathname;
    const basePath = currentPath.endsWith('/') ? currentPath : currentPath + '/';

    return `${baseUrl}${basePath}?card=${compressed}`;
};

// Извлечение данных из URL
export const extractCardDataFromUrl = (url = window.location.href) => {
    try {
        const urlObj = new URL(url);
        const cardParam = urlObj.searchParams.get('card');

        if (!cardParam) {
            return null;
        }

        return decompressCardData(cardParam);

    } catch (error) {
        console.error('Ошибка извлечения данных из URL:', error);
        return null;
    }
};

// Проверка размера сжатых данных
export const getCompressedSize = (cardData) => {
    const compressed = compressCardData(cardData);
    return compressed ? compressed.length : 0;
};

// Сравнение размеров до и после сжатия
export const getCompressionStats = (cardData) => {
    const original = JSON.stringify(cardData);
    const compressed = compressCardData(cardData);

    if (!compressed) return null;

    const originalSize = original.length;
    const compressedSize = compressed.length;
    const ratio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

    return {
        originalSize, compressedSize, compressionRatio: ratio, savedBytes: originalSize - compressedSize,
    };
};

// Валидация сжатых данных
export const validateCompressedData = (compressedData) => {
    try {
        const decompressed = decompressCardData(compressedData);
        return decompressed && typeof decompressed === 'object';
    } catch {
        return false;
    }
};

// Оптимизация для экстремального сжатия
export const ultraCompress = (cardData) => {
    // Убираем все необязательные поля и пустые значения
    const essential = {};

    // Только самые важные поля
    const essentialFields = ['name', 'title', 'email', 'phone', 'socials', 'theme'];

    essentialFields.forEach(field => {
        if (cardData[field] && cardData[field] !== '') {
            essential[field] = cardData[field];
        }
    });

    // Сжимаем социальные сети до минимума
    if (essential.socials) {
        essential.socials = essential.socials
            .filter(s => s.platform && s.link)
            .slice(0, 5) // Максимум 5 соцсетей
            .map(s => ({
                platform: s.platform, link: s.link.replace(/^https?:\/\//, '') // Убираем протокол
            }));
    }

    return compressCardData(essential);
};

// Генерация QR-friendly URL (короткий)
export const generateQrUrl = (cardData, baseUrl = window.location.origin) => {
    const ultraCompressed = ultraCompress(cardData);
    if (!ultraCompressed) return null;

    return `${baseUrl}/?c=${ultraCompressed}`;
};

// Извлечение из QR URL
export const extractFromQrUrl = (url) => {
    try {
        const urlObj = new URL(url);
        const cardParam = urlObj.searchParams.get('c') || urlObj.searchParams.get('card');

        if (!cardParam) return null;

        const decompressed = decompressCardData(cardParam);

        // Восстанавливаем протоколы в социальных сетях
        if (decompressed.socials) {
            decompressed.socials = decompressed.socials.map(social => ({
                ...social, link: social.link.startsWith('http') ? social.link : `https://${social.link}`
            }));
        }

        return decompressed;

    } catch (error) {
        console.error('Ошибка извлечения QR данных:', error);
        return null;
    }
};

// Проверка лимитов URL (для разных браузеров)
export const checkUrlLimits = (url) => {
    const length = url.length;

    return {
        length, withinChrome: length < 2048,      // Chrome limit
        withinFirefox: length < 65536,    // Firefox limit
        withinSafari: length < 80000,     // Safari limit
        withinIE: length < 2083,          // IE limit (legacy)
        recommended: length < 2000,       // Рекомендуемый лимит
    };
};

// Сжатие для конкретного сервиса сокращения ссылок
export const prepareForShortener = (cardData) => {
    // Некоторые сервисы имеют лимиты на длину исходного URL
    const stats = getCompressionStats(cardData);

    if (stats && stats.compressedSize > 1800) {
        // Если слишком длинный, используем ультра-сжатие
        return ultraCompress(cardData);
    }

    return compressCardData(cardData);
};

// 🆕 НОВЫЕ ФУНКЦИИ ДЛЯ СОКРАЩЕНИЯ ССЫЛОК

// Сокращение ссылки с несколькими вариантами (убрана проверка длины)
export const shortenUrl = async (url) => {
    // Список сервисов для сокращения (с CORS-прокси)
    const services = [
        {
            name: 'TinyURL',
            url: `https://api.allorigins.win/get?url=${encodeURIComponent('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url))}`
        },
        {
            name: 'is.gd',
            url: `https://api.allorigins.win/get?url=${encodeURIComponent('https://is.gd/create.php?format=simple&url=' + encodeURIComponent(url))}`
        }
    ];

    // Пытаемся использовать разные сервисы
    for (const service of services) {
        try {
            const response = await fetch(service.url);
            if (response.ok) {
                const data = await response.json();
                const shortUrl = data.contents.trim();

                // Проверяем, что получили валидную ссылку (убрали проверку длины)
                if (shortUrl.startsWith('http')) {
                    return {
                        success: true,
                        shortUrl: shortUrl,
                        service: service.name
                    };
                }
            }
        } catch (error) {
            console.log(`Ошибка с ${service.name}:`, error);
            continue;
        }
    }

    // Если все сервисы не работают
    return {
        success: false,
        error: 'Не удалось сократить ссылку через автоматические сервисы',
        fallbackServices: [
            { name: 'TinyURL', url: 'https://tinyurl.com' },
            { name: 'Bit.ly', url: 'https://bit.ly' },
            { name: 'Is.gd', url: 'https://is.gd' }
        ]
    };
};

// Показ диалога с альтернативными способами сокращения
export const showShortenDialog = (url, onSuccess, onClose) => {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    dialog.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            text-align: center;
        ">
            <h3 style="margin-bottom: 20px; color: #333;">🔗 Сокращение ссылки</h3>
            <p style="margin-bottom: 20px; color: #666;">
                Автоматическое сокращение недоступно. Выберите один из способов:
            </p>
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <button onclick="window.open('https://tinyurl.com/app', '_blank')" 
                        style="padding: 12px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    📱 TinyURL.com - Открыть в новой вкладке
                </button>
                <button onclick="window.open('https://bit.ly', '_blank')" 
                        style="padding: 12px; background: #ff6b35; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    🔥 Bit.ly - Открыть в новой вкладке
                </button>
                <button onclick="window.open('https://is.gd', '_blank')" 
                        style="padding: 12px; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    ⚡ Is.gd - Открыть в новой вкладке
                </button>
                <button onclick="copyToClipboard('${url}'); document.body.removeChild(this.closest('div').parentElement)" 
                        style="padding: 12px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer;">
                    📋 Просто скопировать полную ссылку
                </button>
            </div>
            <button onclick="document.body.removeChild(this.closest('div').parentElement)" 
                    style="margin-top: 20px; padding: 8px 20px; background: #e9ecef; border: none; border-radius: 8px; cursor: pointer;">
                ✕ Закрыть
            </button>
        </div>
    `;

    // Функция копирования (если не определена глобально)
    window.copyToClipboard = window.copyToClipboard || function(text) {
        navigator.clipboard.writeText(text).then(() => {
            if (onSuccess) onSuccess('Ссылка скопирована!');
        }).catch(() => {
            // Fallback для старых браузеров
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            if (onSuccess) onSuccess('Ссылка скопирована!');
        });
    };

    document.body.appendChild(dialog);

    // Закрытие по клику вне диалога
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            document.body.removeChild(dialog);
            if (onClose) onClose();
        }
    });

    return dialog;
};
