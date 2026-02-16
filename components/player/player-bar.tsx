'use client'

import Image from 'next/image'
import { Controls } from './controls'
import { ProgressBar } from './progress-bar'
import { VolumeControl } from './volume-control'
import { TrackInfo } from './track-info'
import { NowPlayingView } from './now-playing-view'
import { usePlayer } from '@/store/player-store'
import { useSwipeGesture } from '@/hooks/use-swipe-gesture'
import { cn } from '@/lib/utils'
import { Play, Pause, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VibeOverlay } from '@/components/vibes/vibe-overlay'
import { VibeInput } from '@/components/vibes/vibe-input'

export function PlayerBar() {
    const { queue, currentIndex, isPlaying, togglePlay, setExpanded, isRadio, radioMetadata, next, currentTime, duration } = usePlayer()
    const song = queue[currentIndex]

    // Determine what to show
    const displaySong = isRadio ? {
        title: radioMetadata.title,
        artist: radioMetadata.artist,
        coverUrl: radioMetadata.coverUrl,
        duration: Infinity
    } : song

    // Swipe up to expand Now Playing view on mobile
    const swipeHandlers = useSwipeGesture({
        onSwipeUp: () => setExpanded(true),
        threshold: 30
    })

    if (!displaySong) return null

    return (
        <>
            {/* Global Vibe Overlay - Visible everywhere */}
            <div className="fixed inset-0 pointer-events-none z-30">
                <VibeOverlay />
            </div>

            {/* Mobile Mini Player - Floating Style */}
            <div
                className="md:hidden fixed bottom-[5.5rem] left-2 right-2 bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 pr-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-40 flex items-center gap-3 active:scale-[0.98] transition-all duration-300"
                onClick={() => setExpanded(true)}
                {...swipeHandlers}
            >
                {/* Album Art with Rotate Animation */}
                <div className={cn("relative h-12 w-12 rounded-xl overflow-hidden shadow-lg flex-shrink-0", isPlaying ? "animate-spin-slow" : "")}>
                    <Image src={displaySong.coverUrl || "/placeholder.png"} alt={displaySong.title} fill className="object-cover" unoptimized />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h4 className="text-sm font-bold text-white truncate leading-tight">{displaySong.title}</h4>
                    <p className="text-xs text-neutral-400 truncate leading-tight">{displaySong.artist}</p>
                </div>

                {/* Vibe Input - Mobile */}
                <div onClick={(e) => e.stopPropagation()}>
                    <VibeInput />
                </div>

                {/* Controls (Play/Pause) */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 text-white hover:bg-white/10 rounded-full flex-shrink-0"
                    onClick={(e) => {
                        e.stopPropagation()
                        togglePlay()
                    }}
                >
                    {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
                </Button>

                {/* Next Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 text-white hover:bg-white/10 rounded-full flex-shrink-0"
                    onClick={(e) => {
                        e.stopPropagation()
                        next()
                    }}
                >
                    <SkipForward className="w-5 h-5 fill-white" />
                </Button>

                {/* Progress Bar (Bottom Line) */}
                <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white/50 rounded-full transition-[width] duration-200"
                        style={{ width: `${duration > 0 && duration !== Infinity ? Math.min((currentTime / duration) * 100, 100) : 0}%` }}
                    />
                </div>
            </div>

            {/* Desktop Player Bar */}
            <div
                className="hidden md:flex fixed bottom-0 left-0 right-0 h-24 bg-black/20 backdrop-blur-3xl border-t border-white/5 z-40 transition-all items-center px-4"
            >
                <div className="flex items-center justify-between gap-2 w-full h-full">
                    {/* Track Info - Left */}
                    <div className="flex-1 min-w-0">
                        <TrackInfo />
                    </div>

                    {/* Controls - Center */}
                    <div className="flex flex-col items-center gap-2 flex-shrink-0 z-50">
                        <Controls />
                        <div className="w-full min-w-[300px] max-w-xl">
                            <ProgressBar />
                        </div>
                    </div>

                    {/* Volume / Spacer - Right */}
                    <div className="flex-1 flex justify-end items-center gap-4 min-w-0">
                        {/* Vibe Input - Desktop */}
                        <VibeInput />
                        <div className="w-full max-w-[120px] flex justify-end">
                            <VolumeControl />
                        </div>
                    </div>
                </div>
            </div>

            <NowPlayingView />
        </>
    )
}
