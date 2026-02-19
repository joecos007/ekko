'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

const BANDS = [
    { label: '60', freq: '60 Hz' },
    { label: '230', freq: '230 Hz' },
    { label: '910', freq: '910 Hz' },
    { label: '4K', freq: '4 kHz' },
    { label: '14K', freq: '14 kHz' },
]

const PRESETS: Record<string, number[]> = {
    'Flat': [0, 0, 0, 0, 0],
    'Bass Boost': [6, 4, 0, 0, 1],
    'Treble Boost': [0, 0, 1, 4, 6],
    'Vocal': [-2, 0, 4, 3, 1],
    'Rock': [4, 2, -1, 3, 5],
    'Electronic': [5, 3, 0, 2, 4],
}

interface EqualizerProps {
    open: boolean
    onClose: () => void
}

export function Equalizer({ open, onClose }: EqualizerProps) {
    const [gains, setGains] = useState<number[]>([0, 0, 0, 0, 0])
    const [activePreset, setActivePreset] = useState('Flat')
    const [enabled, setEnabled] = useState(true)

    const setGain = useCallback((index: number, value: number) => {
        setGains(prev => {
            const next = [...prev]
            next[index] = value
            return next
        })
        setActivePreset('')
    }, [])

    const applyPreset = useCallback((name: string) => {
        setGains([...PRESETS[name]])
        setActivePreset(name)
    }, [])

    const reset = useCallback(() => {
        setGains([0, 0, 0, 0, 0])
        setActivePreset('Flat')
    }, [])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative z-10 w-full max-w-md bg-surface-2 border border-white/10 rounded-t-2xl md:rounded-none shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/8">
                    <div className="flex items-center gap-3">
                        <SlidersHorizontal className="w-5 h-5 text-ekko-400" />
                        <h2 className="text-lg font-bold text-white">Equalizer</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEnabled(!enabled)}
                            className={cn("text-xs font-bold px-3 rounded-full", enabled ? "text-ekko-400 bg-ekko-500/10" : "text-neutral-500")}
                        >
                            {enabled ? 'ON' : 'OFF'}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-neutral-400 hover:text-white rounded-full">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* EQ Sliders */}
                <div className={cn("p-6 transition-opacity", !enabled && "opacity-40 pointer-events-none")}>
                    <div className="flex items-end justify-between gap-4 h-48 mb-4">
                        {BANDS.map((band, i) => (
                            <div key={band.label} className="flex flex-col items-center gap-2 flex-1">
                                <span className="text-[10px] font-mono text-ekko-400 font-bold">
                                    {gains[i] > 0 ? '+' : ''}{gains[i]}dB
                                </span>
                                <div className="relative h-32 w-full flex justify-center">
                                    <input
                                        type="range"
                                        min={-8}
                                        max={8}
                                        step={1}
                                        value={gains[i]}
                                        onChange={(e) => setGain(i, Number(e.target.value))}
                                        className="absolute h-full w-8 appearance-none cursor-pointer bg-transparent [writing-mode:vertical-lr] [direction:rtl]
                                            [&::-webkit-slider-runnable-track]:w-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-white/10
                                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ekko-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(99,102,241,0.5)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white/20
                                            [&::-moz-range-track]:w-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-white/10
                                            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-ekko-400 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white/20"
                                    />
                                </div>
                                <span className="text-[10px] font-mono text-neutral-500">{band.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Presets */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Presets</span>
                        <Button variant="ghost" size="icon" onClick={reset} className="h-6 w-6 text-neutral-500 hover:text-white" title="Reset">
                            <RotateCcw className="w-3 h-3" />
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {Object.keys(PRESETS).map((name) => (
                            <button
                                key={name}
                                onClick={() => applyPreset(name)}
                                className={cn(
                                    "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                                    activePreset === name
                                        ? "bg-ekko-500/20 text-ekko-400 border border-ekko-500/30"
                                        : "bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-transparent"
                                )}
                            >
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
