import {cn} from "@/lib/utils.ts";

const modeStyles = {
    default: {
        container: 'wd:(rounded-lg border bg-purple-50 border-purple-100)',
        input: 'wd:text-purple-900 placeholder-purple-300',
        suffix: 'wd:text-purple-400',
        checkIcon: 'wd:text-purple-600',
    },
    delete: {
        container: 'wd:(bg-red-50 border-red-100)',
        input: 'wd:(border-red-200 bg-red-50 placeholder-red-300)',
        suffix: 'text-red-400',
        checkIcon: 'text-red-600',
    },
} as const;

interface SubdomainInputProps {
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    suffix?: string | null;
    autoFocus?: boolean;
    readOnly?: boolean;
    variant?: keyof typeof modeStyles;
    className?: string;
    children?: React.ReactNode;
}

export function SubdomainInput({
                            value,
                            onChange,
                            placeholder,
                            suffix = '.linkoo.dev',
                            autoFocus,
                            readOnly,
                            variant = 'default',
                            className,
                            children,
                        }: SubdomainInputProps) {
    const styles = modeStyles[variant];

    return (
        <div className={cn(
            "flex items-center gap-1.5 p-2 rounded-lg border",
            styles.container,
            className
        )}>
            <input
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoFocus={autoFocus}
                readOnly={readOnly}
                className={cn(
                    "flex-1 text-xs font-mono bg-transparent outline-none min-w-0 truncate",
                    styles.input,
                    readOnly && "cursor-default"
                )}
            />
            {suffix && (
                <span className={cn("text-xs shrink-0 font-mono", styles.suffix)}>
                    {suffix}
                </span>
            )}
            {children}
        </div>
    );
}
