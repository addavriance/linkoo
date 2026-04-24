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

    const formatDisplayPhone = (phone: string) => {
        const cleaned = phone.replace(/[^\d+]/g, '');

        if (!cleaned) return '';

        if (cleaned.startsWith('+7') || cleaned.startsWith('7')) {
            const digits = cleaned.replace(/^\+?7/, '');
            if (digits.length === 0) return '+7';
            if (digits.length <= 3) return `+7 (${digits}`;
            if (digits.length <= 6) return `+7 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
            if (digits.length <= 8) return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
            return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
        }

        if (cleaned.startsWith('+')) {
            return cleaned;
        }

        if (cleaned.length > 0) {
            return formatDisplayPhone('+7' + cleaned);
        }

        return cleaned;
    };

    useEffect(() => {
        setDisplayValue(formatDisplayPhone(value));
        setIsValid(validatePhone(value) || !value);
    }, [value]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const cleaned = inputValue.replace(/[^\d+]/g, '');

        if (cleaned.length > 16) return;

        let processedValue = cleaned;
        if (cleaned.length > 0 && !cleaned.startsWith('+')) {
            if (cleaned.startsWith('8') && cleaned.length <= 11) {
                processedValue = '+7' + cleaned.slice(1);
            } else if (cleaned.startsWith('7') && cleaned.length <= 11) {
                processedValue = '+' + cleaned;
            } else {
                processedValue = '+' + cleaned;
            }
        }

        if (processedValue.startsWith('+7') && processedValue.length > 12) return;

        const formatted = formatDisplayPhone(processedValue);
        setDisplayValue(formatted);

        const isValidPhone = validatePhone(processedValue) || !processedValue;
        setIsValid(isValidPhone);

        if (onChange) {
            onChange(processedValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowedKeys = [
            'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight',
            'ArrowUp', 'ArrowDown', 'Home', 'End', 'Tab'
        ];

        if (allowedKeys.includes(e.key)) return;

        if (!/[\d+]/.test(e.key)) {
            e.preventDefault();
        }
    };

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
                    !isValid ? 'border-amber-300 focus:border-amber-500 focus:ring-amber-500/20' : ''
                }`}
                {...props}
            />

            {displayValue && (
                <div className="absolute right-3 top-[17px] -translate-y-1/2">
                    {isValid ? (
                        <span className="text-green-500 text-xs">✓</span>
                    ) : (
                        <span className="text-amber-500 text-xs">!</span>
                    )}
                </div>
            )}

            {displayValue && !isValid && (
                <p className="text-xs text-amber-600 mt-1">
                    Вероятно, номер записан не в том формате
                </p>
            )}
        </div>
    );
};

export default PhoneInput;
