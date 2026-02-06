import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Whether to show the shimmer animation
     */
    animate?: boolean
}

/**
 * Skeleton loader component for displaying loading states.
 * Uses the shimmer animation from globals.css.
 */
export function Skeleton({
    className,
    animate = true,
    ...props
}: SkeletonProps) {
    return (
        <div
            className={cn(
                "bg-neutral-800/50 rounded-sm",
                animate && "animate-shimmer",
                className
            )}
            {...props}
        />
    )
}

/**
 * Skeleton for a song card in the grid layout.
 */
export function SongCardSkeleton() {
    return (
        <div className="glass-card p-4 rounded-md">
            {/* Cover art skeleton */}
            <Skeleton className="aspect-square w-full mb-4" />
            {/* Title skeleton */}
            <Skeleton className="h-4 w-3/4 mb-2" />
            {/* Artist skeleton */}
            <Skeleton className="h-3 w-1/2" />
        </div>
    )
}

/**
 * Grid of skeleton song cards for loading state.
 */
export function SongGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="animate-fade-in-up opacity-0"
                    style={{ animationDelay: `${i * 0.1}s` }}
                >
                    <SongCardSkeleton />
                </div>
            ))}
        </div>
    )
}

/**
 * Skeleton for a song row in a list layout.
 */
export function SongRowSkeleton() {
    return (
        <div className="flex items-center gap-4 px-4 py-3">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-10 h-10" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-4 w-12" />
        </div>
    )
}
