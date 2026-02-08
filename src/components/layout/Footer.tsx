import {Link} from 'react-router-dom';
import {Github} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const links = {
        product: [
            {name: 'Создать визитку', href: '/editor'},
            {name: 'Темы', href: '/themes'},
            {name: 'Примеры', href: '#'},
        ],
        resources: [
            {name: 'Документация', href: '/api'},
            {name: 'API', href: '/api'},
            {name: 'Блог', href: 'https://t.me/linkoo_app'},
        ],
        company: [
            {name: 'О проекте', href: '/about'},
            {name: 'Конфиденциальность', href: '/privacy'},
            {name: 'Условия использования', href: '/terms'},
        ],
    };

    const socialLinks = [
        {
            name: 'GitHub',
            href: 'https://github.com/addavriance/linkoo',
            icon: Github,
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
                                            {item.href.startsWith('http') ? (
                                                <a
                                                    href={item.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                                >
                                                    {item.name}
                                                </a>
                                            ) : (
                                                <Link
                                                    to={item.href}
                                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                                >
                                                    {item.name}
                                                </Link>
                                            )}
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
                                            {item.href.startsWith('#') ? (
                                                <a
                                                    href={item.href}
                                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                                >
                                                    {item.name}
                                                </a>
                                            ) : (
                                                <Link
                                                    to={item.href}
                                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                                >
                                                    {item.name}
                                                </Link>
                                            )}
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
                        <div className="flex flex-col items-center md:items-start space-y-2">
                            <p className="text-gray-600 text-sm">
                                © {currentYear} Linkoo. Все права защищены.
                            </p>
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <Link to="/privacy" className="hover:text-gray-900 transition-colors">
                                    Конфиденциальность
                                </Link>
                                <span>•</span>
                                <Link to="/terms" className="hover:text-gray-900 transition-colors">
                                    Условия использования
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
