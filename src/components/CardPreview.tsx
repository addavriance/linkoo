import React, { useState, useEffect } from 'react';
import {
    Mail,
    Phone,
    Globe as GlobeIcon,
    Building,
    MapPin,
    User as UserIcon
} from 'lucide-react';
import { applyThemeStyles, Theme } from '@/lib/themes';
import { socialPlatforms } from '@/lib/socialLinks';
import { FaGlobe } from 'react-icons/fa';
import { Card } from "@/types";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";

interface CardPreviewProps {
    cardData: Partial<Omit<Card, 'theme'>>;
    theme: Theme;
    className?: string;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
                                                            cardData,
                                                            theme,
                                                            className = ''
                                                        }) => {
    const [prevTheme, setPrevTheme] = useState<Theme>(theme);
    const [showNew, setShowNew] = useState(false);

    useEffect(() => {
        if (theme.id !== prevTheme.id) {
            setShowNew(true);
            const timer = setTimeout(() => {
                setPrevTheme(theme);
                setShowNew(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [theme, prevTheme.id]);

    const renderContent = () => (
        <div className="max-w-md mx-auto space-y-6">
            {/* Avatar */}
            {cardData.avatar ? (
                <div className="flex justify-center">
                    <img
                        src={cardData.avatar}
                        alt={cardData.name || 'Avatar'}
                        className="w-32 h-32 rounded-full object-cover border-4 border-white/20 shadow-lg"
                    />
                </div>
            ) : (
                <div className="w-32 h-32 rounded-full mx-auto mb-6 bg-white/20 flex items-center justify-center border-4 border-white/20 shadow-lg">
                    <UserIcon className="h-16 w-16" />
                </div>
            )}

            {/* Name & Title */}
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">
                    {cardData.name || 'Ваше имя'}
                </h2>
                {cardData.title && (
                    <p className="text-lg opacity-90">{cardData.title}</p>
                )}
            </div>

            {/* Description */}
            {cardData.description && (
                <p className="text-center opacity-80 text-sm">
                    {cardData.description}
                </p>
            )}

            {/* Contact Info */}
            <div className="space-y-2">
                {cardData.email && (
                    <div className="flex items-center justify-center gap-2 text-sm">
                        <Mail className="h-4 w-4 opacity-75" />
                        <span>{cardData.email}</span>
                    </div>
                )}
                {cardData.phone && (
                    <div className="flex items-center justify-center gap-2 text-sm">
                        <Phone className="h-4 w-4 opacity-75" />
                        <span>{cardData.phone}</span>
                    </div>
                )}
                {cardData.website && (
                    <div className="flex items-center justify-center gap-2 text-sm">
                        <GlobeIcon className="h-4 w-4 opacity-75" />
                        <span>{cardData.website}</span>
                    </div>
                )}
                {cardData.company && (
                    <div className="flex items-center justify-center gap-2 text-sm">
                        <Building className="h-4 w-4 opacity-75" />
                        <span>{cardData.company}</span>
                    </div>
                )}
                {cardData.location && (
                    <div className="flex items-center justify-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 opacity-75" />
                        <span>{cardData.location}</span>
                    </div>
                )}
            </div>

            {/* Social Links */}
            {cardData.socials && cardData.socials.length > 0 && (
                <div className="card-preview-socials">
                    {cardData.socials.slice(0, 6).map((social, index) => {
                        const Icon = socialPlatforms[social.platform]?.icon || FaGlobe;
                        return (
                            <Tooltip>
                                <TooltipTrigger>
                                <span
                                    key={index}
                                    className="card-preview-social-item block"
                                    // title={socialPlatforms[social.platform]?.name}
                                >
                                    <Icon />
                                </span>
                                </TooltipTrigger>
                                {social.link && (
                                    <TooltipContent>
                                        {social.link}
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        );
                    })}
                    {cardData.socials.length > 6 && (
                        <span
                            className="card-preview-social-item"
                            title={`+${cardData.socials.length - 6} еще`}
                        >
                            +{cardData.socials.length - 6}
                        </span>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <TooltipProvider>
            <div className={className}>
                <div className="relative overflow-hidden rounded-xl min-h-[500px]">
                    {/* Предыдущий фон */}
                    <div
                        className="absolute inset-0"
                        style={applyThemeStyles(prevTheme)}
                    />

                    <div
                        className="absolute inset-0 transition-opacity duration-500 ease-in-out"
                        style={{
                            ...applyThemeStyles(theme),
                            opacity: showNew ? 1 : 0
                        }}
                    />

                    <div
                        className="relative p-8 transition-colors duration-500 ease-in-out"
                        style={{ color: theme.textColor }}
                    >
                        {renderContent()}
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
};
