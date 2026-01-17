import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithTokens } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const processedRef = useRef(false);

  useEffect(() => {
    // Предотвращаем повторную обработку с помощью ref
    if (processedRef.current) return;
    processedRef.current = true;

    const handleCallback = async () => {
      try {
        // Получаем токены из URL
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const expiresIn = searchParams.get('expiresIn');

        if (!accessToken || !refreshToken || !expiresIn) {
          throw new Error('Отсутствуют необходимые параметры авторизации');
        }

        // Логиним пользователя через AuthContext
        await loginWithTokens(accessToken, refreshToken, expiresIn);

        setStatus('success');

        // Редирект через 1 секунду
        setTimeout(() => {
          navigate('/profile');
        }, 1000);
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Не удалось авторизоваться');
      }
    };

    handleCallback();
    // Убираем зависимости которые могут меняться
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 mx-auto mb-4 text-blue-600 animate-spin" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Авторизация...
              </h1>
              <p className="text-gray-600">
                Пожалуйста, подождите
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Успешно!
              </h1>
              <p className="text-gray-600">
                Перенаправляем в профиль...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 mx-auto mb-4 text-red-600" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Ошибка авторизации
              </h1>
              <p className="text-gray-600 mb-6">
                {errorMessage}
              </p>
              <Button onClick={() => navigate('/')} className="w-full">
                Вернуться на главную
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
