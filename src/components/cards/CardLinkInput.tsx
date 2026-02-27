import {cn} from "@/lib/utils.ts";

const modeStyles = {
    default: {
        container: 'bg-muted/60',
        input: 'text-foreground placeholder-muted-foreground',
        prefix: 'text-muted-foreground',
        checkIcon: 'text-green-600',
    },
    delete: {
        container: 'wd:(bg-red-50 border-red-100)',
        input: 'wd:(border-red-200 bg-red-50 placeholder-red-300)',
        prefix: 'text-red-400',
        checkIcon: 'text-red-600',
    },
} as const;

interface LinkInputProps {
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    prefix?: string;
    autoFocus?: boolean;
    readOnly?: boolean;
    variant?: keyof typeof modeStyles;
    className?: string;
    children?: React.ReactNode;
}

export function LinkInput({
                       value,
                       onChange,
                       placeholder,
                       prefix = `${window.location.origin}/`,
                       autoFocus,
                       readOnly,
                       variant = 'default',
                       className,
                       children,
                   }: LinkInputProps) {
    const styles = modeStyles[variant];

    return (
        <div className={cn(
            "flex items-center gap-1.5 p-2 rounded-lg",
            styles.container,
            className
        )}>
            {prefix && (
                <span className={cn("text-xs shrink-0 font-mono", styles.prefix)}>
                    {prefix}
                </span>
            )}
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
            {children}
        </div>
    );
}
