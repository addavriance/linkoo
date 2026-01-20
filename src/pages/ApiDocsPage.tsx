import {Card} from '@/components/ui/card';
import {Link} from 'react-router-dom';
import {Code, Lock, Zap, Database, Shield, ArrowRight} from 'lucide-react';
import {useState} from 'react';

export default function ApiDocsPage() {
    const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);

    const apiSections = [
        {
            title: 'Аутентификация',
            icon: Lock,
            color: 'blue',
            endpoints: [
                {
                    method: 'GET',
                    path: '/api/auth/google',
                    description: 'Инициирует OAuth авторизацию через Google',
                    auth: false,
                    response: 'Redirect to Google OAuth',
                },
                {
                    method: 'GET',
                    path: '/api/auth/vk',
                    description: 'Инициирует OAuth авторизацию через VK',
                    auth: false,
                    response: 'Redirect to VK OAuth',
                },
                {
                    method: 'GET',
                    path: '/api/auth/discord',
                    description: 'Инициирует OAuth авторизацию через Discord',
                    auth: false,
                    response: 'Redirect to Discord OAuth',
                },
                {
                    method: 'GET',
                    path: '/api/auth/github',
                    description: 'Инициирует OAuth авторизацию через GitHub',
                    auth: false,
                    response: 'Redirect to GitHub OAuth',
                },
                {
                    method: 'POST',
                    path: '/api/auth/refresh',
                    description: 'Обновляет access token используя refresh token',
                    auth: false,
                    body: {refreshToken: 'string'},
                    response: {
                        success: true,
                        data: {
                            accessToken: 'string',
                            refreshToken: 'string',
                            expiresIn: 3600,
                        },
                    },
                },
                {
                    method: 'GET',
                    path: '/api/auth/me',
                    description: 'Получает информацию о текущем пользователе',
                    auth: true,
                    response: {
                        success: true,
                        data: {
                            _id: 'string',
                            email: 'string',
                            provider: 'google|vk|discord|github',
                            accountType: 'free|paid',
                            profile: {
                                name: 'string',
                                avatar: 'string',
                            },
                        },
                    },
                },
                {
                    method: 'POST',
                    path: '/api/auth/logout',
                    description: 'Выход из системы (удаляет текущий refresh token)',
                    auth: false,
                    response: {success: true},
                },
            ],
        },
        {
            title: 'Визитки',
            icon: Database,
            color: 'purple',
            endpoints: [
                {
                    method: 'POST',
                    path: '/api/cards',
                    description: 'Создает новую визитку',
                    auth: true,
                    body: {
                        name: 'string',
                        title: 'string (optional)',
                        description: 'string (optional)',
                        avatar: 'string (optional)',
                        theme: 'string',
                        socialLinks: 'object[]',
                        isPublic: 'boolean',
                    },
                    response: {
                        success: true,
                        data: {
                            _id: 'string',
                            slug: 'string',
                            // ... card data
                        },
                    },
                },
                {
                    method: 'GET',
                    path: '/api/cards',
                    description: 'Получает все визитки текущего пользователя',
                    auth: true,
                    response: {
                        success: true,
                        data: 'Card[]',
                    },
                },
                {
                    method: 'GET',
                    path: '/api/cards/:id',
                    description: 'Получает визитку по ID',
                    auth: false,
                    params: {id: 'Card ID'},
                    response: {
                        success: true,
                        data: 'Card object',
                    },
                },
                {
                    method: 'PUT',
                    path: '/api/cards/:id',
                    description: 'Обновляет визитку',
                    auth: true,
                    params: {id: 'Card ID'},
                    body: 'Partial Card object',
                    response: {
                        success: true,
                        data: 'Updated Card',
                    },
                },
                {
                    method: 'DELETE',
                    path: '/api/cards/:id',
                    description: 'Удаляет визитку',
                    auth: true,
                    params: {id: 'Card ID'},
                    response: {success: true},
                },
                {
                    method: 'POST',
                    path: '/api/cards/:id/view',
                    description: 'Увеличивает счетчик просмотров',
                    auth: false,
                    params: {id: 'Card ID'},
                    response: {success: true},
                },
            ],
        },
        {
            title: 'Короткие ссылки',
            icon: Zap,
            color: 'green',
            endpoints: [
                {
                    method: 'POST',
                    path: '/api/links/card/:cardId',
                    description: 'Создает короткую ссылку для визитки',
                    auth: true,
                    params: {cardId: 'Card ID'},
                    body: {customSlug: 'string (optional)'},
                    response: {
                        success: true,
                        data: {
                            slug: 'string',
                            targetType: 'card',
                            cardId: 'string',
                            isActive: true,
                        },
                    },
                },
                {
                    method: 'GET',
                    path: '/api/links/:slug',
                    description: 'Получает информацию о короткой ссылке',
                    auth: false,
                    params: {slug: 'Short slug'},
                    response: {
                        success: true,
                        data: {
                            slug: 'string',
                            targetType: 'card|url',
                            cardId: 'string',
                            originalUrl: 'string (for url type)',
                        },
                    },
                },
                {
                    method: 'DELETE',
                    path: '/api/links/:slug',
                    description: 'Удаляет короткую ссылку',
                    auth: true,
                    params: {slug: 'Short slug'},
                    response: {success: true},
                },
                {
                    method: 'GET',
                    path: '/api/links/card/:cardId',
                    description: 'Получает ссылку для конкретной визитки',
                    auth: true,
                    params: {cardId: 'Card ID'},
                    response: {
                        success: true,
                        data: 'ShortenedLink object',
                    },
                },
            ],
        },
    ];

    const renderMethodBadge = (method: string) => {
        const colors: Record<string, string> = {
            GET: 'bg-blue-100 text-blue-800',
            POST: 'bg-green-100 text-green-800',
            PUT: 'bg-yellow-100 text-yellow-800',
            DELETE: 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[method] || 'bg-gray-100'}`}>
                {method}
            </span>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
                        <Code className="h-10 w-10 text-blue-600"/>
                        API Документация
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Полное руководство по использованию Linkoo API для интеграции с вашими приложениями
                    </p>
                </div>

                {/* Quick Start */}
                <Card className="p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Zap className="h-6 w-6 text-yellow-600"/>
                        Быстрый старт
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Base URL</h3>
                            <code className="block bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                                https://api.linkoo.dev
                            </code>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Аутентификация</h3>
                            <p className="text-gray-600 mb-2">
                                API использует JWT токены. Включите access token в заголовок Authorization:
                            </p>
                            <code className="block bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                                Authorization: Bearer YOUR_ACCESS_TOKEN
                            </code>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Rate Limiting</h3>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                <li>Общие endpoints: 100 запросов / 15 минут</li>
                                <li>Auth endpoints: 30 запросов / 15 минут</li>
                                <li>Auth check (/me, /refresh): 30 запросов / минуту</li>
                                <li>Создание ссылок: 50 запросов / час</li>
                            </ul>
                        </div>
                    </div>
                </Card>

                {/* API Sections */}
                {apiSections.map((section, idx) => {
                    const Icon = section.icon;
                    return (
                        <Card key={idx} className="p-6 mb-6">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <Icon className={`h-6 w-6 text-${section.color}-600`}/>
                                {section.title}
                            </h2>
                            <div className="space-y-4">
                                {section.endpoints.map((endpoint, endpointIdx) => {
                                    const isExpanded = selectedEndpoint === `${idx}-${endpointIdx}`;
                                    return (
                                        <div
                                            key={endpointIdx}
                                            className="border rounded-lg overflow-hidden hover:border-blue-300 transition-colors"
                                        >
                                            <button
                                                onClick={() =>
                                                    setSelectedEndpoint(
                                                        isExpanded ? null : `${idx}-${endpointIdx}`
                                                    )
                                                }
                                                className="w-full p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center gap-3 flex-1">
                                                    {renderMethodBadge(endpoint.method)}
                                                    <code className="font-mono text-sm font-semibold">
                                                        {endpoint.path}
                                                    </code>
                                                    {endpoint.auth && (
                                                        <Shield className="h-4 w-4 text-amber-600" title="Требует авторизации"/>
                                                    )}
                                                </div>
                                                <ArrowRight
                                                    className={`h-4 w-4 text-gray-400 transition-transform ${
                                                        isExpanded ? 'rotate-90' : ''
                                                    }`}
                                                />
                                            </button>

                                            {isExpanded && (
                                                <div className="p-4 bg-white border-t space-y-4">
                                                    <p className="text-gray-700">{endpoint.description}</p>

                                                    {endpoint.params && (
                                                        <div>
                                                            <h4 className="font-semibold mb-2">Параметры URL:</h4>
                                                            <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                                                                {JSON.stringify(endpoint.params, null, 2)}
                                                            </pre>
                                                        </div>
                                                    )}

                                                    {endpoint.body && (
                                                        <div>
                                                            <h4 className="font-semibold mb-2">Request Body:</h4>
                                                            <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                                                                {JSON.stringify(endpoint.body, null, 2)}
                                                            </pre>
                                                        </div>
                                                    )}

                                                    {endpoint.response && (
                                                        <div>
                                                            <h4 className="font-semibold mb-2">Response:</h4>
                                                            <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                                                                {typeof endpoint.response === 'string'
                                                                    ? endpoint.response
                                                                    : JSON.stringify(endpoint.response, null, 2)}
                                                            </pre>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    );
                })}

                {/* Error Codes */}
                <Card className="p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Коды ошибок</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="border-b">
                                <th className="text-left py-2 px-4">Код</th>
                                <th className="text-left py-2 px-4">Описание</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="border-b">
                                <td className="py-2 px-4 font-mono">400</td>
                                <td className="py-2 px-4">Bad Request - Неверные параметры запроса</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2 px-4 font-mono">401</td>
                                <td className="py-2 px-4">Unauthorized - Требуется аутентификация</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2 px-4 font-mono">403</td>
                                <td className="py-2 px-4">Forbidden - Доступ запрещен</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2 px-4 font-mono">404</td>
                                <td className="py-2 px-4">Not Found - Ресурс не найден</td>
                            </tr>
                            <tr className="border-b">
                                <td className="py-2 px-4 font-mono">429</td>
                                <td className="py-2 px-4">Too Many Requests - Превышен лимит запросов</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 font-mono">500</td>
                                <td className="py-2 px-4">Internal Server Error - Внутренняя ошибка сервера</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Footer */}
                <div className="text-center pt-6 border-t">
                    <p className="text-gray-600 mb-4">
                        Нужна помощь с API? Свяжитесь с нами: <a href="mailto:api@linkoo.dev"
                                                                   className="text-blue-600 hover:text-blue-800">api@linkoo.dev</a>
                    </p>
                    <Link to="/" className="text-blue-600 hover:text-blue-800">
                        ← Вернуться на главную
                    </Link>
                </div>
            </div>
        </div>
    );
}
