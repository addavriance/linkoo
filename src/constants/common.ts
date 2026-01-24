import {Home, Info, Palette, Plus} from "lucide-react";
import {Card} from "@/types";

export const NAVIGATION = [
    { name: 'Главная', href: '/', icon: Home },
    { name: 'О проекте', href: '/about', icon: Info },
    { name: 'Создать', href: '/editor', icon: Plus },
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
        text: 'Войдите через удобный OAuth-провайдер (Google, VK, Discord, GitHub)',
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
        text: 'Отправляйте ссылку, показывайте QR-код или используйте NFC',
    },
]

// plans

export const FREE_PLAN_FEATURES = [
    { text: '1 визитка' },
    { text: 'Базовые темы' },
    { text: 'QR-код' },
    { text: 'Базовая статистика' },
];

export const PREMIUM_PLAN_FEATURES = [
    { text: 'Неограниченно визиток', strong: true },
    { text: 'Все темы и настройки' },
    { text: 'Пользовательские ссылки' },
    { text: 'Расширенная статистика' },
    { text: 'Приоритетная поддержка' },
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
