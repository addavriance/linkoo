import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.tsx";
import { toast } from '@/lib/toast';
import QRCodeStyling from 'qr-code-styling';
import { Loader2 } from 'lucide-react';
import {api} from "@/lib/api.ts";

interface MaxAuthDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface AuthStatus {
    status: 'idle' | 'connecting' | 'qr-ready' | 'scanning' | 'success' | 'error';
    message?: string;
    qrLink?: string;
    token?: string;
    profile?: any;
}

export const MaxAuthDialog: React.FC<MaxAuthDialogProps> = ({ open, onOpenChange }) => {
    const [authStatus, setAuthStatus] = useState<AuthStatus>({ status: 'idle' });
    const qrRef = useRef<HTMLDivElement>(null);
    const qrCodeRef = useRef<QRCodeStyling | null>(null);
    const cancelStreamRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (open && authStatus.status === 'idle') {
            startAuth();
        }

        return () => {
            // Очистка при размонтировании или закрытии диалога
            if (cancelStreamRef.current) {
                cancelStreamRef.current();
                cancelStreamRef.current = null;
            }

            // Сбрасываем состояние
            setAuthStatus({ status: 'idle' });

            // Очищаем QR код
            if (qrCodeRef.current && qrRef.current) {
                qrRef.current.innerHTML = '';
                qrCodeRef.current = null;
            }
        };
    }, [open]);

    useEffect(() => {
        if (
            authStatus.status !== 'qr-ready' ||
            !qrRef.current
        ) return;

        // Очищаем предыдущий QR код, если был
        if (qrCodeRef.current) {
            qrRef.current.innerHTML = '';
        }

        qrCodeRef.current = new QRCodeStyling({
            width: 280,
            height: 280,
            data: authStatus.qrLink || '',
            margin: 10,
            qrOptions: {
                typeNumber: 0,
                mode: 'Byte',
                errorCorrectionLevel: 'Q'
            },
            imageOptions: {
                hideBackgroundDots: true,
                imageSize: 0.4,
                margin: 8
            },
            dotsOptions: {
                color: '#000000',
                type: 'rounded'
            },
            backgroundOptions: {
                color: '#ffffff',
            },
            cornersSquareOptions: {
                color: '#000000',
                type: 'extra-rounded'
            },
            cornersDotOptions: {
                color: '#000000',
                type: 'dot'
            },
        });

        qrCodeRef.current.append(qrRef.current);
    }, [authStatus.status]);

    useEffect(() => {
        if (
            authStatus.status === 'qr-ready' &&
            authStatus.qrLink &&
            qrCodeRef.current
        ) {
            qrCodeRef.current.update({
                data: authStatus.qrLink
            });
        }
    }, [authStatus.qrLink]);


    const startAuth = async () => {
        setAuthStatus({ status: 'connecting', message: 'Подключение к серверу...' });
        try {
            cancelStreamRef.current = await api.startMaxAuth(
                (event, data) => {
                    handleSSEEvent(event, data);
                }
            );
        } catch (error) {
            toast.error('Ошибка соединения с сервером');
            onOpenChange(false);
        }
    };

    const handleDialogClose = (open: boolean) => {
        // Если закрываем диалог, сначала отменяем stream
        if (!open && cancelStreamRef.current) {
            cancelStreamRef.current();
            cancelStreamRef.current = null;
        }
        onOpenChange(open);
    };

    const handleSSEEvent = (event: string, data: any) => {
        console.log('SSE Event:', event, data);

        switch (event) {
            case 'status':
                setAuthStatus(prev => ({ ...prev, message: data.message }));

                if (data.message.includes('устарел')) {
                    qrRef.current!.style.backdropFilter = 'blur(20px)';
                }
                break;

            case 'qr':
                setAuthStatus({
                    status: 'qr-ready',
                    message: 'Отсканируйте QR-код в приложении MAX',
                    qrLink: data.qrLink
                });
                break;

            case 'success':
                setAuthStatus({
                    status: 'success',
                    message: 'Авторизация успешна!',
                    token: data.token,
                    profile: data.profile
                });

                window.location.href = api.getMaxCallbackURL(data.sessionId);

                setTimeout(() => {
                    onOpenChange(false);
                }, 1000);
                break;

            case 'error':
                setAuthStatus({
                    status: 'error',
                    message: data.message
                });
                toast.error(data.message || 'Произошла ошибка авторизации');
                break;

            case 'close':
                // Соединение закрыто сервером
                if (authStatus.status !== 'success') {
                    setAuthStatus({
                        status: 'error',
                        message: data.message || 'Соединение с сервером потеряно'
                    });
                    toast.error('Соединение с сервером потеряно');
                }
                break;
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="max-w-[480px] rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center">
                        Вход через <img src="/max_logo_colorful.png" alt="Max Logo" className="w-7 ml-3 mr-1"></img> <span className="text-lg">MAX</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col items-center py-6 space-y-4">
                    {/* Loader при подключении */}
                    {(authStatus.status === 'idle' || authStatus.status === 'connecting') && (
                        <div className="flex flex-col items-center space-y-4">
                            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                            <p className="text-sm text-muted-foreground">
                                {authStatus.message || 'Инициализация...'}
                            </p>
                        </div>
                    )}

                    {/* QR-код */}
                    {authStatus.status === 'qr-ready' && (
                        <div className="flex flex-col items-center space-y-4">
                            <div
                                ref={qrRef}
                                className="bg-white p-4 rounded-xl shadow-md"
                            />
                            <div className="text-center space-y-2">
                                <p className="text-sm font-medium text-foreground">
                                    {authStatus.message}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Наведите камеру на QR-код, чтобы войти в профиль или скачать приложение
                                </p>
                            </div>
                            {authStatus.qrLink && (
                                <a
                                    href={authStatus.qrLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Или откройте ссылку напрямую
                                </a>
                            )}
                        </div>
                    )}

                    {/* Успех */}
                    {authStatus.status === 'success' && (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-semibold text-foreground">
                                    Авторизация успешна!
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Добро пожаловать, {authStatus.profile?.contact?.names?.[0]?.firstName}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Ошибка */}
                    {authStatus.status === 'error' && (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div className="text-center space-y-2">
                                <p className="text-lg font-semibold text-foreground">
                                    Ошибка авторизации
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {authStatus.message}
                                </p>
                                <button
                                    onClick={() => {
                                        // Отменяем предыдущее соединение, если оно еще активно
                                        if (cancelStreamRef.current) {
                                            cancelStreamRef.current();
                                            cancelStreamRef.current = null;
                                        }
                                        setAuthStatus({ status: 'idle' });
                                        startAuth().catch(() => {
                                            // Ошибка уже обработана в startAuth
                                        });
                                    }}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Попробовать снова
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
