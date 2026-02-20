import { SongGridSkeleton } from "@/components/ui/skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
    return (
        <div className="p-8 pt-6 space-y-8 animate-fade-in-up">
            {/* Greeting skeleton */}
            <Skeleton className="h-10 w-64" />

            {/* Featured carousel skeleton */}
            <Skeleton className="h-64 w-full rounded-none" />

            {/* Quick access row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 rounded-none" />
                ))}
            </div>

            {/* Section title */}
            <Skeleton className="h-8 w-48" />

            {/* Song grid */}
            <SongGridSkeleton count={8} />
        </div>
    )
}
