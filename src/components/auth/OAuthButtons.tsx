import React from 'react';
import {Button} from '@/components/ui/button';
import {useAuth} from '@/contexts/AuthContext';
import {PROVIDERS} from "@/constants";

interface OAuthButtonsProps {
    className?: string;
    openMaxDialog: () => void;
}

export const OAuthButtons: React.FC<OAuthButtonsProps> = ({className = '', openMaxDialog}) => {
    const {login, isLoading} = useAuth();

    return (
        <div className={`space-y-3 ${className}`}>
            {PROVIDERS.map((provider) => {
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
