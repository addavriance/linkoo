import {Smartphone, Tablet, Monitor, Download, Share2, Globe, Mail, Phone} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import type {PremiumAnalytics} from '@/types';

export const COUNTRY_NAMES: Record<string, string> = {
    RU: 'Россия', US: 'США', DE: 'Германия', GB: 'Великобритания', FR: 'Франция',
    UA: 'Украина', KZ: 'Казахстан', BY: 'Беларусь', TR: 'Турция', CN: 'Китай',
    IN: 'Индия', BR: 'Бразилия', PL: 'Польша', NL: 'Нидерланды', IT: 'Италия',
    ES: 'Испания', JP: 'Япония', CA: 'Канада', AU: 'Австралия', KG: 'Кыргызстан',
    UZ: 'Узбекистан', AZ: 'Азербайджан', GE: 'Грузия', AM: 'Армения', TJ: 'Таджикистан',
};

export const INTERACTION_LABELS: Record<string, string> = {
    social_click: 'Соцсеть',
    contact_save: 'Сохранение контакта',
    share: 'Поделиться',
    website_click: 'Сайт',
    email_click: 'Email',
    phone_click: 'Телефон',
};

export const DEVICE_ICONS: Record<string, LucideIcon> = {
    mobile: Smartphone,
    tablet: Tablet,
    desktop: Monitor,
};

export const DEVICE_LABELS: Record<string, string> = {
    mobile: 'Мобильные',
    tablet: 'Планшеты',
    desktop: 'Десктоп',
};

export const CHART_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export const DEVICE_COLORS: Record<string, string> = {
    mobile: '#6366f1',
    tablet: '#8b5cf6',
    desktop: '#06b6d4',
};

export const PERIODS: Array<{value: '7d' | '30d'; label: string}> = [
    {value: '7d', label: '7 дней'},
    {value: '30d', label: '30 дней'},
];

type InteractionKey = keyof Omit<PremiumAnalytics['interactionSummary'], 'socialClicks'>;

export const INTERACTION_STATS: Array<{
    label: string;
    key: InteractionKey;
    icon: LucideIcon;
    color: string;
}> = [
    {label: 'Сохранений',  key: 'contactSaves',   icon: Download, color: 'text-green-600 bg-green-100'},
    {label: 'Поделились',  key: 'shares',          icon: Share2,   color: 'text-blue-600 bg-blue-100'},
    {label: 'Сайт',        key: 'websiteClicks',   icon: Globe,    color: 'text-purple-600 bg-purple-100'},
    {label: 'Email',       key: 'emailClicks',     icon: Mail,     color: 'text-indigo-600 bg-indigo-100'},
    {label: 'Телефон',     key: 'phoneClicks',     icon: Phone,    color: 'text-cyan-600 bg-cyan-100'},
];