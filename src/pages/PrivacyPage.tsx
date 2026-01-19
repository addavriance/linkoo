import {Card} from '@/components/ui/card';
import {Link} from 'react-router-dom';

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Card className="p-8">
                    <h1 className="text-3xl font-bold mb-6">Политика конфиденциальности</h1>

                    <div className="space-y-6 text-sm leading-relaxed">
                        <p className="text-gray-600">
                            <strong>Дата последнего обновления:</strong> {new Date().toLocaleDateString('ru-RU')}
                        </p>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">1. Общие положения</h2>
                            <p className="text-gray-700 mb-2">
                                Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок обработки
                                и защиты персональных данных пользователей сервиса Linkoo (далее — «Сервис»),
                                доступного по адресу linkoo.dev.
                            </p>
                            <p className="text-gray-700 mb-2">
                                Использование Сервиса означает безоговорочное согласие пользователя с настоящей
                                Политикой и указанными в ней условиями обработки его персональных данных.
                            </p>
                            <p className="text-gray-700">
                                Настоящая Политика разработана в соответствии с Федеральным законом от 27.07.2006
                                № 152-ФЗ «О персональных данных».
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">2. Собираемые персональные данные</h2>
                            <p className="text-gray-700 mb-2">
                                При использовании Сервиса мы можем собирать следующие категории персональных данных:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                                <li>Адрес электронной почты</li>
                                <li>Имя и фамилия (получаемые через OAuth-провайдеров)</li>
                                <li>Аватар/фотография профиля (получаемые через OAuth-провайдеров)</li>
                                <li>Информация из профиля социальных сетей (Google, VK, Discord, GitHub)</li>
                                <li>IP-адрес и данные о браузере</li>
                                <li>Информация о визитках, созданных пользователем</li>
                                <li>Данные о посещениях и действиях в Сервисе</li>
                                <li>Файлы cookie и аналогичные технологии</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">3. Цели обработки персональных данных</h2>
                            <p className="text-gray-700 mb-2">
                                Персональные данные пользователей обрабатываются в следующих целях:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                                <li>Предоставление доступа к функциям Сервиса</li>
                                <li>Идентификация и аутентификация пользователя</li>
                                <li>Создание и управление учетной записью пользователя</li>
                                <li>Создание, хранение и управление электронными визитками</li>
                                <li>Предоставление платных услуг (Premium-аккаунт)</li>
                                <li>Обработка платежей и предотвращение мошенничества</li>
                                <li>Улучшение качества Сервиса и разработка новых функций</li>
                                <li>Техническая поддержка пользователей</li>
                                <li>Исполнение требований законодательства РФ</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">4. Правовые основания обработки</h2>
                            <p className="text-gray-700 mb-2">
                                Обработка персональных данных осуществляется на основании:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                                <li>Согласия пользователя на обработку персональных данных</li>
                                <li>Необходимости исполнения договора оказания услуг</li>
                                <li>Требований законодательства Российской Федерации</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">5. Передача данных третьим лицам</h2>
                            <p className="text-gray-700 mb-2">
                                Мы можем передавать ваши персональные данные следующим категориям третьих лиц:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                                <li>
                                    <strong>OAuth-провайдеры:</strong> Google, VK, Discord, GitHub — для авторизации
                                </li>
                                <li>
                                    <strong>Платежные системы:</strong> для обработки платежей за Premium-подписку
                                </li>
                                <li>
                                    <strong>Хостинг-провайдеры:</strong> для хранения данных
                                </li>
                                <li>
                                    <strong>Государственные органы:</strong> при наличии законных оснований
                                </li>
                            </ul>
                            <p className="text-gray-700 mt-2">
                                Мы не продаем и не передаем ваши персональные данные третьим лицам в маркетинговых
                                целях.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">6. Хранение персональных данных</h2>
                            <p className="text-gray-700 mb-2">
                                Персональные данные хранятся в течение всего периода использования Сервиса и в течение
                                3 (трех) лет после прекращения использования, если иное не предусмотрено
                                законодательством.
                            </p>
                            <p className="text-gray-700">
                                Данные хранятся на защищенных серверах с применением современных методов шифрования
                                и защиты информации.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">7. Файлы cookie</h2>
                            <p className="text-gray-700 mb-2">
                                Сервис использует файлы cookie и аналогичные технологии для:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                                <li>Аутентификации пользователей</li>
                                <li>Сохранения настроек и предпочтений</li>
                                <li>Анализа использования Сервиса</li>
                                <li>Улучшения функциональности и удобства использования</li>
                            </ul>
                            <p className="text-gray-700 mt-2">
                                Вы можете настроить свой браузер для отклонения всех или некоторых файлов cookie.
                                Однако это может повлиять на функциональность Сервиса.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">8. Права субъекта персональных данных</h2>
                            <p className="text-gray-700 mb-2">
                                В соответствии с ФЗ-152 вы имеете право:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                                <li>Получать информацию о наличии и содержании ваших персональных данных</li>
                                <li>Требовать уточнения, блокирования или удаления персональных данных</li>
                                <li>Отозвать согласие на обработку персональных данных</li>
                                <li>Обжаловать действия или бездействие оператора в Роскомнадзоре или суде</li>
                                <li>Получать возмещение убытков в случае нарушения прав</li>
                            </ul>
                            <p className="text-gray-700 mt-2">
                                Для реализации своих прав обратитесь к нам по контактным данным, указанным ниже.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">9. Безопасность данных</h2>
                            <p className="text-gray-700">
                                Мы применяем организационные и технические меры для защиты персональных данных от
                                несанкционированного доступа, изменения, раскрытия или уничтожения, включая:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mt-2">
                                <li>Шифрование данных при передаче (SSL/TLS)</li>
                                <li>Ограничение доступа к персональным данным</li>
                                <li>Регулярное резервное копирование</li>
                                <li>Мониторинг безопасности систем</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">10. Изменения в Политике</h2>
                            <p className="text-gray-700">
                                Мы оставляем за собой право вносить изменения в настоящую Политику.
                                Новая редакция вступает в силу с момента размещения на сайте.
                                Продолжение использования Сервиса после внесения изменений означает согласие с новой
                                редакцией.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-3">11. Контактная информация</h2>
                            <p className="text-gray-700 mb-2">
                                По вопросам обработки персональных данных вы можете обратиться:
                            </p>
                            <ul className="list-none space-y-1 text-gray-700 ml-4">
                                <li><strong>Email:</strong> privacy@linkoo.dev</li>
                                <li><strong>Сайт:</strong> linkoo.dev</li>
                            </ul>
                        </section>

                        <div className="pt-6 border-t mt-8">
                            <Link to="/" className="text-blue-600 hover:text-blue-800">
                                ← Вернуться на главную
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
