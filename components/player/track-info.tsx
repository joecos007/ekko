'use client'

import { usePlayer } from '@/store/player-store'
import Image from 'next/image'
import { cn } from '@/lib/utils'

export function TrackInfo() {
    const { queue, currentIndex, toggleExpanded, isRadio, radioMetadata } = usePlayer()
    const song = queue[currentIndex]

    const display = isRadio ? {
        title: radioMetadata.title,
        artist: radioMetadata.artist,
        coverUrl: radioMetadata.coverUrl
    } : song

    const handleExpand = () => {
        toggleExpanded()
    }

    if (!display) {
        return <div className="flex items-center gap-4 w-full opacity-0"></div>
    }

    return (
        <div
            className="flex items-center gap-3 md:gap-4 w-full overflow-hidden cursor-pointer group"
            onClick={handleExpand}
        >
            {display.coverUrl ? (
                <div className={cn("relative h-14 w-14 rounded-none overflow-hidden bg-neutral-800 shrink-0 group-hover:scale-105 transition-transform", isRadio && "shadow-[0_0_15px_rgba(239,68,68,0.4)]")}>
                    <Image
                        src={display.coverUrl}
                        alt={display.title}
                        fill
                        className="object-cover"
                    />
                    {isRadio && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]" />
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white rotate-270"><path d="m18 15-6-6-6 6" /></svg>
                    </div>
                </div>
            ) : (
                <div className="h-14 w-14 bg-neutral-800 shrink-0" />
            )}

            <div className="flex flex-col overflow-hidden">
                <span className={cn("text-sm font-medium truncate group-hover:underline decoration-neutral-400", isRadio && "text-red-400")}>{display.title}</span>
                <span className="text-xs text-muted-foreground truncate group-hover:text-white transition-colors">
                    {isRadio && <span className="inline-block w-20 animate-pulse">● LIVE • </span>}
                    {display.artist}
                </span>
            </div>
        </div>
    )
}
