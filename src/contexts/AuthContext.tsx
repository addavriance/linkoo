import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {api} from '@/lib/api';
import type {User, OAuthProvider} from '@/types';
import {toast} from '@/lib/toast';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (provider: OAuthProvider) => Promise<void>;
    loginWithTokens: (accessToken: string, refreshToken: string, expiresIn: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user on mount
    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            if (api.isAuthenticated()) {
                const userData = await api.getCurrentUser();
                setUser(userData);
            }
        } catch (error) {
            console.error('Failed to load user:', error);
            api.clearTokens();
        } finally {
            setIsLoading(false);
        }
    };

    const handleOAuthCallback = async (
        accessToken: string,
        refreshToken: string,
        expiresIn: string
    ) => {
        const userData = await api.handleOAuthCallback(accessToken, refreshToken, expiresIn);
        setUser(userData);
    };

    const login = async (provider: OAuthProvider) => {
        let authUrl: string;
        switch (provider) {
            case 'google':
                authUrl = api.getGoogleAuthUrl();
                break;
            case 'vk':
                authUrl = api.getVkAuthUrl();
                break;
            case 'discord':
                authUrl = api.getDiscordAuthUrl();
                break;
            case 'github':
                authUrl = api.getGithubAuthUrl();
                break;
            default:
                throw new Error(`Unknown provider: ${provider}`);
        }

        try {
            const response = await fetch(authUrl, {
                method: 'GET',
                redirect: 'manual',
            });

            if (response.type === 'opaqueredirect' || (response.status >= 300 && response.status < 400)) {
                window.location.href = authUrl;
                return;
            }

            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.error?.message || `${provider.toUpperCase()} OAuth не настроен на сервере`;;

            toast.error(errorMessage);
        } catch (error) {
            console.error('OAuth error:', error);
            toast.error('Не удалось подключиться к сервису авторизации');
        }
    };

    const loginWithTokens = async (
        accessToken: string,
        refreshToken: string,
        expiresIn: string
    ) => {
        await handleOAuthCallback(accessToken, refreshToken, expiresIn);
    };

    const logout = async () => {
        try {
            await api.logout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setUser(null);
            api.clearTokens();
        }
    };

    const refreshUser = async () => {
        try {
            const userData = await api.getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error('Failed to refresh user:', error);
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithTokens,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
