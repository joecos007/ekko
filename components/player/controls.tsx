'use client'

import { usePlayer } from '@/store/player-store'
import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Controls() {
    const { isPlaying, play, pause, next, prev, shuffle, toggleShuffle, repeat, cycleRepeat, isRadio, toggleRadio } = usePlayer()

    return (
        <div className="flex items-center gap-4">
            <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 hidden md:inline-flex", isRadio ? "opacity-50 cursor-not-allowed" : (shuffle ? "text-primary" : "text-muted-foreground"))}
                onClick={isRadio ? undefined : toggleShuffle}
                disabled={isRadio}
            >
                <Shuffle className="h-4 w-4" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={prev}
                className="rounded-full h-10 w-10 hover:bg-neutral-800 disabled:opacity-30"
            >
                <SkipBack className="h-5 w-5 fill-current" />
            </Button>

            <Button
                size="icon"
                className={cn(
                    "h-12 w-12 rounded-full shadow-lg transition-all duration-300 hover:scale-110",
                    isRadio
                        ? "bg-red-500 hover:bg-red-600 shadow-red-500/20"
                        : "bg-blue-600 hover:bg-blue-500 shadow-blue-500/40"
                )}
                onClick={isPlaying ? pause : play}
            >
                {isPlaying ? (
                    <Pause className="h-6 w-6 fill-current" />
                ) : (
                    <Play className="h-6 w-6 fill-current ml-1" />
                )}
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={next}
                className="rounded-full h-10 w-10 hover:bg-neutral-800 disabled:opacity-30"
            >
                <SkipForward className="h-5 w-5 fill-current" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 relative hidden md:inline-flex", isRadio ? "text-red-500 bg-red-500/10" : "text-muted-foreground hover:text-white")}
                onClick={toggleRadio}
                title="Toggle Live Radio"
            >
                <div className={cn("absolute inset-0 rounded-full border border-current opacity-20", isRadio && "animate-ping")} />
                <span className={cn("text-[10px] font-bold", isRadio ? "text-red-500" : "text-neutral-500")}>LIVE</span>
            </Button>
        </div>
    )
}
