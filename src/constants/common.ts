import {Infinity, BarChart3, Globe, Home, Info, Palette, Star, Zap} from "lucide-react";
import {Card, OAuthProvider} from "@/types";
import {SiGoogle, SiVk, SiDiscord, SiGithub} from 'react-icons/si';
import {SiMessengerMax} from "@/constants/icons.ts";

import {IconType} from 'react-icons';

export const NAVIGATION = [
    { name: 'Главная', href: '/', icon: Home },
    { name: 'О проекте', href: '/about', icon: Info },
    { name: 'Темы', href: '/themes', icon: Palette },
];

// card samples

export const CARD_SAMPLES: Partial<Card>[] = [
    {
        name: 'Анна Смирнова',
        title: 'UI/UX Designer',
        description: 'Создаю красивые и удобные интерфейсы',
        email: 'anna@example.com',
        company: 'Creative Studio',
        location: 'Москва',
        socials: [
            { platform: 'instagram', link: '@annacreative' },
        ]
    },
    {
        name: 'Дмитрий Петров',
        title: 'Frontend Developer',
        description: 'React & TypeScript энтузиаст',
        email: 'dmitry@example.com',
        phone: '+7 (999) 123-45-67',
        website: 'dmitry.dev',
        socials: [
            { platform: 'github', link: '@dmitry_dev' },
            { platform: 'linkedin', link: '@dmitrydev' },
        ]
    },
    {
        name: 'Елена Волкова',
        title: 'Product Manager',
        company: 'Tech Innovations',
        location: 'Санкт-Петербург',
        email: 'elena@example.com',
        socials: [
            { platform: 'linkedin', link: '@elena_manager' },
            { platform: 'telegram', link: '@ultra_manager' }
        ]
    },
    {
        name: 'Алексей Козлов',
        title: 'Digital Marketer',
        description: 'Помогаю бизнесу расти в интернете',
        email: 'alex@example.com',
        phone: '+7 (999) 987-65-43',
        company: 'Marketing Pro',
        socials: [
            { platform: 'telegram', link: '@alex_marketer' },
            { platform: 'instagram', link: '@alex_marketer' },
            { platform: 'youtube', link: '@alex_marketer' }
        ]
    },
    {
        name: 'Мария Соколова',
        title: 'Content Creator',
        description: 'Lifestyle & Travel блогер',
        website: 'maria-blog.com',
        location: 'Казань',
        socials: [
            { platform: 'instagram', link: '@maria_blog' },
            { platform: 'youtube', link: '@maria_blog' },
            { platform: 'tiktok', link: '@maria_blog' }
        ]
    },
    {
        name: 'Иван Морозов',
        title: 'Software Architect',
        description: 'Создаю масштабируемые системы',
        email: 'ivan@example.com',
        company: 'Enterprise Solutions',
        website: 'ivan-tech.dev',
        socials: [
            { platform: 'github', link: '@itech_dev' },
            { platform: 'linkedin', link: '@ivan_techdev' }
        ]
    },
    {
        name: 'София Лебедева',
        title: 'Photographer',
        description: 'Запечатлеваю моменты жизни',
        email: 'sofia@example.com',
        phone: '+7 (999) 555-44-33',
        location: 'Екатеринбург',
        socials: [
            { platform: 'instagram', link: '@sofia_photograph' },
        ]
    },
    {
        name: 'Максим Новиков',
        title: 'Business Consultant',
        company: 'Consulting Group',
        email: 'maxim@example.com',
        phone: '+7 (999) 111-22-33',
        location: 'Москва',
        socials: [
            { platform: 'linkedin', link: '@max_consult' },
            { platform: 'telegram', link: '@max_consult' },
        ]
    },
    {
        name: 'Ольга Кузнецова',
        title: 'HR Manager',
        description: 'Нахожу таланты для вашей команды',
        email: 'olga@example.com',
        company: 'Talent Hub',
        location: 'Новосибирск',
        socials: [
            { platform: 'linkedin', link: 'olgahr' },
            { platform: 'telegram', link: 'olgahr' },
        ]
    },
    {
        name: 'Артём Васильев',
        title: 'Game Developer',
        description: 'Unity & Unreal Engine',
        email: 'artem@example.com',
        website: 'artem-games.dev',
        socials: [
            { platform: 'github', link: '@artem_gamedev' },
            { platform: 'youtube', link: '@artem_gamedev' },
        ]
    },
    {
        name: 'Виктория Павлова',
        title: 'SEO Specialist',
        description: 'Вывожу сайты в топ поисковых систем',
        email: 'victoria@example.com',
        company: 'SEO Agency',
        phone: '+7 (999) 777-88-99',
        socials: [
            { platform: 'telegram', link: '@seo_vika' },
            { platform: 'linkedin', link: '@viktoria_seo' }
        ]
    },
    {
        name: 'Николай Орлов',
        title: 'Data Scientist',
        description: 'ML & AI решения для бизнеса',
        email: 'nikolay@example.com',
        company: 'AI Lab',
        location: 'Москва',
        socials: [
            { platform: 'github', link: '@orel_scientist' },
            { platform: 'linkedin', link: '@orel_datascience' },
        ]
    }
];

// about

// how-it works section
export const HOW_IT_WORKS = [
    {
        step: 1,
        title: 'Регистрация',
        text: 'Войдите через удобный OAuth-провайдер (Google, VK, Discord, GitHub, MAX)',
    },
    {
        step: 2,
        title: 'Создание визитки',
        text: 'Добавьте информацию о себе, выберите тему и социальные сети',
    },
    {
        step: 3,
        title: 'Получите короткую ссылку',
        text: 'Автоматически создается короткая ссылка linkoo.dev/yourname',
    },
    {
        step: 4,
        title: 'Делитесь',
        text: 'Отправляйте ссылку или показывайте QR-код',
    },
]

// plans

export const FREE_FEATURES = [
    { text: '1 визитка' },
    { text: 'Базовые темы' },
    { text: 'QR-код' },
    { text: 'Базовая статистика' },
];

export const PREMIUM_FEATURES = [
    {
        icon: Infinity,
        title: 'Неограниченные карточки',
        description: 'Создавайте сколько угодно цифровых визиток для разных целей',
    },
    {
        icon: Globe,
        title: 'Custom домены',
        description: 'Персональный поддомен: yourname.linkoo.dev',
    },
    {
        icon: BarChart3,
        title: 'Расширенная аналитика',
        description: 'Детальная статистика просмотров, географии и источников',
    },
    {
        icon: Zap,
        title: 'Приоритетная поддержка',
        description: 'Быстрые ответы на вопросы от команды Linkoo',
    },
    {
        icon: Star,
        title: 'Ранний доступ к новинкам',
        description: 'Первыми тестируйте новые функции и возможности',
    },
];


// qr-code
export const QR_SIZES = [
    {label: 'Маленький', value: 512},
    {label: 'Средний', value: 1024},
    {label: 'Большой', value: 2048},
];

export const DOT_TYPES = [
    {label: 'Квадраты', value: 'square'},
    {label: 'Точки', value: 'dots'},
    {label: 'Скругленные', value: 'rounded'},
    {label: 'Экстра', value: 'extra-rounded'},
    {label: 'Classy', value: 'classy'},
    {label: 'Classy Round', value: 'classy-rounded'},
] as const;

export const CORNER_SQUARE_TYPES = [
    {label: 'Квадрат', value: 'square'},
    {label: 'Точка', value: 'dot'},
    {label: 'Экстра', value: 'extra-rounded'},
] as const;

export const CORNER_DOT_TYPES = [
    {label: 'Квадрат', value: 'square'},
    {label: 'Точка', value: 'dot'},
] as const;

// oauth providers

export const PROVIDERS: Array<{
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
