import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import type { OAuthProvider } from '@/types';
import { Search, FileText, MessageCircle, Github, LucideIcon } from 'lucide-react';

interface OAuthButtonsProps {
  className?: string;
}

export const OAuthButtons: React.FC<OAuthButtonsProps> = ({ className = '' }) => {
  const { login, isLoading } = useAuth();

  const providers: Array<{ id: OAuthProvider; name: string; icon: LucideIcon; color: string }> = [
    { id: 'google', name: 'Google', icon: Search, color: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300' },
    { id: 'vk', name: 'VK', icon: FileText, color: 'bg-[#0077FF] hover:bg-[#0066DD] text-white' },
    { id: 'discord', name: 'Discord', icon: MessageCircle, color: 'bg-[#5865F2] hover:bg-[#4752C4] text-white' },
    { id: 'github', name: 'GitHub', icon: Github, color: 'bg-[#24292e] hover:bg-[#1b1f23] text-white' },
  ];

  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {providers.map((provider) => {
        const Icon = provider.icon;
        return (
          <Button
            key={provider.id}
            onClick={() => login(provider.id)}
            disabled={isLoading}
            className={`${provider.color} transition-all duration-200`}
            variant="outline"
          >
            <Icon className="h-4 w-4 mr-2" />
            {provider.name}
          </Button>
        );
      })}
    </div>
  );
};
