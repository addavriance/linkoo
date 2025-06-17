import LZString from 'lz-string';

const COMPRESSION_MAP = {
    name: 'n',
    title: 't',
    description: 'd',
    email: 'e',
    phone: 'p',
    website: 'w',
    avatar: 'a',

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

    theme: 'th',
    customTheme: 'ct',

    company: 'co',
    location: 'lo',
    birthday: 'bd',
    skills: 'sk',
    languages: 'lg',
    portfolio: 'pf',
    resume: 'rs',
    calendar: 'cl',
    payment: 'py',

    showEmail: 'se',
    showPhone: 'sp',
    showLocation: 'sl',
};

const DECOMPRESSION_MAP = Object.fromEntries(
    Object.entries(COMPRESSION_MAP).map(([key, value]) => [value, key])
);

const sanitizeData = (data) => {
    const sanitized = {};

    Object.entries(data).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
            return;
        }

        switch (key) {
            case 'phone':
                const cleanPhone = String(value).replace(/[^\d+]/g, '');
                if (cleanPhone.length >= 10 && cleanPhone.length <= 15) {
                    sanitized[key] = cleanPhone;
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(String(value))) {
                    sanitized[key] = String(value).toLowerCase().trim();
                }
                break;

            case 'website':
                let cleanUrl = String(value).trim();
                if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
                    cleanUrl = 'https://' + cleanUrl;
                }
                try {
                    new URL(cleanUrl);
                    sanitized[key] = cleanUrl;
                } catch {
                }
                break;

            case 'socials':
                if (Array.isArray(value)) {
                    const validSocials = value
                        .filter(social => social && social.platform && social.link)
                        .map(social => ({
                            platform: String(social.platform).trim(),
                            link: String(social.link).trim()
                        }))
                        .filter(social => social.platform && social.link);

                    if (validSocials.length > 0) {
                        sanitized[key] = validSocials;
                    }
                }
                break;

            case 'name':
            case 'title':
            case 'description':
            case 'company':
            case 'location':
                const cleanString = String(value).trim().replace(/\s+/g, ' ');
                if (cleanString.length > 0) {
                    sanitized[key] = cleanString;
                }
                break;

            default:
                const cleanValue = String(value).trim();
                if (cleanValue.length > 0) {
                    sanitized[key] = cleanValue;
                }
        }
    });

    return sanitized;
};

const compressCardData = (data) => {
    try {
        const sanitized = sanitizeData(data);

        if (Object.keys(sanitized).length === 0) {
            console.warn('Нет данных для сжатия');
            return null;
        }

        const compressed = {};

        Object.entries(sanitized).forEach(([key, value]) => {
            const compressedKey = COMPRESSION_MAP[key] || key;

            if (key === 'socials' && Array.isArray(value)) {
                const compressedSocials = value.map(social => ({
                    [COMPRESSION_MAP[social.platform] || social.platform]: social.link
                }));
                compressed[compressedKey] = compressedSocials;
            } else {
                compressed[compressedKey] = value;
            }
        });

        const jsonString = JSON.stringify(compressed);

        const lzCompressed = LZString.compressToEncodedURIComponent(jsonString);

        return lzCompressed;

    } catch (error) {
        console.error('Ошибка сжатия данных:', error);
        return null;
    }
};

const decompressCardData = (compressedData) => {
    try {
        if (!compressedData || typeof compressedData !== 'string') {
            return {};
        }

        const jsonString = LZString.decompressFromEncodedURIComponent(compressedData);

        if (!jsonString) {
            console.error('Не удалось распаковать данные');
            return {};
        }

        const compressed = JSON.parse(jsonString);
        const decompressed = {};

        Object.entries(compressed).forEach(([key, value]) => {
            const originalKey = DECOMPRESSION_MAP[key] || key;

            if (key === 's' && Array.isArray(value)) {
                decompressed.socials = value.map(socialObj => {
                    const [[platform, link]] = Object.entries(socialObj);
                    return {
                        platform: DECOMPRESSION_MAP[platform] || platform,
                        link: link
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

const getCompressionStats = (cardData) => {
    try {
        const sanitized = sanitizeData(cardData);
        const original = JSON.stringify(sanitized);
        const compressed = compressCardData(cardData);

        if (!compressed || !original) {
            return {
                originalSize: 0,
                compressedSize: 0,
                compressionRatio: '0.0',
                savedBytes: 0,
                method: 'LZ-string'
            };
        }

        const originalSize = original.length;
        const compressedSize = compressed.length;

        const ratio = originalSize > 0
            ? Math.max(0, ((originalSize - compressedSize) / originalSize * 100))
            : 0;

        return {
            originalSize,
            compressedSize,
            compressionRatio: ratio.toFixed(1),
            savedBytes: Math.max(0, originalSize - compressedSize),
        };
    } catch (error) {
        console.error('Ошибка подсчета статистики:', error);
        return {
            originalSize: 0,
            compressedSize: 0,
            compressionRatio: '0.0',
            savedBytes: 0
        };
    }
};

const generateCardUrl = (cardData, baseUrl = window.location.origin) => {
    const compressed = compressCardData(cardData);
    if (!compressed) return null;

    const isGitHubPages = window.location.hostname.includes('github.io');
    const basePath = isGitHubPages ? '/linkoo/' : '/';

    return `${baseUrl}${basePath}?card=${compressed}`;
};

const extractCardDataFromUrl = (url = window.location.href) => {
    try {
        const urlObj = new URL(url);
        const cardParam = urlObj.searchParams.get('card') || urlObj.searchParams.get('c');

        if (!cardParam) {
            return null;
        }

        return decompressCardData(cardParam);

    } catch (error) {
        console.error('Ошибка извлечения данных из URL:', error);
        return null;
    }
};

const validatePhone = (phone) => {
    if (!phone) return false;
    const cleaned = phone.replace(/[^\d+]/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15 && /^\+?[\d]+$/.test(cleaned);
};

const formatPhone = (phone) => {
    if (!phone) return '';

    const cleaned = phone.replace(/[^\d+]/g, '');

    if (cleaned.startsWith('8') && cleaned.length === 11) {
        return '+7' + cleaned.slice(1);
    }

    if (/^[79]\d{10}$/.test(cleaned)) {
        return '+7' + cleaned.slice(1);
    }

    if (cleaned.startsWith('+')) {
        return cleaned;
    }

    return cleaned;
};

const checkUrlLimits = (url) => {
    const length = url ? url.length : 0;

    return {
        length,
        withinChrome: length < 2048,
        withinFirefox: length < 65536,
        withinSafari: length < 80000,
        withinIE: length < 2083,
        recommended: length < 2000,
        status: length < 1000 ? 'excellent' :
            length < 2000 ? 'good' :
                length < 4000 ? 'warning' : 'critical'
    };
};

const ultraCompress = (cardData) => {
    const essential = {};

    if (cardData.name && cardData.name.trim()) {
        essential.name = cardData.name.trim().slice(0, 30);
    }

    if (cardData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cardData.email)) {
        essential.email = cardData.email.toLowerCase().trim();
    }

    if (cardData.phone && validatePhone(cardData.phone)) {
        essential.phone = formatPhone(cardData.phone);
    }

    if (cardData.socials && Array.isArray(cardData.socials)) {
        const validSocials = cardData.socials
            .filter(s => s.platform && s.link)
            .slice(0, 2).map(s => ({
                platform: s.platform,
                link: s.link.replace(/^https?:\/\//, '')
            }));

        if (validSocials.length > 0) {
            essential.socials = validSocials;
        }
    }

    return compressCardData(essential);
};


const shortenUrl = async (url) => {
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

    for (const service of services) {
        try {
            const response = await fetch(service.url);
            if (response.ok) {
                const data = await response.json();
                const shortUrl = data.contents.trim();

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

    return {
        success: false,
        error: 'Не удалось сократить ссылку через автоматические сервисы',
        fallbackServices: [
            {name: 'TinyURL', url: 'https://tinyurl.com'},
            {name: 'Bit.ly', url: 'https://bit.ly'},
            {name: 'Is.gd', url: 'https://is.gd'}
        ]
    };
};

const showShortenDialog = (url, onSuccess, onClose) => {
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
        backdrop-filter: blur(4px);
    `;

    dialog.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        ">
            <h3 style="margin-bottom: 20px; color: #333; font-size: 18px; font-weight: 600;">🔗 Сокращение ссылки</h3>
            <p style="margin-bottom: 20px; color: #666; font-size: 14px;">
                Автоматическое сокращение недоступно. Выберите один из способов:
            </p>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                <button onclick="window.open('https://tinyurl.com', '_blank')" 
                        style="padding: 12px 16px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
                    📱 TinyURL.com
                </button>
                <button onclick="window.open('https://bit.ly', '_blank')" 
                        style="padding: 12px 16px; background: #ff6b35; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
                    🔥 Bit.ly
                </button>
                <button onclick="window.open('https://is.gd', '_blank')" 
                        style="padding: 12px 16px; background: #28a745; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
                    ⚡ Is.gd
                </button>
                <button onclick="copyToClipboard('${url}'); document.body.removeChild(this.closest('div').parentElement)" 
                        style="padding: 12px 16px; background: #6c757d; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
                    📋 Скопировать полную ссылку
                </button>
            </div>
            <button onclick="document.body.removeChild(this.closest('div').parentElement)" 
                    style="margin-top: 20px; padding: 8px 20px; background: #e9ecef; color: #495057; border: none; border-radius: 8px; cursor: pointer;">
                ✕ Закрыть
            </button>
        </div>
    `;

    window.copyToClipboard = window.copyToClipboard || function (text) {
        navigator.clipboard.writeText(text).then(() => {
            if (onSuccess) onSuccess('Ссылка скопирована!');
        }).catch(() => {
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

    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            document.body.removeChild(dialog);
            if (onClose) onClose();
        }
    });

    return dialog;
};

export {
    validatePhone,
    formatPhone,
    sanitizeData,
    getCompressionStats,
    generateCardUrl,
    extractCardDataFromUrl,
    checkUrlLimits,
    ultraCompress,
    shortenUrl,
    showShortenDialog
};
