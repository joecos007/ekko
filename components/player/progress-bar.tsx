'use client'

import { usePlayer } from '@/store/player-store'
import { Slider } from '@/components/ui/slider'
import { useEffect, useState } from 'react'

export function ProgressBar() {
    const { currentTime, duration, setCurrentTime, isPlaying } = usePlayer()
    const [localValue, setLocalValue] = useState<number[]>([0])
    const [isDragging, setIsDragging] = useState(false)

    // Sync local value with global state only if not dragging
    useEffect(() => {
        if (!isDragging) {
            setLocalValue([currentTime])
        }
    }, [currentTime, isDragging])

    // Logic: while dragging, update local UI. On commit, update global state (which seeks audio).
    // Shadcn Slider onValueChange runs on drag. onValueCommit runs on release.

    const formatTime = (seconds: number) => {
        if (!seconds) return '0:00'
        const m = Math.floor(seconds / 60)
        const s = Math.floor(seconds % 60)
        return `${m}:${s < 10 ? '0' : ''}${s}`
    }

    return (
        <div className="flex items-center gap-2 w-full max-w-md">
            <span className="text-xs text-muted-foreground w-10 text-right tabular-nums">
                {formatTime(isDragging ? localValue[0] : currentTime)}
            </span>

            <Slider
                value={localValue}
                max={duration || 100}
                step={1}
                className="flex-1 cursor-pointer"
                onValueChange={(val) => {
                    setIsDragging(true)
                    setLocalValue(val)
                }}
                onValueCommit={(val) => {
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
