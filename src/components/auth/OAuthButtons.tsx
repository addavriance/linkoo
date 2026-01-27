import React from 'react';
import {Button} from '@/components/ui/button';
import {useAuth} from '@/contexts/AuthContext';
import type {OAuthProvider} from '@/types';
import {SiGoogle, SiVk, SiDiscord, SiGithub} from 'react-icons/si';
import type {IconType} from 'react-icons';
import {SiMessengerMax} from "@/constants/icons.ts";

interface OAuthButtonsProps {
    className?: string;
    openMaxDialog: () => void;
}

export const OAuthButtons: React.FC<OAuthButtonsProps> = ({className = '', openMaxDialog}) => {
    const {login, isLoading} = useAuth();

    const providers: Array<{
        id: OAuthProvider;
        name: string;
        icon: IconType;
        color: string;
        description: string;
    }> = [
        {
            id: 'vk',
            name: 'VK',
            icon: SiVk,
            color: 'bg-[#0077FF] hover:bg-[#0066DD] text-white hover:shadow-lg hover:shadow-blue-500/30',
            description: 'Вход через ВКонтакте'
        },
        {
            id: 'max',
            name: 'MAX',
            icon: SiMessengerMax,
            color: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/30',
            description: 'Вход через MAX'
        },
        {
            id: 'google',
            name: 'Google',
            icon: SiGoogle,
            color: 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md',
            description: 'Быстрый вход через Gmail'
        },
        {
            id: 'discord',
            name: 'Discord',
            icon: SiDiscord,
            color: 'bg-[#5865F2] hover:bg-[#4752C4] text-white hover:shadow-lg hover:shadow-indigo-500/30',
            description: 'Вход через Discord'
        },
        {
            id: 'github',
            name: 'GitHub',
            icon: SiGithub,
            color: 'bg-[#24292e] hover:bg-[#1b1f23] text-white hover:shadow-lg hover:shadow-gray-800/30',
            description: 'Вход для разработчиков'
        },
    ];

    return (
        <div className={`space-y-3 ${className}`}>
            {providers.map((provider) => {
                const Icon = provider.icon;
                return (
                    <Button
                        key={provider.id}
                        onClick={() => provider.id !== 'max' ? login(provider.id) : openMaxDialog()}
                        disabled={isLoading}
                        className={`w-full ${provider.color} transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] h-14 text-base font-medium group relative overflow-hidden`}
                        variant="secondary"
                    >
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"/>
                        <Icon className="!h-6 !w-6 mr-1 relative z-10 transition-transform group-hover:scale-110"/>
                        <span className="relative z-10">{provider.name}</span>
                    </Button>
                );
            })}
        </div>
    );
};
