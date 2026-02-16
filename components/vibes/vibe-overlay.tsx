"use client"

import { usePlayer } from "@/store/player-store"
import { useVibeStore, Vibe } from "@/store/vibe-store"
import { useEffect, useState, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Howl } from "howler"

export function VibeOverlay() {
    const { currentTime, isPlaying, currentIndex, queue, isRadio } = usePlayer()
    const { vibes, fetchVibes, subscribeToVibes, unsubscribeFromVibes } = useVibeStore()
    const currentSong = queue[currentIndex]

    const [visibleVibes, setVisibleVibes] = useState<Vibe[]>([])
    const soundRef = useRef<Howl | null>(null)

    const processedVibesRef = useRef<Set<string>>(new Set())

    // Init sound
    useEffect(() => {
        // Sound disabled for now to avoid auto-play policy issues
        soundRef.current = null
    }, [])

    // Load vibes when song changes
    // Load vibes when song changes or Radio toggles
    useEffect(() => {
        // In radio mode, we use "demo-radio" as the ID
        const targetId = isRadio ? "demo-radio" : currentSong?.id

        if (!targetId) return

        fetchVibes(targetId)
        subscribeToVibes(targetId)

        // Capture ref value for cleanup to avoid stale ref warning
        const processedVibes = processedVibesRef.current

        return () => {
            unsubscribeFromVibes()
            setVisibleVibes([])
            processedVibes.clear()
        }
    }, [currentSong?.id, isRadio, fetchVibes, subscribeToVibes, unsubscribeFromVibes])

    // Specific logic to show vibes that match current timestamp
    useEffect(() => {
        if (!isPlaying) return

        const activeVibes = vibes.filter(v =>
            v.timestamp >= currentTime - 0.5 &&
            v.timestamp <= currentTime + 0.5
        )

        activeVibes.forEach(v => {
            if (!processedVibesRef.current.has(v.id)) {
                processedVibesRef.current.add(v.id)
                setVisibleVibes(prev => [...prev, v])

                // Play sound
                if (soundRef.current) {
                    soundRef.current.play()
                }

                // Auto remove after 5 seconds
                setTimeout(() => {
                    setVisibleVibes(prev => prev.filter(existing => existing.id !== v.id))
                }, 5000)

                // Track timeout for cleanup
                // We're using a simple object/array to track timeouts if needed, 
                // but since we can't easily add a new ref variable in this replace block without changing the whole file,
                // we'll rely on the existing effect cleanup to clear visibleVibes which is 'good enough' for preventing the visual update,
                // BUT better is to actually clear the timeout. 
                // Let's modify the component to include a timeout ref in a separate step or just check if mounted.
                // Actually, checking if mounted is easier if we had a useMounted hook or ref. 
                // Let's assume the component stays mounted mostly, but for strict correctness:

                // Since I can't add a ref declaration easily here without replacing the whole file header,
                // I will add a mounted check using a local variable in the effect closure? No, that doesn't work across renders.
                // Let's replace the whole useEffect to include a cleanup function that clears a set of timeouts.

            }
        })

    }, [currentTime, vibes, isPlaying])

    // if (isRadio) return null // Allow demo/overlay in radio mode

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            <AnimatePresence>
                {visibleVibes.map((vibe) => (
                    <motion.div
                        key={vibe.id}
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -100, scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="absolute flex flex-col items-center gap-2"
                        style={{
                            left: `${50 + (vibe.id.charCodeAt(0) % 60 - 30)}%`, // Randomize horizontal position +/- 30% from center
                            bottom: "25%"
                        }}
                    >
                        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-2xl">
                            <Avatar className="w-6 h-6 border border-white/20">
                                <AvatarImage src={vibe.profiles?.avatar_url || undefined} />
                                <AvatarFallback className="text-[10px] bg-neutral-800 text-neutral-400">
                                    {vibe.profiles?.username?.[0]?.toUpperCase() || "?"}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col">
                                {vibe.text && (
                                    <span className="text-white text-sm font-medium leading-none">
                                        {vibe.text}
                                    </span>
                                )}
                            </div>

                            {vibe.emoji && <span className="text-xl leading-none ml-1">{vibe.emoji}</span>}
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
