"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Loader2, Radio, Music, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { usePlayer } from "@/store/player-store" // Import player store for local metadata

type AggregatedVibe = {
    song_id: string
    song_title: string
    song_artist: string
    song_cover?: string
    total_vibes: number
    emoji_counts: Record<string, number>
    dominant_emoji?: string
    last_activity: number
    recent_message?: string
}

export function VibeStatsView() {
    const [stats, setStats] = useState<AggregatedVibe[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Access local queue directly to resolve metadata for local songs
    // We use getState() inside the effect or just use the hook, hook is safer for reactivity but here we just need a snapshot on load usually.
    // However, if the user navigates here, the store should be populated.
    const { queue } = usePlayer()

    useEffect(() => {
        const loadStats = async () => {
            setIsLoading(true)
            const supabase = createClient()
            const aggregator = new Map<string, AggregatedVibe>()

            // Helper to process a vibe
            const processVibe = (v: any) => {
                const songId = v.song_id || "unknown"

                if (!aggregator.has(songId)) {
                    // Initialize with default values. We will try to resolve metadata later.
                    aggregator.set(songId, {
                        song_id: songId,
                        song_title: songId === "demo-radio" ? "Live Radio" : "Unknown Song",
                        song_artist: songId === "demo-radio" ? "Ekko FM" : "Unknown Artist",
                        total_vibes: 0,
                        emoji_counts: {},
                        last_activity: 0
                    })
                }

                const agg = aggregator.get(songId)!
                agg.total_vibes += 1

                // Emoji count
                if (v.emoji) {
                    agg.emoji_counts[v.emoji] = (agg.emoji_counts[v.emoji] || 0) + 1
                }

                // Capture most recent text message
                if (v.text && !agg.recent_message) {
                    agg.recent_message = v.text
                }

                // Activity
                const time = new Date(v.created_at).getTime()
                if (time > agg.last_activity) agg.last_activity = time
            }

            try {
                // 1. Fetch DB Vibes
                const { data: dbVibes } = await supabase
                    .from('vibes')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(100)

                if (dbVibes) {
                    dbVibes.forEach(processVibe)
                }

                // 2. Fetch Local Vibes
                try {
                    const localVibesRaw = JSON.parse(localStorage.getItem('ekko_local_vibes') || '[]')
                    // Sort local vibes descending to capture recent messages correctly
                    localVibesRaw.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    localVibesRaw.forEach(processVibe)
                } catch (_e) {
                    console.error("Error loading local vibes", _e)
                }

                // 3. Resolve Metadata (DB + Local Fallback)
                const songIds = Array.from(aggregator.keys()).filter(id => id !== "demo-radio" && id !== "unknown")

                // 3a. Try fetching from Supabase first
                if (songIds.length > 0) {
                    const { data: songData } = await supabase
                        .from('songs')
                        .select('id, title, artist, cover_url')
                        .in('id', songIds)

                    if (songData) {
                        songData.forEach(song => {
                            const agg = aggregator.get(song.id)
                            if (agg) {
                                agg.song_title = song.title
                                agg.song_artist = song.artist
                                agg.song_cover = song.cover_url
                            }
                        })
                    }
                }

                // 3b. Local Fallback for remaining "Unknown" songs
                // Iterate through the aggregator to find still-unknown songs
                aggregator.forEach((agg) => {
                    if (agg.song_title === "Unknown Song" && agg.song_id !== "unknown") {
                        // Try to find in local queue
                        const localSong = queue.find(s => s.id === agg.song_id)
                        if (localSong) {
                            agg.song_title = localSong.title
                            agg.song_artist = localSong.artist
                            agg.song_cover = localSong.coverUrl
                        }
                    }
                })

                // 4. Calculate Dominant Emoji & Final Sort
                const result = Array.from(aggregator.values()).map(agg => {
                    let maxCount = 0
                    let dominant = "🎵" // Default
                    Object.entries(agg.emoji_counts).forEach(([emoji, count]) => {
                        if (count > maxCount) {
                            maxCount = count
                            dominant = emoji
                        }
                    })
                    return { ...agg, dominant_emoji: dominant }
                }).sort((a, b) => b.last_activity - a.last_activity)

                setStats(result)

            } catch (_e) {
                console.error("Error aggregating stats:", _e)
            } finally {
                setIsLoading(false)
            }
        }

        loadStats()
    }, [queue]) // Re-run if queue changes (e.g. first load)

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
        )
    }

    return (
        <div className="p-6 pb-32 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-white tracking-tighter">
                    Vibe Stream
                </h1>
                <p className="text-neutral-400 mt-2">Global community pulse.</p>
            </motion.div>

            {stats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-neutral-600">
                    <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                    <p>No vibes detected yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <AnimatePresence>
                        {stats.map((stat, i) => (
                            <VibeTile key={stat.song_id} stat={stat} index={i} />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    )
}

function VibeTile({ stat, index }: { stat: AggregatedVibe, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 cursor-pointer shadow-lg hover:shadow-purple-500/20 transition-transform duration-500 hover:-translate-y-2 hover:z-10"
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                {stat.song_cover ? (
                    <Image
                        src={stat.song_cover}
                        alt={stat.song_title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                        unoptimized
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                        {stat.song_id === "demo-radio" ? <Radio className="w-12 h-12 text-neutral-700" /> : <Music className="w-12 h-12 text-neutral-700" />}
                    </div>
                )}
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Content Centered - Dominant Vibe is the Hero */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">

                {/* Glowing Dominant Emoji */}
                <div className="relative flex flex-col items-center gap-2">
                    <div className="text-7xl drop-shadow-[0_0_35px_rgba(168,85,247,0.8)] transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 ease-out-back relative z-10">
                        {stat.dominant_emoji}
                    </div>
                    {/* Minimalist Count Badge */}
                    <span className="text-xs font-black tracking-widest text-purple-200/80 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 backdrop-blur-sm group-hover:bg-purple-500/30 transition-colors">
                        {stat.total_vibes}
                    </span>
                </div>

                {/* Optional: Recent Message Tooltip-ish thing on hover */}
                {stat.recent_message && (
                    <div className="absolute translate-y-20 opacity-0 group-hover:opacity-100 group-hover:translate-y-16 transition-all duration-500 text-center px-4 w-full">
                        <p className="text-[10px] text-white/90 font-medium bg-black/60 backdrop-blur-md px-3 py-2 rounded-xl border border-white/5 line-clamp-2 shadow-xl italic leading-relaxed">
                            &quot;{stat.recent_message}&quot;
                        </p>
                    </div>
                )}
            </div>

            {/* Footer Metadata - Initially Hidden or Minimal, reveals on hover */}
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-bold truncate text-lg leading-tight group-hover:text-purple-300 transition-colors drop-shadow-md">
                    {stat.song_title}
                </h3>
                <p className="text-neutral-400 text-xs truncate mt-0.5 group-hover:text-white/80 transition-colors">
                    {stat.song_artist}
                </p>
            </div>
        </motion.div>
    )
}
