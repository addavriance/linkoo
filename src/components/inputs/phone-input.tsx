import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { validatePhone, formatPhone } from '@/lib/compression';

interface PhoneInputProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    [key: string]: any;
}

const PhoneInput = ({
                        value = '',
                        onChange,
                        placeholder = '+7 (999) 123-45-67',
                        className = '',
                        ...props
                    }: PhoneInputProps) => {
    const [displayValue, setDisplayValue] = useState('');
    const [isValid, setIsValid] = useState(true);

    // Форматирование номера для отображения
    const formatDisplayPhone = (phone: string) => {
        const cleaned = phone.replace(/[^\d+]/g, '');

        // Если пустой номер
        if (!cleaned) return '';

        // Российский номер
        if (cleaned.startsWith('+7') || cleaned.startsWith('7')) {
            const digits = cleaned.replace(/^\+?7/, '');
            if (digits.length === 0) return '+7';
            if (digits.length <= 3) return `+7 (${digits}`;
            if (digits.length <= 6) return `+7 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
            if (digits.length <= 8) return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
            return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
        }

        // Номер с другим кодом страны
        if (cleaned.startsWith('+')) {
            return cleaned;
        }

        // Номер без кода страны - добавляем +7
        if (cleaned.length > 0) {
            return formatDisplayPhone('+7' + cleaned);
        }

        return cleaned;
    };

    // Обновление отображаемого значения при изменении value
    useEffect(() => {
        setDisplayValue(formatDisplayPhone(value));
        setIsValid(validatePhone(value) || !value);
    }, [value]);

    // Обработка ввода
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;

        // Убираем все кроме цифр и +
        const cleaned = inputValue.replace(/[^\d+]/g, '');

        // Ограничиваем длину
        if (cleaned.length > 12) return;

        // Автоматически добавляем +7 если вводят без кода
        let processedValue = cleaned;
        if (cleaned.length > 0 && !cleaned.startsWith('+')) {
            if (cleaned.startsWith('8')) {
                processedValue = '+7' + cleaned.slice(1);
            } else if (cleaned.startsWith('7')) {
                processedValue = '+' + cleaned;
            } else {
                processedValue = '+7' + cleaned;
            }
        }

        // Форматируем для отображения
        const formatted = formatDisplayPhone(processedValue);
        setDisplayValue(formatted);

        // Валидация
        const isValidPhone = validatePhone(processedValue) || !processedValue;
        setIsValid(isValidPhone);

        // Отправляем очищенное значение в родительский компонент
        if (onChange) {
            onChange(processedValue);
        }
    };

    // Обработка специальных клавиш
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Разрешаем навигационные клавиши
        const allowedKeys = [
            'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
            'ArrowUp', 'ArrowDown', 'Home', 'End', 'Tab'
        ];

        if (allowedKeys.includes(e.key)) return;

        // Разрешаем цифры и +
        if (!/[\d+]/.test(e.key)) {
            e.preventDefault();
        }
    };

    // Обработка вставки
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const cleaned = pastedText.replace(/[^\d+]/g, '');

        if (cleaned) {
            const formatted = formatPhone(cleaned);
            setDisplayValue(formatDisplayPhone(formatted));
            setIsValid(validatePhone(formatted));

            if (onChange) {
                onChange(formatted);
            }
        }
    };

    return (
        <div className="relative">
            <Input
                type="tel"
                value={displayValue}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                placeholder={placeholder}
                className={`${className} ${
                    !isValid ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''
                }`}
                {...props}
            />

            {/* Индикатор валидности */}
            {displayValue && (
                <div className="absolute right-3 top-[17px] -translate-y-1/2">
                    {isValid ? (
                        <span className="text-green-500 text-xs">✓</span>
                    ) : (
                        <span className="text-red-500 text-xs">✗</span>
                    )}
                </div>
            )}

            {/* Подсказка об ошибке */}
            {/*{displayValue && !isValid && (*/}
            {/*    <div className="absolute -bottom-5 left-0 text-xs text-red-500">*/}
            {/*        Неверный формат номера*/}
            {/*    </div>*/}
            {/*)}*/}
            {displayValue && !isValid && (
                <p className="text-xs text-amber-600 mt-1">
                    Некорректный номер не будет включен в визитку
                </p>
            )}
        </div>
    );
};

export default PhoneInput;
