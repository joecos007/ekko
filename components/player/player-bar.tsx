'use client'

import { useState, lazy, Suspense } from 'react'
import Image from 'next/image'
import { Controls } from './controls'
import { ProgressBar } from './progress-bar'
import { VolumeControl } from './volume-control'
import { TrackInfo } from './track-info'

const NowPlayingView = lazy(() => import('./now-playing-view').then(m => ({ default: m.NowPlayingView })))
const QueueView = lazy(() => import('./queue-view').then(m => ({ default: m.QueueView })))
import { usePlayer } from '@/store/player-store'
import { useSwipeGesture } from '@/hooks/use-swipe-gesture'
import { cn } from '@/lib/utils'
import { Play, Pause, SkipForward, Maximize2, ListMusic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VibeOverlay } from '@/components/vibes/vibe-overlay'
import { VibeInput } from '@/components/vibes/vibe-input'

export function PlayerBar() {
    const { queue, currentIndex, isPlaying, togglePlay, setExpanded, isRadio, radioMetadata, next, currentTime, duration } = usePlayer()
    const song = queue[currentIndex]
    const [showQueue, setShowQueue] = useState(false)

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

            {/* Mobile Mini Player - Spotify/Apple Music Inspired */}
            <div
                className="md:hidden fixed bottom-[var(--mobile-mini-player-offset)] left-0 right-0 min-h-[var(--mobile-mini-player-height)] bg-neutral-900/95 backdrop-blur-2xl border-t border-white/[0.08] z-40 transition-all duration-300"
                onClick={() => setExpanded(true)}
                {...swipeHandlers}
            >
                {/* Main Content Container */}
                <div className="flex items-center gap-3 p-2.5">
                    {/* Album Art - Larger & More Prominent */}
                    <div className={cn("relative h-14 w-14 overflow-hidden shadow-xl flex-shrink-0 ring-1 ring-white/5", isPlaying ? "animate-spin-slow" : "")}>
                        <Image src={displaySong.coverUrl || "/placeholder.png"} alt={displaySong.title} fill className="object-cover" unoptimized />
                    </div>

                    {/* Track Info - Better Typography */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                        <h4 className="text-[15px] font-semibold text-white truncate leading-snug tracking-tight">{displaySong.title}</h4>
                        <p className="text-[13px] text-neutral-400 truncate leading-snug">{displaySong.artist}</p>
                    </div>

                    {/* Right Controls Group */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        {/* Vibe Input - Mobile */}
                        <div onClick={(e) => e.stopPropagation()}>
                            <VibeInput className="h-9 w-9" />
                        </div>

                        {/* Play/Pause - Primary Action */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-11 w-11 text-white hover:bg-white/10 active:bg-white/15 rounded-full flex-shrink-0 transition-all"
                            onClick={(e) => {
                                e.stopPropagation()
                                togglePlay()
                            }}
                        >
                            {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                        </Button>

                        {/* Next Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-neutral-300 hover:text-white hover:bg-white/10 active:bg-white/15 rounded-full flex-shrink-0 transition-all"
                            onClick={(e) => {
                                e.stopPropagation()
                                next()
                            }}
                        >
                            <SkipForward className="w-5 h-5 fill-current" />
                        </Button>
                    </div>
                </div>

                {/* Progress Bar - More Visible */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-ekko-500 to-ekko-400 transition-[width] duration-200 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                        style={{ width: `${duration > 0 && duration !== Infinity ? Math.min((currentTime / duration) * 100, 100) : 0}%` }}
                    />
                </div>
            </div>

            {/* Desktop Player Bar - Spotify/Apple Music Inspired */}
            <div
                className="hidden md:flex fixed bottom-0 left-0 right-0 h-[var(--player-bar-height)] bg-neutral-950/98 backdrop-blur-3xl border-t border-white/[0.06] z-40 transition-all items-center px-4 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]"
            >
                <div className="flex items-center justify-between gap-6 w-full h-full max-w-[2000px] mx-auto">
                    {/* Track Info - Left (25% width) */}
                    <div className="flex-1 min-w-0 max-w-[30%]">
                        <TrackInfo />
                    </div>

                    {/* Controls - Center (50% width) */}
                    <div className="flex flex-col items-center gap-2 flex-shrink-0 z-50 w-full max-w-[40%]">
                        <Controls />
                        <div className="w-full px-2">
                            <ProgressBar />
                        </div>
                    </div>

                    {/* Right Controls - (25% width) */}
                    <div className="flex-1 flex justify-end items-center gap-2 min-w-0 max-w-[30%]">
                        {/* Vibe Input - Desktop */}
                        <div className="shrink-0">
                            <VibeInput className="h-9 w-9" />
                        </div>

                        {/* Volume Control */}
                        <div className="shrink-0">
                            <VolumeControl />
                        </div>

                        {/* Secondary Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn("h-9 w-9 rounded-full flex-shrink-0 transition-all", showQueue ? "text-ekko-400 bg-ekko-500/10 hover:bg-ekko-500/15" : "text-neutral-400 hover:text-white hover:bg-white/5")}
                                onClick={() => setShowQueue(!showQueue)}
                                title="Queue"
                            >
                                <ListMusic className="w-[18px] h-[18px]" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-neutral-400 hover:text-white hover:bg-white/5 rounded-full flex-shrink-0 transition-all"
                                onClick={() => setExpanded(true)}
                                title="Full Screen Player"
                            >
                                <Maximize2 className="w-[18px] h-[18px]" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Suspense fallback={null}>
                <NowPlayingView />
            </Suspense>
            <Suspense fallback={null}>
                <QueueView open={showQueue} onClose={() => setShowQueue(false)} />
            </Suspense>
        </>
    )
}
