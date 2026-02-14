"use client"

import { usePlayer } from "@/store/player-store"
import { useVibeStore } from "@/store/vibe-store"

export function VibeHeatmap() {
    const { vibes } = useVibeStore()
    const { duration, isRadio } = usePlayer()

    if (isRadio || !duration || vibes.length === 0) return null

    // Create buckets for the heatmap (e.g., every 2% of the song)
    const buckets = new Array(50).fill(0)

    vibes.forEach(v => {
        const percentage = (v.timestamp / duration) * 100
        const bucketIndex = Math.floor(percentage / 2)
        if (bucketIndex >= 0 && bucketIndex < 50) {
            buckets[bucketIndex]++
        }
    })

    const maxDensity = Math.max(...buckets, 1) // Avoid divide by zero

    return (
        <div className="absolute inset-0 pointer-events-none flex items-end opacity-50">
            {buckets.map((count, i) => (
                <div
                    key={i}
                    className="flex-1 bg-purple-500 blur-[2px] rounded-t-sm transition-all duration-1000"
                    style={{
                        height: `${(count / maxDensity) * 100}%`,
                        opacity: count > 0 ? 0.4 : 0
                    }}
                />
            ))}
        </div>
    )
}
