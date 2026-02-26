import {Card} from '@/components/ui/card';

function Skeleton({className = ''}: { className?: string }) {
    return <div className={`animate-pulse bg-muted rounded ${className}`}/>;
}

export function CardSkeleton() {
    return (
        <Card className="p-4 space-y-3">
            <div className="flex items-start gap-3">
                <Skeleton className="w-12 h-12 rounded-full shrink-0"/>
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32"/>
                    <Skeleton className="h-4 w-24"/>
                </div>
            </div>
            <Skeleton className="h-3 w-3/4"/>
            <Skeleton className="h-10 w-full"/>
            <div className="flex gap-2">
                <Skeleton className="h-8 flex-1"/>
                <Skeleton className="h-8 w-8"/>
            </div>
        </Card>
    );
}
