import axios, {AxiosInstance, InternalAxiosRequestConfig} from 'axios';
import type {ApiResponse, AuthTokens, User, Card, ShortenedLink} from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
    private client: AxiosInstance;
    private accessToken: string | null = null;
    private refreshToken: string | null = null;
    private refreshPromise: Promise<AuthTokens | null> | null = null;

    constructor() {
        this.client = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Load tokens from localStorage
        this.loadTokens();

        // Request interceptor to add auth token
        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                if (this.accessToken && config.headers) {
                    config.headers.Authorization = `Bearer ${this.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor to handle token refresh
        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const tokens = await this.refreshAccessToken();
                        if (tokens && originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
                            return this.client(originalRequest);
                        }
                    } catch (refreshError) {
                        this.clearTokens();
                        window.location.href = '/';
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    // ============= Token Management =============
    private loadTokens() {
        this.accessToken = localStorage.getItem('accessToken');
        this.refreshToken = localStorage.getItem('refreshToken');
    }

    private saveTokens(tokens: AuthTokens) {
        this.accessToken = tokens.accessToken;
        this.refreshToken = tokens.refreshToken;
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('tokenExpiresAt', String(Date.now() + tokens.expiresIn * 1000));
    }

    clearTokens() {
        this.accessToken = null;
        this.refreshToken = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiresAt');
    }

    isAuthenticated(): boolean {
        return !!this.accessToken;
    }

    // ============= Auth API =============
    async handleOAuthCallback(accessToken: string, refreshToken: string, expiresIn: string): Promise<User> {
        this.saveTokens({
            accessToken,
            refreshToken,
            expiresIn: parseInt(expiresIn),
        });
        return this.getCurrentUser();
    }

    async refreshAccessToken(): Promise<AuthTokens | null> {
        // Если уже идет процесс обновления, возвращаем существующий promise
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        if (!this.refreshToken) return null;

        // Создаем promise для обновления токена
        this.refreshPromise = (async () => {
            try {
                const response = await axios.post<ApiResponse<AuthTokens>>(
                    `${API_URL}/auth/refresh`,
                    {refreshToken: this.refreshToken}
                );

                if (response.data.success && response.data.data) {
                    this.saveTokens(response.data.data);
                    return response.data.data;
                }
                return null;
            } catch (error) {
                console.error('Token refresh failed:', error);
                return null;
            } finally {
                this.refreshPromise = null;
            }
        })();

        return this.refreshPromise;
    }

    async getCurrentUser(): Promise<User> {
        const response = await this.client.get<ApiResponse<User>>('/auth/me');
        if (!response.data.success || !response.data.data) {
            throw new Error('Failed to get current user');
        }
        return response.data.data;
    }

    async logout(): Promise<void> {
        try {
            await this.client.post('/auth/logout', {refreshToken: this.refreshToken});
        } finally {
            this.clearTokens();
        }
    }

    async logoutAll(): Promise<void> {
        try {
            await this.client.post('/auth/logout-all');
        } finally {
            this.clearTokens();
        }
    }

    // ============= OAuth URLs =============
    getGoogleAuthUrl(): string {
        return `${API_URL}/auth/google`;
    }

    getVkAuthUrl(): string {
        return `${API_URL}/auth/vk`;
    }

    getDiscordAuthUrl(): string {
        return `${API_URL}/auth/discord`;
    }

    getGithubAuthUrl(): string {
        return `${API_URL}/auth/github`;
    }

    getMaxCallbackURL(sessionId: string) {
        return `${API_URL}/auth/max/callback?sessionId=${sessionId}`;
    }

    // ============= Cards API =============
    async getMyCards(): Promise<Card[]> {
        const response = await this.client.get<ApiResponse<Card[]>>('/cards');
        if (!response.data.success || !response.data.data) {
            throw new Error('Failed to get cards');
        }
        return response.data.data;
    }

    async getCard(cardId: string): Promise<Card> {
        const response = await this.client.get<ApiResponse<Card>>(`/cards/${cardId}`);
        if (!response.data.success || !response.data.data) {
            throw new Error('Failed to get card');
        }
        return response.data.data;
    }

    async createCard(cardData: Partial<Card>): Promise<Card> {
        const response = await this.client.post<ApiResponse<Card>>('/cards', cardData);
        if (!response.data.success || !response.data.data) {
            throw new Error('Failed to create card');
        }
        return response.data.data;
    }

    async updateCard(cardId: string, cardData: Partial<Card>): Promise<Card> {
        const response = await this.client.patch<ApiResponse<Card>>(`/cards/${cardId}`, cardData);
        if (!response.data.success || !response.data.data) {
            throw new Error('Failed to update card');
        }
        return response.data.data;
    }

    async deleteCard(cardId: string): Promise<void> {
        await this.client.delete(`/cards/${cardId}`);
    }

    // ============= Links API =============
    async createShortLink(originalUrl: string, customCode?: string): Promise<ShortenedLink> {
        const response = await this.client.post<ApiResponse<ShortenedLink>>('/links', {
            originalUrl,
            customCode,
        });
        if (!response.data.success || !response.data.data) {
            throw new Error('Failed to create short link');
        }
        return response.data.data;
    }

    async getMyLinks(): Promise<ShortenedLink[]> {
        const response = await this.client.get<ApiResponse<ShortenedLink[]>>('/links');
        if (!response.data.success || !response.data.data) {
            throw new Error('Failed to get links');
        }
        return response.data.data;
    }

    async deleteLink(linkId: string): Promise<void> {
        await this.client.delete(`/links/${linkId}`);
    }

    async getLinkInfo(slug: string): Promise<ShortenedLink> {
        const response = await this.client.get<ApiResponse<ShortenedLink>>(`/links/${slug}`);
        if (!response.data.success || !response.data.data) {
            throw new Error('Link not found');
        }
        return response.data.data;
    }

    async getLinkByCardId(cardId: string): Promise<{ slug: string; createdAt: string; clickCount: number } | null> {
        const response = await this.client.get<ApiResponse<{ link: { slug: string; createdAt: string; clickCount: number } | null }>>(`/links/card/${cardId}`);
        if (!response.data.success || !response.data.data) {
            return null;
        }
        return response.data.data.link;
    }

    async createCardLink(cardId: string, customSlug?: string): Promise<ShortenedLink> {
        const response = await this.client.post<ApiResponse<ShortenedLink>>('/links', {
            targetType: 'card',
            cardId,
            customSlug,
        });
        if (!response.data.success || !response.data.data) {
            throw new Error('Failed to create link');
        }
        return response.data.data;
    }

    async deleteCardLink(slug: string): Promise<void> {
        await this.client.delete(`/links/${slug}`);
    }

    /* fetch потому что axios не может в readable stream при POST запросе */
    async startMaxAuth(onEvent: (event: string, data: any) => void): Promise<() => void> {
        const userAgent = {
            deviceType: 'WEB',
            locale: navigator.language,
            deviceLocale: navigator.language.split('-')[0],
            osVersion: getOS(),
            deviceName: getBrowser(),
            headerUserAgent: navigator.userAgent,
            appVersion: '26.2.1',
            screen: `${window.screen.width}x${window.screen.height} ${window.devicePixelRatio}x`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (this.accessToken) {
            headers['Authorization'] = `Bearer ${this.accessToken}`;
        }

        const controller = new AbortController();

        const response = await fetch(`${API_URL}/auth/max`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ userAgent }),
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error('Ошибка подключения к серверу');
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('Не удалось получить поток данных');

        const decoder = new TextDecoder();
        let buffer = '';
        let isReading = true;

        const readStream = async () => {
            while (isReading) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                let boundary;
                while ((boundary = buffer.search(/\r?\n\r?\n/)) !== -1) {
                    const rawEvent = buffer.slice(0, boundary);
                    buffer = buffer.slice(boundary + 2);

                    const eventMatch = rawEvent.match(/^event:\s*(.+)$/m);
                    const dataMatches = [...rawEvent.matchAll(/^data:\s*(.+)$/gm)];

                    if (eventMatch && dataMatches.length) {
                        const event = eventMatch[1];
                        const dataStr = dataMatches.map(m => m[1]).join('');
                        try {
                            const data = JSON.parse(dataStr);
                            onEvent(event, data);
                        } catch (err) {
                            console.error('SSE parse error:', err, 'data:', dataStr);
                        }
                    }
                }
            }
        };

        readStream();

        return () => {
            isReading = false;
            controller.abort();
        };
    }
}

function getOS(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Win')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
}

function getBrowser(): string {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
}

export const api = new ApiClient();
