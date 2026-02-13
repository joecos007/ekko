'use client'

import { usePlayer } from '@/store/player-store'
import { Slider } from '@/components/ui/slider'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ProgressBar() {
    const { currentTime, duration, setCurrentTime, isPlaying, isRadio } = usePlayer()
    const [localValue, setLocalValue] = useState<number[]>([0])
    const [isDragging, setIsDragging] = useState(false)

    // Sync local value with global state only if not dragging
    useEffect(() => {
        if (!isDragging) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLocalValue([currentTime])
        }
    }, [currentTime, isDragging])

    // Logic: while dragging, update local UI. On commit, update global state (which seeks audio).
    // Shadcn Slider onValueChange runs on drag. onValueCommit runs on release.

    const formatTime = (seconds: number) => {
        if (seconds === Infinity) return "LIVE"
        if (!seconds) return '0:00'
        const m = Math.floor(seconds / 60)
        const s = Math.floor(seconds % 60)
        return `${m}:${s < 10 ? '0' : ''}${s}`
    }

    return (
        <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-xs text-muted-foreground w-10 text-right tabular-nums">
                {formatTime(isRadio ? Infinity : (isDragging ? localValue[0] : currentTime))}
            </span>

            <Slider
                value={isRadio ? [100] : localValue}
                max={isRadio ? 100 : (duration || 100)}
                step={1}
                className={cn("flex-1 cursor-pointer", isRadio && "opacity-50 cursor-not-allowed")}
                disabled={isRadio}
                onValueChange={(val) => {
                    if (isRadio) return
                    setIsDragging(true)
                    setLocalValue(val)
                }}
                onValueCommit={(val) => {
                    if (isRadio) return
                    usePlayer.getState().requestSeek(val[0])
                    setIsDragging(false)
                }}
            />

            <span className="text-xs text-muted-foreground w-10 tabular-nums">
                {formatTime(duration)}
            </span>
        </div>
    )
}
