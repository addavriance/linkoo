import { toast as sonnerToast } from 'sonner';

// Обертка над sonner для удобного использования
export const toast = {
  success: (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      duration: 4000,
    });
  },

  error: (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      duration: 5000,
    });
  },

  info: (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      duration: 4000,
    });
  },

  warning: (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      duration: 4000,
    });
  },

  loading: (message: string) => {
    return sonnerToast.loading(message);
  },

  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    });
  },
};

// Для обратной совместимости с существующим кодом
export const useToast = () => ({
  toast: (options: {
    title: string;
    description?: string;
    variant?: 'default' | 'destructive';
    duration?: number;
  }) => {
    if (options.variant === 'destructive') {
      sonnerToast.error(options.title, {
        description: options.description,
        duration: options.duration || 4000,
      });
    } else {
      sonnerToast.success(options.title, {
        description: options.description,
        duration: options.duration || 4000,
      });
    }
  },
});
