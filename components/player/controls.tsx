'use client'

import { usePlayer } from '@/store/player-store'
import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward, Shuffle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Controls() {
    const { isPlaying, play, pause, next, prev, toggleShuffle, shuffle, isRadio, toggleRadio, retryRadio, isLoading, radioError } = usePlayer()

    return (
        <div className="flex items-center gap-3">
            <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 hidden md:inline-flex transition-all", isRadio ? "opacity-40 cursor-not-allowed" : (shuffle ? "text-ekko-400 hover:text-ekko-300" : "text-neutral-400 hover:text-white"))}
                onClick={isRadio ? undefined : toggleShuffle}
                disabled={isRadio}
                title={shuffle ? "Shuffle On" : "Shuffle Off"}
                aria-label="Toggle Shuffle"
            >
                <Shuffle className="h-[18px] w-[18px]" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={prev}
                className="rounded-full h-9 w-9 text-neutral-300 hover:text-white hover:bg-white/10 active:bg-white/15 disabled:opacity-30 transition-all"
                title="Previous (←)"
                aria-label="Previous Track"
            >
                <SkipBack className="h-5 w-5 fill-current" />
            </Button>

            <Button
                size="icon"
                className={cn(
                    "h-10 w-10 rounded-full shadow-xl transition-all duration-200 hover:scale-105 active:scale-100",
                    isRadio
                        ? "bg-ekko-500 hover:bg-ekko-400 shadow-ekko-500/40"
                        : "bg-white hover:bg-white/90 text-black shadow-white/20"
                )}
                onClick={isPlaying ? pause : play}
                disabled={isLoading}
                title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                aria-label={isPlaying ? "Pause" : "Play"}
            >
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : isPlaying ? (
                    <Pause className="h-5 w-5 fill-current" />
                ) : (
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                )}
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={next}
                className="rounded-full h-9 w-9 text-neutral-300 hover:text-white hover:bg-white/10 active:bg-white/15 disabled:opacity-30 transition-all"
                title="Next (→)"
                aria-label="Next Track"
            >
                <SkipForward className="h-5 w-5 fill-current" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 relative hidden md:inline-flex transition-all",
                    radioError ? "text-red-400 bg-red-500/10 hover:bg-red-500/15" :
                        isRadio ? "text-ekko-400 bg-ekko-500/10 hover:bg-ekko-500/15" : "text-neutral-400 hover:text-white")}
                onClick={radioError ? retryRadio : toggleRadio}
                title={radioError ? "Retry Live Radio" : "Toggle Live Radio"}
                aria-label={radioError ? "Retry Live Radio" : "Toggle Live Radio"}
            >
                <div className={cn("absolute inset-0 rounded-full border border-current opacity-20", isRadio && !radioError && "animate-ping")} />
                <span className={cn("text-[10px] font-bold tracking-tight",
                    radioError ? "text-red-400" :
                        isRadio ? "text-ekko-400" : "text-neutral-500")}>{radioError ? 'RETRY' : 'LIVE'}</span>
            </Button>
        </div>
    )
}
