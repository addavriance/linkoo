import {useState, useEffect} from 'react';

interface ToastData {
    id?: number;
    title?: string;
    description?: string;
    variant?: "default" | "destructive";
    duration?: number;
}

interface Toast extends ToastData {
    id: number;
}

let toastId = 0;
const toasts: Toast[] = [];
let listeners: Array<(toasts: Toast[]) => void> = [];

const addToast = (toast: ToastData): number => {
    const id = toastId++;
    const newToast: Toast = {id, ...toast};
    toasts.push(newToast);

    // Уведомляем всех слушателей
    listeners.forEach(listener => listener([...toasts]));

    // Автоматически удаляем через 4 секунды
    setTimeout(() => {
        removeToast(id);
    }, toast.duration || 4000);

    return id;
};

const removeToast = (id: number): void => {
    const index = toasts.findIndex(toast => toast.id === id);
    if (index > -1) {
        toasts.splice(index, 1);
        listeners.forEach(listener => listener([...toasts]));
    }
};

export const useToast = () => {
    const [toastList, setToastList] = useState<Toast[]>([...toasts]);

    useEffect(() => {
        const listener = (newToasts: Toast[]) => {
            setToastList(newToasts);
        };

        listeners.push(listener);

        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, []);

    const toast = ({title, description, variant = "default", duration = 4000}: ToastData) => {
        return addToast({
            title,
            description,
            variant,
            duration
        });
    };

    return {
        toast,
        toasts: toastList,
        dismiss: removeToast
    };
};

export const Toaster = () => {
    const {toasts, dismiss} = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
            max-w-sm p-4 rounded-lg shadow-lg border transition-all duration-300 ease-in-out
            ${toast.variant === 'destructive'
                        ? 'bg-red-50 border-red-200 text-red-900'
                        : 'bg-white border-gray-200 text-gray-900'
                    }
            animate-slide-up
          `}
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            {toast.title && (
                                <div className="font-medium mb-1">
                                    {toast.title}
                                </div>
                            )}
                            {toast.description && (
                                <div className="text-sm opacity-90">
                                    {toast.description}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => dismiss(toast.id)}
                            className="ml-3 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
