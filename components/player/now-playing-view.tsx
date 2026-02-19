'use client'

import { usePlayer } from '@/store/player-store'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ChevronDown, MoreHorizontal, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, ListMusic, Volume2, Heart, Mic2, SlidersHorizontal } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { MediaItemActionMenu } from '@/components/media/media-item-action-menu'
import { useSwipeGesture } from '@/hooks/use-swipe-gesture'
import { useLikedSongs } from '@/hooks/use-liked-songs'
import { LyricsView } from './lyrics-view'
import { SleepTimer } from './sleep-timer'
import { Equalizer } from './equalizer'

import { VibeOverlay } from '@/components/vibes/vibe-overlay'
import { VibeInput } from '@/components/vibes/vibe-input'

export function NowPlayingView() {
    const {
        queue,
        currentIndex,
        isPlaying,
        toggleExpanded,
        isExpanded,
        play,
        pause,
        next,
        prev,
        shuffle,
        toggleShuffle,
        repeat,
        cycleRepeat,
        currentTime,
        duration,
        isRadio,
        radioMetadata
    } = usePlayer()

    const { toggleLike, isLiked } = useLikedSongs()
    const [sliderValue, setSliderValue] = useState([0])
    const [isDragging, setIsDragging] = useState(false)
    const [showLyrics, setShowLyrics] = useState(false)
    const [showEQ, setShowEQ] = useState(false)

    const song = queue[currentIndex]
    const liked = song ? isLiked(song.id) : false

    const display = isRadio ? {
        id: "radio",
        title: radioMetadata.title,
        artist: radioMetadata.artist,
        coverUrl: radioMetadata.coverUrl
    } : song

    useEffect(() => {
        if (!isDragging) {
            setSliderValue([currentTime])
        }
    }, [currentTime, isDragging])

    const formatTime = (seconds: number) => {
        if (seconds === Infinity) return "LIVE"
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const swipeHandlers = useSwipeGesture({
        onSwipeDown: () => toggleExpanded(),
        threshold: 50
    })

    if (!isExpanded || !display) return null

    return (
        <div
            className="fixed inset-0 z-[100] bg-black flex flex-col font-geist-sans select-none overflow-hidden"
            {...swipeHandlers}
        >
            <VibeOverlay />

            {/* Background Gradient */}
            <div className="absolute inset-0 z-0">
                {display.coverUrl ? (
                    <Image
                        src={display.coverUrl}
                        alt="Background"
                        fill
                        className="object-cover blur-[100px] opacity-60 scale-150 animate-pulse-slow"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-black to-neutral-900" />
                )}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 pt-12">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleExpanded}
                    className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-12 w-12 transition-all active:scale-90"
                >
                    <ChevronDown className="w-8 h-8" />
                </Button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/50 mb-0.5">
                        {isRadio ? "Live Frequency" : "Playing from EKKO"}
                    </span>
                    <span className="text-xs font-bold text-white/90 truncate max-w-[150px]">
                        {isRadio ? radioMetadata.title : "Community Mix"}
                    </span>
                </div>
                <MediaItemActionMenu songId={display.id} songTitle={display.title}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white/70 hover:text-white hover:bg-white/10 rounded-full h-12 w-12"
                    >
                        <MoreHorizontal className="w-6 h-6" />
                    </Button>
                </MediaItemActionMenu>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 pb-12 max-w-4xl mx-auto w-full h-full">
                {/* Album Art Container */}
                <div className="w-full max-w-[380px] aspect-square relative mb-12 group">
                    <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-1000 scale-110" />
                    <div className={cn(
                        "w-full h-full relative shadow-3xl rounded-none overflow-hidden ring-1 ring-white/10 transition-transform duration-700 ease-out-back",
                        isPlaying ? "scale-100 shadow-white/5" : "scale-[0.92] shadow-black/80"
                    )}>
                        {display.coverUrl ? (
                            <Image
                                src={display.coverUrl}
                                alt={display.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 380px"
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                                <span className="text-neutral-700 font-black text-2xl tracking-tighter uppercase opacity-20">EKKO</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info & Actions */}
                <div className="w-full flex items-center justify-between gap-4 mb-4">
                    <div className="flex flex-col flex-1 min-w-0">
                        <h1 className="text-2xl md:text-3xl font-black text-white leading-none tracking-tight mb-2 truncate drop-shadow-lg">
                            {display.title}
                        </h1>
                        <p className={cn("text-lg font-medium tracking-tight truncate", isRadio ? "bg-ekko-500/20 text-ekko-400 px-2 py-0.5 rounded-full self-start text-sm uppercase font-black" : "text-neutral-400")}>
                            {display.artist}
                        </p>
                    </div>

                    {!isRadio && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleLike.mutate(display.id)}
                            className={cn(
                                "h-12 w-12 rounded-full transition-all active:scale-75",
                                liked ? "text-ekko-400 animate-heart-pop" : "text-white/40 hover:text-white"
                            )}
                        >
                            <Heart className={cn("w-7 h-7", liked ? "fill-current" : "")} />
                        </Button>
                    )}
                </div>

                {/* Minimalist Line Visualizer */}
                <div className="w-full h-12 flex items-center justify-center gap-[3px] mb-8 overflow-hidden">
                    {[...Array(32)].map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-[2px] bg-white/40 rounded-full transition-all duration-300",
                                isPlaying ? "animate-audio-line" : "h-1"
                            )}
                            style={{
                                height: isPlaying ? `${Math.random() * 80 + 20}%` : '4px',
                                animationDelay: `${i * 0.05}s`,
                                animationDuration: `${0.4 + Math.random() * 0.6}s`
                            }}
                        />
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="w-full mb-10 group px-2">
                    <Slider
                        value={sliderValue}
                        max={duration || 100}
                        step={1}
                        onValueChange={(val) => {
                            if (isRadio) return
                            setIsDragging(true)
                            setSliderValue(val)
                        }}
                        onValueCommit={(val) => {
                            if (isRadio) return
                            setIsDragging(false)
                            usePlayer.getState().requestSeek(val[0])
                        }}
                        className={cn("w-full py-4", isRadio ? "cursor-default opacity-50" : "hover:cursor-pointer")}
                        disabled={isRadio}
                    />
                    <div className="flex justify-between text-[10px] font-black text-white/40 font-mono tracking-widest mt-1">
                        <span>{formatTime(sliderValue[0])}</span>
                        <span>{formatTime(isRadio ? 0 : duration)}</span>
                    </div>
                </div>

                {/* Playback Controls */}
                <div className="w-full flex items-center justify-between max-w-sm mx-auto mb-8 px-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleShuffle}
                        className={cn(
                            "text-white/30 hover:text-white transition-all active:scale-90",
                            shuffle && "text-ekko-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]",
                            isRadio && "opacity-0 pointer-events-none"
                        )}
                    >
                        <Shuffle className="w-5 h-5" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={prev}
                        className="text-white hover:text-neutral-300 active:scale-75 transition-transform"
                    >
                        <SkipBack className="w-8 h-8 fill-current" />
                    </Button>

                    <Button
                        size="icon"
                        onClick={isPlaying ? pause : play}
                        className={cn(
                            "h-20 w-20 rounded-full bg-white text-black hover:scale-105 active:scale-95 transition-all shadow-2xl hover:bg-neutral-200 ring-4 ring-white/10",
                            isRadio && "bg-ekko-500 hover:bg-ekko-400 text-white shadow-ekko-500/20 ring-ekko-500/10"
                        )}
                    >
                        {isPlaying ? (
                            <Pause className="h-9 w-9 fill-current" />
                        ) : (
                            <Play className="h-9 w-9 fill-current ml-1" />
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={next}
                        className="text-white hover:text-neutral-300 active:scale-75 transition-transform"
                    >
                        <SkipForward className="w-8 h-8 fill-current" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={cycleRepeat}
                        className={cn(
                            "text-white/30 hover:text-white transition-all active:scale-90 relative",
                            repeat !== 'off' && "text-ekko-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]",
                            isRadio && "opacity-0 pointer-events-none"
                        )}
                    >
                        <Repeat className="w-5 h-5" />
                        {repeat === 'one' && <span className="absolute -top-1 -right-1 text-[8px] font-black bg-ekko-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center">1</span>}
                    </Button>
                </div>

                {/* Bottom Actions */}
                <div className="w-full flex items-center justify-between px-4 pb-4">
                    <div className="flex items-center gap-1">
                        <SleepTimer />
                        <Button variant="ghost" size="icon" onClick={() => setShowEQ(true)} className="h-8 w-8 text-white/40 hover:text-white active:scale-90 rounded-full" title="Equalizer">
                            <SlidersHorizontal className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowLyrics(!showLyrics)}
                            className={cn("h-8 w-8 rounded-full active:scale-90", showLyrics ? "text-ekko-400 bg-ekko-500/10" : "text-white/40 hover:text-white")}
                            title="Lyrics"
                        >
                            <Mic2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Lyrics Overlay */}
                {showLyrics && (
                    <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-xl flex items-center justify-center">
                        <Button variant="ghost" size="icon" onClick={() => setShowLyrics(false)} className="absolute top-12 right-6 text-white/60 hover:text-white rounded-full h-10 w-10">
                            <ChevronDown className="w-6 h-6" />
                        </Button>
                        <LyricsView songTitle={display.title} artist={display.artist} />
                    </div>
                )}
            </div>

            <Equalizer open={showEQ} onClose={() => setShowEQ(false)} />
        </div>
    )
}
