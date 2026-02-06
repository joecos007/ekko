'use client'

import { usePlayer } from '@/store/player-store'
import Image from 'next/image'

export function TrackInfo() {
    const { queue, currentIndex, toggleExpanded } = usePlayer()
    const song = queue[currentIndex]

    const handleExpand = () => {
        toggleExpanded()
    }

    if (!song) {
        return <div className="flex items-center gap-4 w-full opacity-0"></div>
    }

    return (
        <div
            className="flex items-center gap-3 md:gap-4 w-full overflow-hidden cursor-pointer group"
            onClick={handleExpand}
        >
            {song.coverUrl ? (
                <div className="relative h-14 w-14 rounded-none overflow-hidden bg-neutral-800 shrink-0 group-hover:scale-105 transition-transform">
                    <Image
                        src={song.coverUrl}
                        alt={song.title}
                        fill
                        className="object-cover"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white rotate-270"><path d="m18 15-6-6-6 6" /></svg>
                    </div>
                </div>
            ) : (
                <div className="h-14 w-14 bg-neutral-800 shrink-0" />
            )}

            <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate group-hover:underline decoration-neutral-400">{song.title}</span>
                <span className="text-xs text-muted-foreground truncate group-hover:text-white transition-colors">{song.artist}</span>
            </div>
        </div>
    )
}
