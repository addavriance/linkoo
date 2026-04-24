interface ShortenResult {
    success: boolean;
    shortUrl?: string;
    slug?: string;
    error?: string;
}

export const validatePhone = (phone: string): boolean => {
    if (!phone) return false;
    const cleaned = phone.replace(/[^\d+]/g, '');
    return cleaned.length >= 7 && cleaned.length <= 16 && /^\+?\d+$/.test(cleaned);
};

export const formatPhoneDisplay = (phone: string): string => {
    if (!phone) return '';
    const cleaned = phone.replace(/[^\d+]/g, '');

    const isRu =
        (cleaned.startsWith('+7') && cleaned.length === 12) ||
        (cleaned.startsWith('7') && cleaned.length === 11) ||
        (cleaned.startsWith('8') && cleaned.length === 11);

    if (isRu) {
        const digits = cleaned.replace(/^\+?[78]/, '');
        return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
    }

    return phone;
};

export const formatPhone = (phone: string): string => {
    if (!phone) return '';
    const cleaned = phone.replace(/[^\d+]/g, '');

    if (cleaned.startsWith('8') && cleaned.length === 11) return '+7' + cleaned.slice(1);
    if (/^[79]\d{10}$/.test(cleaned)) return '+7' + cleaned.slice(1);
    if (cleaned.startsWith('+')) return cleaned;
    return cleaned;
};

export const shortenGuestCardUrl = async (url: string): Promise<ShortenResult> => {
    try {
        const urlObj = new URL(url);
        const rawData = urlObj.searchParams.get('card') || urlObj.searchParams.get('c');

        if (!rawData) return { success: false, error: 'Не удалось извлечь данные из URL' };

        const { api } = await import('@/lib/api.ts');
        const link = await api.createGuestCardLink(rawData);

        const baseUrl = window.location.origin;
        return { success: true, shortUrl: `${baseUrl}/${link.slug}`, slug: link.slug };
    } catch (error: any) {
        return {
            success: false,
            error: error.response?.data?.message || error.message || 'Не удалось создать короткую ссылку',
        };
    }
};
