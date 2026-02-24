import {Smartphone, Tablet, Monitor, Download, Share2, Globe, Mail, Phone} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import type {PremiumAnalytics} from '@/types';

export const COUNTRY_NAMES: Record<string, string> = {
    // Европа
    RU: 'Россия',        UA: 'Украина',       BY: 'Беларусь',      PL: 'Польша',
    DE: 'Германия',      FR: 'Франция',        GB: 'Великобритания',IT: 'Италия',
    ES: 'Испания',       NL: 'Нидерланды',     SE: 'Швеция',        NO: 'Норвегия',
    FI: 'Финляндия',     DK: 'Дания',          CH: 'Швейцария',     AT: 'Австрия',
    BE: 'Бельгия',       CZ: 'Чехия',          SK: 'Словакия',      HU: 'Венгрия',
    RO: 'Румыния',       BG: 'Болгария',       HR: 'Хорватия',      RS: 'Сербия',
    SI: 'Словения',      LT: 'Литва',          LV: 'Латвия',        EE: 'Эстония',
    MD: 'Молдова',       MK: 'Македония',      BA: 'Босния',        ME: 'Черногория',
    AL: 'Албания',       GR: 'Греция',         PT: 'Португалия',    IE: 'Ирландия',
    IS: 'Исландия',      LU: 'Люксембург',     MT: 'Мальта',        CY: 'Кипр',
    // СНГ
    KZ: 'Казахстан',     UZ: 'Узбекистан',     AZ: 'Азербайджан',   GE: 'Грузия',
    AM: 'Армения',       TJ: 'Таджикистан',    KG: 'Кыргызстан',    TM: 'Туркменистан',
    // Азия
    TR: 'Турция',        CN: 'Китай',          JP: 'Япония',        KR: 'Южная Корея',
    IN: 'Индия',         PK: 'Пакистан',       BD: 'Бангладеш',     VN: 'Вьетнам',
    TH: 'Таиланд',       ID: 'Индонезия',      MY: 'Малайзия',      PH: 'Филиппины',
    SG: 'Сингапур',      HK: 'Гонконг',        TW: 'Тайвань',       MM: 'Мьянма',
    KH: 'Камбоджа',      LK: 'Шри-Ланка',      NP: 'Непал',         MN: 'Монголия',
    IL: 'Израиль',       SA: 'Саудовская Аравия', AE: 'ОАЭ',        QA: 'Катар',
    KW: 'Кувейт',        IQ: 'Ирак',           IR: 'Иран',          JO: 'Иордания',
    LB: 'Ливан',         SY: 'Сирия',          YE: 'Йемен',         OM: 'Оман',
    // Америка
    US: 'США',           CA: 'Канада',          MX: 'Мексика',       BR: 'Бразилия',
    AR: 'Аргентина',     CL: 'Чили',           CO: 'Колумбия',      PE: 'Перу',
    VE: 'Венесуэла',     EC: 'Эквадор',        BO: 'Боливия',       UY: 'Уругвай',
    PY: 'Парагвай',      CU: 'Куба',           GT: 'Гватемала',     DO: 'Доминикана',
    // Африка
    ZA: 'ЮАР',           NG: 'Нигерия',        EG: 'Египет',        MA: 'Марокко',
    DZ: 'Алжир',         TN: 'Тунис',          KE: 'Кения',         ET: 'Эфиопия',
    GH: 'Гана',          TZ: 'Танзания',        UG: 'Уганда',        CM: 'Камерун',
    // Океания
    AU: 'Австралия',     NZ: 'Новая Зеландия',
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