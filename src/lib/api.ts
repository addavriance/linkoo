import axios, {AxiosInstance, InternalAxiosRequestConfig} from 'axios';
import type {
    ApiResponse,
    AuthTokens,
    User,
    Card,
    ShortenedLink,
    PaymentStatus,
    PaymentCreation,
    PaymentResponse,
    PaymentMethod,
    SessionResponse,
    AdminStats,
    AdminCard,
    AdminLink,
    PaginatedResponse,
    AccountType,
    UserRole,
} from '@/types';
import {ClientTOTP} from "@addavriance/linkoo_shared";
import {getUserId} from "@/lib/userIdentity.ts";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
    private totp: ClientTOTP | null = null;
    private totpInitPromise: Promise<ClientTOTP> | null = null;

    private client: AxiosInstance;
    private accessToken: string | null = null;
    private refreshToken: string | null = null;
    private refreshPromise: Promise<AuthTokens | null> | null = null;
    private paymentCheckPromise: Promise<PaymentStatus | null> | null = null;
    private paymentCreatePromise: Promise<PaymentResponse> | null = null;

    private async getTotp(): Promise<ClientTOTP> {
        if (this.totp) return this.totp;
        if (!this.totpInitPromise) {
            this.totpInitPromise = getUserId().then(uid => {
                this.totp = new ClientTOTP(uid, { codeLength: 10 });
                return this.totp;
            });
        }
        return this.totpInitPromise;
    }

    constructor() {
        this.client = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.loadTokens();

        this.client.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                if (this.accessToken && config.headers) {
                    config.headers.Authorization = `Bearer ${this.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

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

    async handleOAuthCallback(accessToken: string, refreshToken: string, expiresIn: string): Promise<User> {
        this.saveTokens({
            accessToken,
            refreshToken,
            expiresIn: parseInt(expiresIn),
        });
        return this.getCurrentUser();
    }

    async refreshAccessToken(): Promise<AuthTokens | null> {
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        if (!this.refreshToken) return null;

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

    async updateProfile(data: { profile?: { name?: string } }): Promise<User> {
        const response = await this.client.patch<ApiResponse<User>>('/users/me', data);
        if (!response.data.success || !response.data.data) {
            throw new Error('Failed to update profile');
        }
        return response.data.data;
    }

    async uploadAvatar(file: File): Promise<string> {
        if (!file || file.size === 0) {
            throw new Error('Invalid file');
        }
        const formData = new FormData();
        formData.append('avatar', file);
        const response = await this.client.post<ApiResponse<{ avatar: string }>>(
            '/users/me/avatar',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        if (!response.data.success || !response.data.data) {
            throw new Error('Failed to upload avatar');
        }
        return response.data.data.avatar;
    }

    async uploadCardImage(file: File): Promise<string> {
        if (!file || file.size === 0) {
            throw new Error('Invalid file');
        }
        const formData = new FormData();
        formData.append('image', file);
        const response = await this.client.post<ApiResponse<{ url: string }>>(
            '/cards/upload-image',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        if (!response.data.success || !response.data.data) {
            throw new Error('Failed to upload image');
        }
        return response.data.data.url;
    }

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

    async getMyLinks(): Promise<ShortenedLink[]> {
        const response = await this.client.get<ApiResponse<ShortenedLink[]>>('/links');
        if (!response.data.success || !response.data.data) {
            throw new Error('Failed to get links');
        }
        return response.data.data;
    }

    async getLinkInfo(slug: string): Promise<ShortenedLink> {
        const response = await this.client.get<ApiResponse<ShortenedLink>>(`/links/${slug}`);
        if (!response.data.success || !response.data.data) {
            throw new Error('Link not found');
        }
        return response.data.data;
    }

    async getLinkByCardId(cardId: string): Promise<{ slug: string; createdAt: string } | null> {
        const response = await this.client.get<ApiResponse<{ link: { slug: string; createdAt: string } | null }>>(`/links/card/${cardId}`);
        if (!response.data.success || !response.data.data) {
            return null;
        }
        return response.data.data.link;
    }

    async createGuestCardLink(rawData: string): Promise<ShortenedLink> {
        const totp = await this.getTotp();
        const code_result = totp.generateCurrentCode();
        const userId = await getUserId();

        const response = await this.client.post<ApiResponse<ShortenedLink>>('/links', {
            targetType: 'url',
            rawData,
        },
        {
            headers: {
                'X-User-ID': userId,
                'X-TOTP-Code': code_result.code,
                'X-Timestamp': code_result.timestamp.toString(),
            }
        });
        if (!response.data.success || !response.data.data) {
            throw new Error('Failed to create guest card link');
        }
        return response.data.data;
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

    trackCardView(cardId: string): void {
        this.client.post(`/cards/${cardId}/view`).catch(() => {});
    }

    async getCardAnalytics(cardId: string, period: '7d' | '30d' = '30d'): Promise<any> {
        const response = await this.client.get<ApiResponse<any>>(`/analytics/${cardId}`, {params: {period}});
        if (!response.data.success || !response.data.data) {
            throw new Error('Failed to get analytics');
        }
        return response.data.data;
    }

    async trackCardEvent(cardId: string, type: string, platform?: string): Promise<void> {
        await this.client.post(`/analytics/${cardId}/event`, {type, platform}).catch(() => {});
    }

    async setCardSubdomain(cardId: string, subdomain: string): Promise<Card> {
        const response = await this.client.patch<ApiResponse<Card>>(`/cards/${cardId}/subdomain`, {subdomain});
        if (!response.data.success || !response.data.data) {
            throw new Error('Failed to set subdomain');
        }
        return response.data.data;
    }

    async deleteCardSubdomain(cardId: string): Promise<void> {
        await this.client.delete(`/cards/${cardId}/subdomain`);
    }

    async getCardBySubdomain(subdomain: string): Promise<Card> {
        const response = await this.client.get<ApiResponse<Card>>(`/subdomain/${subdomain}`);
        if (!response.data.success || !response.data.data) {
            throw new Error('Card not found');
        }
        return response.data.data;
    }

    async createPayment(data: PaymentCreation): Promise<PaymentResponse> {
        if (this.paymentCreatePromise) {
            return this.paymentCreatePromise;
        }

        this.paymentCreatePromise = (async () => {
            try {
                const response = await this.client.post<ApiResponse<PaymentResponse>>(
                    '/payments/create',
                    data
                );
                if (!response.data.success || !response.data.data) {
                    throw new Error('Failed to create payment');
                }
                return response.data.data;
            } finally {
                this.paymentCreatePromise = null;
            }
        })();

        return this.paymentCreatePromise;
    }

    async getPaymentStatus(paymentKey: string): Promise<PaymentStatus | null> {
        if (this.paymentCheckPromise) {
            return this.paymentCheckPromise;
        }

        this.paymentCheckPromise = (async () => {
            try {
                const response = await this.client.get<ApiResponse<PaymentStatus>>(
                    `/payments/${paymentKey}`
                );
                if (!response.data.success || !response.data.data) {
                    throw new Error('Failed to get payment status');
                }
                return response.data.data;
            } catch {
                return null;
            } finally {
                this.paymentCheckPromise = null;
            }
        })();

        return this.paymentCheckPromise;
    }

    async getPaymentMethods(): Promise<PaymentMethod[]> {
        const response = await this.client.get<ApiResponse<PaymentMethod[]>>('/payments/methods');
        if (!response.data.success || !response.data.data) {
            throw new Error('Failed to get payment methods');
        }
        return response.data.data;
    }

    async deletePaymentMethod(paymentMethodId: string): Promise<void> {
        await this.client.delete(`/payments/methods/${paymentMethodId}`);
    }

    async getPaymentHistory(): Promise<any[]> {
        const response = await this.client.get<ApiResponse<any[]>>('/payments/history');
        if (!response.data.success || !response.data.data) {
            throw new Error('Failed to get payment history');
        }
        return response.data.data;
    }

    async linkCard(): Promise<PaymentResponse> {
        const response = await this.client.post<ApiResponse<PaymentResponse>>('/payments/link-card');
        if (!response.data.success || !response.data.data) {
            throw new Error('Failed to link card');
        }
        return response.data.data;
    }

    async getSessions(): Promise<SessionResponse[]> {
        const response = await this.client.get<ApiResponse<SessionResponse[]>>('/auth/sessions');
        if (!response.data.success || !response.data.data) {
            throw new Error('Failed to active sessions');
        }

        return response.data.data;
    }

    async revokeSession(sessionId: string): Promise<void> {
        const response = await this.client.delete<ApiResponse>(`/auth/session/${sessionId}`);

        if (!response.data.success) {
            throw new Error('Failed to revoke session');
        }
    }

    async getAdminStats(): Promise<AdminStats> {
        const response = await this.client.get<ApiResponse<AdminStats>>('/admin/stats');
        if (!response.data.success || !response.data.data) throw new Error('Failed to get stats');
        return response.data.data;
    }

    async getAdminUsers(params: {
        page?: number; limit?: number; search?: string; role?: string; accountType?: string;
    }): Promise<PaginatedResponse<User>> {
        const response = await this.client.get<PaginatedResponse<User>>('/admin/users', {params});
        return response.data;
    }

    async updateAdminUser(id: string, data: {role?: UserRole; accountType?: AccountType; isActive?: boolean}): Promise<User> {
        const response = await this.client.patch<ApiResponse<User>>(`/admin/users/${id}`, data);
        if (!response.data.success || !response.data.data) throw new Error('Failed to update user');
        return response.data.data;
    }

    async getAdminCards(params: {
        page?: number; limit?: number; search?: string; userId?: string;
    }): Promise<PaginatedResponse<AdminCard>> {
        const response = await this.client.get<PaginatedResponse<AdminCard>>('/admin/cards', {params});
        return response.data;
    }

    async updateAdminCard(id: string, data: {isActive?: boolean}): Promise<AdminCard> {
        const response = await this.client.patch<ApiResponse<AdminCard>>(`/admin/cards/${id}`, data);
        if (!response.data.success || !response.data.data) throw new Error('Failed to update card');
        return response.data.data;
    }

    async getAdminLinks(params: {
        page?: number; limit?: number; search?: string; userId?: string;
    }): Promise<PaginatedResponse<AdminLink>> {
        const response = await this.client.get<PaginatedResponse<AdminLink>>('/admin/links', {params});
        return response.data;
    }

    async updateAdminLink(id: string, data: {isActive?: boolean}): Promise<AdminLink> {
        const response = await this.client.patch<ApiResponse<AdminLink>>(`/admin/links/${id}`, data);
        if (!response.data.success || !response.data.data) throw new Error('Failed to update link');
        return response.data.data;
    }

    /* WebSocket для MAX auth */
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

        const wsUrl = API_URL.replace(/^http/, 'ws') + '/auth/max';
        console.log('[MAX Auth] Подключение к WebSocket:', wsUrl);

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('[MAX Auth] WebSocket соединение установлено');
            ws.send(JSON.stringify({ userAgent }));
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                console.log('[MAX Auth] Получено сообщение:', message);
                onEvent(message.event, message.data);
            } catch (err) {
                console.error('[MAX Auth] Ошибка парсинга сообщения:', err);
            }
        };

        ws.onerror = (error) => {
            console.error('[MAX Auth] WebSocket ошибка:', error);
            onEvent('error', { message: 'Ошибка соединения' });
        };

        ws.onclose = (event) => {
            console.log('[MAX Auth] WebSocket соединение закрыто:', event.code, event.reason);
            if (event.code !== 1000) { // 1000 = normal closure
                onEvent('close', { message: 'Соединение закрыто' });
            }
        };

        return () => {
            console.log('[MAX Auth] Закрытие WebSocket соединения');
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close(1000, 'Client closed');
            }
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
