import {Button} from "@/components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";

export function ActionButtons({children}: { children: React.ReactNode }) {
    return <div className="flex items-center gap-0.5 ml-auto shrink-0">{children}</div>;
}

interface ActionButtonProps {
    size?: "default" | "sm" | "lg" | "icon";
    variant?: "default" | "secondary" | "ghost" | "link" | "destructive" | "outline";
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
}

export const ActionButton = ({size="sm", variant="ghost", className, onClick, disabled, children}: ActionButtonProps) => {
    return (
        <Button
            size={size}
            variant={variant}
            className={cn(className, "h-7 w-7 p-0 hover:bg-black/5 dark:hover:bg-white/5")}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </Button>
    )
}
