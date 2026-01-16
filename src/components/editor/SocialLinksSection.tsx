import React from 'react';
import {Button} from '@/components/ui/button';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Input} from '@/components/ui/input';
import {Plus, Trash2} from 'lucide-react';
import {getSocialPlaceholder, socialPlatforms} from '@/lib/socialLinks';
import type {Card, Social} from '@/types';

interface SocialLinksSectionProps {
    cardData: Partial<Card>;
    setCardData: React.Dispatch<React.SetStateAction<Partial<Card>>>;
}

export const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({
                                                                          cardData,
                                                                          setCardData,
                                                                      }) => {
    const addSocialLink = () => {
        setCardData(prev => ({
            ...prev,
            socials: [...(prev.socials || []), {platform: 'telegram', link: ''}],
        }));
    };

    const removeSocialLink = (index: number) => {
        setCardData(prev => ({
            ...prev,
            socials: (prev.socials || []).filter((_, i) => i !== index),
        }));
    };

    const updateSocialLink = (index: number, field: keyof Social, value: string) => {
        setCardData(prev => {
            const newSocials = [...(prev.socials || [])];
            newSocials[index] = {...newSocials[index], [field]: value};
            return {...prev, socials: newSocials};
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                    Социальные сети ({(cardData.socials || []).length}/12)
                </label>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={addSocialLink}
                    disabled={(cardData.socials || []).length >= 12}
                >
                    <Plus className="h-4 w-4 mr-2"/>
                    Добавить
                </Button>
            </div>

            {(cardData.socials || []).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>Нет добавленных социальных сетей</p>
                    <p className="text-sm mt-2">Нажмите "Добавить" чтобы начать</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {(cardData.socials || []).map((social, index) => (
                        <div
                            key={index}
                            className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg"
                        >
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <Select
                                    value={social.platform}
                                    onValueChange={(value) => updateSocialLink(index, 'platform', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(socialPlatforms).map(([key, platform]) => (
                                            <SelectItem key={key} value={key}>
                                                {platform.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Input
                                    placeholder={getSocialPlaceholder(social.platform)}
                                    value={social.link}
                                    onChange={(e) => updateSocialLink(index, 'link', e.target.value)}
                                />
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeSocialLink(index)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
