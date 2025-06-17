import {Link} from 'react-router-dom';
import {Heart, Github, Twitter, Coffee} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const links = {
        product: [
            {name: 'Создать визитку', href: '/editor'},
            {name: 'Темы', href: '/themes'},
            {name: 'Примеры', href: '#'},
        ],
        resources: [
            {name: 'Документация', href: '#'},
            {name: 'API', href: '#'},
            {name: 'Блог', href: '#'},
        ],
        company: [
            {name: 'О проекте', href: '#'},
            {name: 'Конфиденциальность', href: '#'},
            {name: 'Условия использования', href: '#'},
        ],
    };

    const socialLinks = [
        {
            name: 'GitHub',
            href: 'https://github.com/addavriance/linkoo',
            icon: Github,
        },
        {
            name: 'Twitter',
            href: 'https://twitter.com/linkoo_app',
            icon: Twitter,
        },
    ];

    return (
        <footer className="border-t border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                {/* Main footer content */}
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    {/* Brand section */}
                    <div className="xl:col-span-1">
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <div
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg">
                                L
                            </div>
                            <span className="text-xl font-bold text-gray-900">Linkoo</span>
                        </Link>
                        <p className="text-gray-600 max-w-xs">
                            Современная платформа для создания интерактивных цифровых визиток.
                            Делись контактами одним тапом.
                        </p>
                        <div className="mt-6 flex space-x-4">
                            {socialLinks.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <span className="sr-only">{item.name}</span>
                                        <Icon className="h-6 w-6"/>
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {/* Links sections */}
                    <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                                    Продукт
                                </h3>
                                <ul className="mt-4 space-y-3">
                                    {links.product.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                to={item.href}
                                                className="text-gray-600 hover:text-gray-900 transition-colors"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                                    Ресурсы
                                </h3>
                                <ul className="mt-4 space-y-3">
                                    {links.resources.map((item) => (
                                        <li key={item.name}>
                                            <a
                                                href={item.href}
                                                className="text-gray-600 hover:text-gray-900 transition-colors"
                                            >
                                                {item.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-1">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                                    Компания
                                </h3>
                                <ul className="mt-4 space-y-3">
                                    {links.company.map((item) => (
                                        <li key={item.name}>
                                            <a
                                                href={item.href}
                                                className="text-gray-600 hover:text-gray-900 transition-colors"
                                            >
                                                {item.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="mt-12 border-t border-gray-200 pt-8">
                    <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                        <p className="text-gray-600 text-sm">
                            © {currentYear} Linkoo. Все права защищены.
                        </p>

                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>Сделано с</span>
                            <Heart className="h-4 w-4 text-red-500"/>
                            <span>и</span>
                            <Coffee className="h-4 w-4 text-amber-600"/>
                            <span>для лучшего нетворкинга</span>
                        </div>
                    </div>
                </div>

                {/* Fun fact */}
                <div className="mt-8 text-center">
                    <div
                        className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 text-sm">
            <span className="text-gray-600">
              🌱 Каждая цифровая визитка спасает до 10 бумажных карточек
            </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
