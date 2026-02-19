'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePlayer } from '@/store/player-store'
import { Button } from '@/components/ui/button'
import { Timer, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const TIMER_OPTIONS = [
    { label: '5 min', minutes: 5 },
    { label: '15 min', minutes: 15 },
    { label: '30 min', minutes: 30 },
    { label: '45 min', minutes: 45 },
    { label: '1 hour', minutes: 60 },
]

export function SleepTimer() {
    const { pause } = usePlayer()
    const [open, setOpen] = useState(false)
    const [remaining, setRemaining] = useState<number | null>(null)
    const [endTime, setEndTime] = useState<number | null>(null)

    const startTimer = useCallback((minutes: number) => {
        const end = Date.now() + minutes * 60 * 1000
        setEndTime(end)
        setRemaining(minutes * 60)
        setOpen(false)
        toast.success(`Sleep timer set for ${minutes} minutes`)
    }, [])

    const cancelTimer = useCallback(() => {
        setEndTime(null)
        setRemaining(null)
        toast.info('Sleep timer cancelled')
    }, [])

    useEffect(() => {
        if (!endTime) return

        const interval = setInterval(() => {
            const left = Math.max(0, Math.round((endTime - Date.now()) / 1000))
            setRemaining(left)

            if (left <= 0) {
                pause()
                setEndTime(null)
                setRemaining(null)
                toast.info('Sleep timer ended — music paused')
                clearInterval(interval)
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [endTime, pause])

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                className={cn(
                    "h-8 w-8 rounded-full transition-all",
                    remaining ? "text-ekko-400 bg-ekko-500/10" : "text-neutral-500 hover:text-white hover:bg-white/5"
                )}
                onClick={() => setOpen(!open)}
                title="Sleep Timer"
            >
                <Timer className="w-4 h-4" />
            </Button>

            {remaining !== null && (
                <span className="absolute -top-1 -right-1 text-[9px] font-mono font-bold text-ekko-400 bg-ekko-500/20 rounded px-0.5">
                    {formatTime(remaining)}
                </span>
            )}

            {open && (
                <>
                    <div className="fixed inset-0 z-50" onClick={() => setOpen(false)} />
                    <div className="absolute bottom-full right-0 mb-2 z-50 w-48 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-none shadow-2xl p-2 space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 px-2 pt-1 pb-2">
                            Sleep Timer
                        </p>
                        {remaining !== null && (
                            <button
                                onClick={cancelTimer}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-none text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                                Cancel ({formatTime(remaining)})
                            </button>
                        )}
                        {TIMER_OPTIONS.map((opt) => (
                            <button
                                key={opt.minutes}
                                onClick={() => startTimer(opt.minutes)}
                                className="w-full text-left px-3 py-2 rounded-none text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
