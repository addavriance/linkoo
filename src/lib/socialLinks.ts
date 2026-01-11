import {
    FaInstagram,
    FaLinkedin,
    FaTelegram,
    FaWhatsapp,
    FaYoutube,
    FaTwitter,
    FaFacebook,
    FaGithub, FaTiktok, FaVk, FaDiscord, FaGlobe
} from "react-icons/fa";

export const socialPlatforms = {
    telegram: {
        name: 'Telegram',
        icon: FaTelegram,
        prefix: 'https://t.me/',
        patterns: ['@', 't.me/', 'telegram.me/']
    },
    whatsapp: {
        name: 'WhatsApp',
        icon: FaWhatsapp,
        prefix: 'https://wa.me/',
        patterns: ['+', 'wa.me/', 'whatsapp.com/']
    },
    instagram: {
        name: 'Instagram',
        icon: FaInstagram,
        prefix: 'https://instagram.com/',
        patterns: ['@', 'instagram.com/', 'instagr.am/']
    },
    youtube: {
        name: 'YouTube',
        icon: FaYoutube,
        prefix: 'https://youtube.com/',
        patterns: ['youtube.com/', 'youtu.be/', '@']
    },
    linkedin: {
        name: 'LinkedIn',
        icon: FaLinkedin,
        prefix: 'https://linkedin.com/in/',
        patterns: ['linkedin.com/', 'in/']
    },
    twitter: {
        name: 'Twitter/X',
        icon: FaTwitter,
        prefix: 'https://x.com/',
        patterns: ['@', 'x.com/', 'twitter.com/']
    },
    facebook: {
        name: 'Facebook',
        icon: FaFacebook,
        prefix: 'https://facebook.com/',
        patterns: ['facebook.com/', 'fb.com/', 'fb.me/']
    },
    github: {
        name: 'GitHub',
        icon: FaGithub,
        prefix: 'https://github.com/',
        patterns: ['github.com/', '@']
    },
    tiktok: {
        name: 'TikTok',
        icon: FaTiktok,
        prefix: 'https://tiktok.com/@',
        patterns: ['@', 'tiktok.com/', 'vm.tiktok.com/']
    },
    vk: {
        name: 'VKontakte',
        icon: FaVk,
        prefix: 'https://vk.com/',
        patterns: ['vk.com/', 'vkontakte.ru/']
    },
    discord: {
        name: 'Discord',
        icon: FaDiscord,
        prefix: 'https://discord.gg/',
        patterns: ['discord.gg/', 'discord.com/']
    },
    custom: {
        name: 'Другое',
        icon: FaGlobe,
        prefix: ''
    }
};

export const formatSocialLink = (social: any) => {
    const { platform, link } = social;
    const isHttp = link.startsWith('http');
    const atLink = link.startsWith('@') ? link : `@${link.replace('@', '')}`;

    if (platform === 'telegram' && !isHttp) return `@${link.replace('@', '')}`;
    if (platform === 'whatsapp' && !isHttp) return link;
    if (platform === 'instagram' && !isHttp) return `@${link.replace('@', '')}`;
    if (platform === 'youtube' && !isHttp) return atLink;
    if (platform === 'twitter' && !isHttp) return `@${link.replace('@', '')}`;
    if (platform === 'github' && !isHttp) return `@${link.replace('@', '')}`;
    if (platform === 'tiktok' && !isHttp) return atLink;
    return link;
}

export const processSocialLink = (platform: string, input: string): string => {
    if (!input || !platform || platform === 'custom') {
        return input; // Для кастомных ссылок возвращаем как есть
    }

    const platformConfig = (socialPlatforms as any)[platform];
    if (!platformConfig) return input;

    const cleanInput = input.trim();

    // Если уже полная ссылка - возвращаем как есть
    if (cleanInput.startsWith('http://') || cleanInput.startsWith('https://')) {
        return cleanInput;
    }

    // Специальная обработка для разных платформ
    switch (platform) {
        case 'telegram':
            // @username -> https://t.me/username
            // username -> https://t.me/username
            const telegramUsername = cleanInput.replace(/^@/, '');
            return `https://t.me/${telegramUsername}`;

        case 'whatsapp':
            // +79991234567 -> https://wa.me/79991234567
            // 79991234567 -> https://wa.me/79991234567
            const phoneNumber = cleanInput.replace(/[^\d]/g, ''); // Только цифры
            return `https://wa.me/${phoneNumber}`;

        case 'instagram':
            // @username -> https://instagram.com/username
            // username -> https://instagram.com/username
            const instagramUsername = cleanInput.replace(/^@/, '');
            return `https://instagram.com/${instagramUsername}`;

        case 'youtube':
            // @username -> https://youtube.com/@username
            // username -> https://youtube.com/@username
            // UCxxxxxxxxx -> https://youtube.com/channel/UCxxxxxxxxx
            if (cleanInput.startsWith('UC') && cleanInput.length === 24) {
                return `https://youtube.com/channel/${cleanInput}`;
            }
            const youtubeHandle = cleanInput.startsWith('@') ? cleanInput : `@${cleanInput}`;
            return `https://youtube.com/${youtubeHandle}`;

        case 'linkedin':
            // username -> https://linkedin.com/in/username
            const linkedinUsername = cleanInput.replace(/^@/, '');
            return `https://linkedin.com/in/${linkedinUsername}`;

        case 'twitter':
            // @username -> https://x.com/username
            // username -> https://x.com/username
            const twitterUsername = cleanInput.replace(/^@/, '');
            return `https://x.com/${twitterUsername}`;

        case 'facebook':
            // username -> https://facebook.com/username
            const facebookUsername = cleanInput.replace(/^@/, '');
            return `https://facebook.com/${facebookUsername}`;

        case 'github':
            // @username -> https://github.com/username
            // username -> https://github.com/username
            const githubUsername = cleanInput.replace(/^@/, '');
            return `https://github.com/${githubUsername}`;

        case 'tiktok':
            // @username -> https://tiktok.com/@username
            // username -> https://tiktok.com/@username
            const tiktokUsername = cleanInput.startsWith('@') ? cleanInput : `@${cleanInput}`;
            return `https://tiktok.com/${tiktokUsername}`;

        case 'vk':
            // username -> https://vk.com/username
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
export const openSocialLink = (platform: string, link: string): void => {
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
export const validateSocialInput = (platform: string, input: string): boolean => {
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
export const getSocialPlaceholder = (platform: string): string => {
    const placeholders: Record<string, string> = {
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
