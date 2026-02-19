'use client'

import { usePlayer } from '@/store/player-store'
import Image from 'next/image'
import { cn } from '@/lib/utils'

import { RadioStationSelector } from './radio-station-selector'

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
        <div className="flex items-center gap-3 md:gap-4 w-full overflow-hidden">

            {/* Cover Art */}
            <div
                className={cn("relative h-14 w-14 rounded-none overflow-hidden bg-neutral-800 shrink-0 group hover:scale-[1.02] transition-all cursor-pointer shadow-lg ring-1 ring-white/5", isRadio && "shadow-[0_0_15px_rgba(99,102,241,0.4)] ring-ekko-500/20")}
                onClick={handleExpand}
            >
                {display.coverUrl ? (
                    <>
                        <Image
                            src={display.coverUrl}
                            alt={display.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                        />
                        {isRadio && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-ekko-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,1)]" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white rotate-270"><path d="m18 15-6-6-6 6" /></svg>
                        </div>
                    </>
                ) : (
                    <div className="h-full w-full bg-neutral-800" />
                )}
            </div>

            <div className="flex flex-col overflow-hidden min-w-0 gap-1">
                <div className="flex items-center gap-2">
                    <span
                        className={cn("text-[14px] font-semibold truncate cursor-pointer hover:underline decoration-neutral-500 transition-colors", isRadio && "text-ekko-400")}
                        onClick={handleExpand}
                    >
                        {display.title}
                    </span>
                    {isRadio && <RadioStationSelector />}
                </div>
                <span className="text-[13px] text-neutral-400 truncate flex items-center gap-1.5 hover:text-neutral-300 transition-colors cursor-pointer">
                    {isRadio && <span className="w-1.5 h-1.5 bg-ekko-500 rounded-full animate-pulse" />}
                    {display.artist}
                </span>
            </div>
        </div>
    )
}
