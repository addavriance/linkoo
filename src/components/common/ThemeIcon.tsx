import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface ThemeIconProps extends Omit<LucideProps, 'ref'> {
    name?: string;
}

export const ThemeIcon = ({ name, className, ...props }: ThemeIconProps) => {
    if (!name) return null;

    const IconComponent = (Icons as any)[name];

    if (!IconComponent) {
        console.warn(`Icon "${name}" not found in lucide-react`);
        return null;
    }

    return <IconComponent className={className} {...props} />;
};
