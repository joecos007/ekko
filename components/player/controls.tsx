'use client'

import { usePlayer } from '@/store/player-store'
import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Controls() {
    const { isPlaying, play, pause, next, prev, shuffle, toggleShuffle, repeat, cycleRepeat } = usePlayer()

    return (
        <div className="flex items-center gap-4">
            <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 hidden md:inline-flex", shuffle ? "text-primary" : "text-muted-foreground")}
                onClick={toggleShuffle}
            >
                <Shuffle className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" onClick={prev} className="rounded-full h-10 w-10 hover:bg-neutral-800">
                <SkipBack className="h-5 w-5 fill-current" />
            </Button>

            <Button
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={isPlaying ? pause : play}
            >
                {isPlaying ? (
                    <Pause className="h-5 w-5 fill-current" />
                ) : (
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                )}
            </Button>

            <Button variant="ghost" size="icon" onClick={next} className="rounded-full h-10 w-10 hover:bg-neutral-800">
                <SkipForward className="h-5 w-5 fill-current" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 relative hidden md:inline-flex", repeat !== 'off' ? "text-primary" : "text-muted-foreground")}
                onClick={cycleRepeat}
            >
                <Repeat className="h-4 w-4" />
                {repeat === 'one' && (
                    <span className="absolute text-[10px] top-1.5 font-bold">1</span>
                )}
            </Button>
        </div>
    )
}
