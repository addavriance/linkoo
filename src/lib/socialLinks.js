// Конфигурация социальных платформ с префиксами
const socialPlatforms = {
    telegram: {
        name: 'Telegram',
        icon: '📱',
        prefix: 'https://t.me/',
        patterns: ['@', 't.me/', 'telegram.me/']
    },
    whatsapp: {
        name: 'WhatsApp',
        icon: '💬',
        prefix: 'https://wa.me/',
        patterns: ['+', 'wa.me/', 'whatsapp.com/']
    },
    instagram: {
        name: 'Instagram',
        icon: '📸',
        prefix: 'https://instagram.com/',
        patterns: ['@', 'instagram.com/', 'instagr.am/']
    },
    youtube: {
        name: 'YouTube',
        icon: '📺',
        prefix: 'https://youtube.com/',
        patterns: ['youtube.com/', 'youtu.be/', '@']
    },
    linkedin: {
        name: 'LinkedIn',
        icon: '💼',
        prefix: 'https://linkedin.com/in/',
        patterns: ['linkedin.com/', 'in/']
    },
    twitter: {
        name: 'Twitter/X',
        icon: '🐦',
        prefix: 'https://x.com/',
        patterns: ['@', 'x.com/', 'twitter.com/']
    },
    facebook: {
        name: 'Facebook',
        icon: '👥',
        prefix: 'https://facebook.com/',
        patterns: ['facebook.com/', 'fb.com/', 'fb.me/']
    },
    github: {
        name: 'GitHub',
        icon: '🔧',
        prefix: 'https://github.com/',
        patterns: ['github.com/', '@']
    },
    tiktok: {
        name: 'TikTok',
        icon: '🎵',
        prefix: 'https://tiktok.com/@',
        patterns: ['@', 'tiktok.com/', 'vm.tiktok.com/']
    },
    vk: {
        name: 'VKontakte',
        icon: '🔵',
        prefix: 'https://vk.com/',
        patterns: ['vk.com/', 'vkontakte.ru/']
    },
    discord: {
        name: 'Discord',
        icon: '🎮',
        prefix: 'https://discord.gg/',
        patterns: ['discord.gg/', 'discord.com/']
    },
    custom: {
        name: 'Другое',
        icon: '🔗',
        prefix: ''
    }
};

// Умная функция для обработки социальных ссылок
export const processSocialLink = (platform, input) => {
    if (!input || !platform || platform === 'custom') {
        return input; // Для кастомных ссылок возвращаем как есть
    }

    const platformConfig = socialPlatforms[platform];
    if (!platformConfig) return input;

    const cleanInput = input.trim();

    // Если уже полная ссылка - возвращаем как есть
    if (cleanInput.startsWith('http://') || cleanInput.startsWith('https://')) {
        return cleanInput;
    }

    // Специальная обработка для разных платформ
    switch (platform) {
        case 'telegram':
            // @addavriance -> https://t.me/addavriance
            // addavriance -> https://t.me/addavriance
            const telegramUsername = cleanInput.replace(/^@/, '');
            return `https://t.me/${telegramUsername}`;

        case 'whatsapp':
            // +79991234567 -> https://wa.me/79991234567
            // 79991234567 -> https://wa.me/79991234567
            const phoneNumber = cleanInput.replace(/[^\d]/g, ''); // Только цифры
            return `https://wa.me/${phoneNumber}`;

        case 'instagram':
            // @addavriance -> https://instagram.com/addavriance
            // addavriance -> https://instagram.com/addavriance
            const instagramUsername = cleanInput.replace(/^@/, '');
            return `https://instagram.com/${instagramUsername}`;

        case 'youtube':
            // @addavriance -> https://youtube.com/@addavriance
            // addavriance -> https://youtube.com/@addavriance
            // UCxxxxxxxxx -> https://youtube.com/channel/UCxxxxxxxxx
            if (cleanInput.startsWith('UC') && cleanInput.length === 24) {
                return `https://youtube.com/channel/${cleanInput}`;
            }
            const youtubeHandle = cleanInput.startsWith('@') ? cleanInput : `@${cleanInput}`;
            return `https://youtube.com/${youtubeHandle}`;

        case 'linkedin':
            // addavriance -> https://linkedin.com/in/addavriance
            const linkedinUsername = cleanInput.replace(/^@/, '');
            return `https://linkedin.com/in/${linkedinUsername}`;

        case 'twitter':
            // @addavriance -> https://x.com/addavriance
            // addavriance -> https://x.com/addavriance
            const twitterUsername = cleanInput.replace(/^@/, '');
            return `https://x.com/${twitterUsername}`;

        case 'facebook':
            // addavriance -> https://facebook.com/addavriance
            const facebookUsername = cleanInput.replace(/^@/, '');
            return `https://facebook.com/${facebookUsername}`;

        case 'github':
            // @addavriance -> https://github.com/addavriance
            // addavriance -> https://github.com/addavriance
            const githubUsername = cleanInput.replace(/^@/, '');
            return `https://github.com/${githubUsername}`;

        case 'tiktok':
            // @addavriance -> https://tiktok.com/@addavriance
            // addavriance -> https://tiktok.com/@addavriance
            const tiktokUsername = cleanInput.startsWith('@') ? cleanInput : `@${cleanInput}`;
            return `https://tiktok.com/${tiktokUsername}`;

        case 'vk':
            // addavriance -> https://vk.com/addavriance
            // id123456 -> https://vk.com/id123456
            const vkUsername = cleanInput.replace(/^@/, '');
            return `https://vk.com/${vkUsername}`;

        case 'discord':
            // abc123def -> https://discord.gg/abc123def
            return `https://discord.gg/${cleanInput}`;

        default:
            // Для неизвестных платформ просто добавляем префикс
            return `${platformConfig.prefix}${cleanInput.replace(/^@/, '')}`;
    }
};

// Умная функция открытия ссылок
export const openSocialLink = (platform, link) => {
    const processedUrl = processSocialLink(platform, link);

    // Валидация URL
    if (!processedUrl) {
        console.warn('Пустая ссылка');
        return;
    }

    // Открываем ссылку
    window.open(processedUrl, '_blank', 'noopener,noreferrer');
};

// Валидация ввода для разных платформ
export const validateSocialInput = (platform, input) => {
    if (!input || platform === 'custom') return true;

    const cleanInput = input.trim();

    switch (platform) {
        case 'whatsapp':
            // Проверяем что это похоже на номер телефона
            return /^[\d\s\+\-\(\)]+$/.test(cleanInput);

        case 'telegram':
        case 'instagram':
        case 'twitter':
        case 'github':
        case 'tiktok':
            // Проверяем username (буквы, цифры, подчеркивания)
            const username = cleanInput.replace(/^@/, '');
            return /^[a-zA-Z0-9_]+$/.test(username);

        case 'youtube':
            // YouTube handle или channel ID
            if (cleanInput.startsWith('UC') && cleanInput.length === 24) return true;
            const handle = cleanInput.replace(/^@/, '');
            return /^[a-zA-Z0-9_\-]+$/.test(handle);

        case 'linkedin':
            // LinkedIn профиль
            const linkedinId = cleanInput.replace(/^@/, '');
            return /^[a-zA-Z0-9\-]+$/.test(linkedinId);

        case 'discord':
            // Discord invite код
            return /^[a-zA-Z0-9]+$/.test(cleanInput);

        case 'vk':
            // VK id или username
            return /^(id)?\d+$/.test(cleanInput) || /^[a-zA-Z0-9_]+$/.test(cleanInput);

        default:
            return true;
    }
};

// Получение плейсхолдера для инпута
export const getSocialPlaceholder = (platform) => {
    const placeholders = {
        telegram: '@username или username',
        whatsapp: '+7 999 123-45-67',
        instagram: '@username или username',
        youtube: '@channel или UCxxxxxxxxx',
        linkedin: 'username',
        twitter: '@username или username',
        facebook: 'username или page',
        github: '@username или username',
        tiktok: '@username или username',
        vk: 'username или id123456',
        discord: 'invite код',
        custom: 'Полная ссылка'
    };

    return placeholders[platform] || 'username или ссылка';
};

// Экспорт всех функций
export {
    socialPlatforms,
    processSocialLink as default
};
