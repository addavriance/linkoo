import React from 'react';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import PhoneInput from '@/components/inputs/phone-input';
import ImageUpload from '@/components/inputs/image-upload';
import type {Card} from '@/types';

interface BasicInfoSectionProps {
    cardData: Partial<Card>;
    updateField: <K extends keyof Card>(field: K, value: Card[K]) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
                                                                      cardData,
                                                                      updateField,
                                                                  }) => {
    return (
        <div className="space-y-4">
            {/* Avatar */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Фото профиля
                </label>
                <ImageUpload
                    value={cardData.avatar || ''}
                    onChange={(url: string) => updateField('avatar', url)}
                />
            </div>

            {/* Name & Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Имя *
                    </label>
                    <Input
                        placeholder="Иван Петров"
                        value={cardData.name || ''}
                        onChange={(e) => updateField('name', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Должность
                    </label>
                    <Input
                        placeholder="Frontend Developer"
                        value={cardData.title || ''}
                        onChange={(e) => updateField('title', e.target.value)}
                    />
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Описание
                </label>
                <Textarea
                    placeholder="Расскажите немного о себе..."
                    value={cardData.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Email
                    </label>
                    <Input
                        type="email"
                        placeholder="ivan@example.com"
                        value={cardData.email || ''}
                        onChange={(e) => updateField('email', e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Телефон
                    </label>
                    <PhoneInput
                        value={cardData.phone || ''}
                        onChange={(phone: string) => updateField('phone', phone)}
                        placeholder="+7 (999) 123-45-67"
                    />
                </div>
            </div>

            {/* Website & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Веб-сайт
                    </label>
                    <Input
                        type="url"
                        placeholder="https://example.com"
                        value={cardData.website || ''}
                        onChange={(e) => updateField('website', e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Компания
                    </label>
                    <Input
                        placeholder="Google Inc."
                        value={cardData.company || ''}
                        onChange={(e) => updateField('company', e.target.value)}
                    />
                </div>
            </div>

            {/* Location */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Местоположение
                </label>
                <Input
                    placeholder="Москва, Россия"
                    value={cardData.location || ''}
                    onChange={(e) => updateField('location', e.target.value)}
                />
            </div>
        </div>
    );
};
