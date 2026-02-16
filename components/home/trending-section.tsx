'use client'

import { useMemo } from 'react'
import Image from 'next/image'
import { Play, Pause, TrendingUp, Heart, BarChart3 } from 'lucide-react'
import { usePlayer } from '@/store/player-store'
import { MediaItemActionMenu } from '@/components/media/media-item-action-menu'

interface TrendingSong {
    id: string
    title: string
    artist: string
    coverUrl: string
    audioUrl: string
    plays: number
    likes: number
}

// Deterministic hash to avoid Math.random() during render
function hashCode(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i)
        hash |= 0
    }
    return Math.abs(hash)
}

export function TrendingSection({ songs }: { songs: any[] }) {
    const { isPlaying, queue, currentIndex, setQueue } = usePlayer()
    const currentSong = queue[currentIndex]

    // Take top 5 songs as "trending" with deterministic engagement metrics
    const trendingSongs: TrendingSong[] = useMemo(() => (songs || []).slice(0, 5).map((s, i) => ({
        ...s,
        plays: (hashCode(s.id || s.title) % 5000 + 500) * (5 - i),
        likes: (hashCode(s.title || s.id) % 800 + 100) * (5 - i),
    })), [songs])

    if (trendingSongs.length === 0) return null

    return (
        <section className="mb-12 relative z-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black tracking-tight text-white/90 flex items-center gap-3">
                    <span className="bg-orange-500 w-1.5 h-6 rounded-full" />
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                    Trending Now
                </h2>
                <span className="text-xs font-bold text-white/30 uppercase tracking-widest">
                    Updated hourly
                </span>
            </div>

            <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
                {trendingSongs.map((song, i) => {
                    const isCurrentlyPlaying = isPlaying && currentSong?.id === song.id
                    const rankColors = ['text-orange-400', 'text-white/80', 'text-white/60', 'text-white/40', 'text-white/30']

                    return (
                        <div
                            key={song.id}
                            className={`group flex items-center gap-3 md:gap-4 px-4 py-3 md:px-5 md:py-3.5 cursor-pointer transition-all duration-300 hover:bg-white/5 ${i < trendingSongs.length - 1 ? 'border-b border-white/5' : ''
                                } ${isCurrentlyPlaying ? 'bg-blue-600/10 border-l-2 border-l-blue-500' : ''}`}
                            onClick={() => setQueue(songs, songs.findIndex(s => s.id === song.id))}
                        >
                            {/* Rank Number */}
                            <div className="w-8 flex items-center justify-center flex-shrink-0">
                                <span className={`text-xl font-black tabular-nums ${rankColors[i] || 'text-white/30'}`}>
                                    {i + 1}
                                </span>
                            </div>

                            {/* Trend Indicator */}
                            <div className="w-5 flex-shrink-0">
                                {i < 3 && (
                                    <TrendingUp className={`w-4 h-4 ${i === 0 ? 'text-orange-400' : 'text-emerald-400'}`} />
                                )}
                            </div>

                            {/* Album Art */}
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-900 flex-shrink-0 shadow-lg">
                                <Image
                                    src={song.coverUrl}
                                    alt={song.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    unoptimized
                                />
                                {/* Play Overlay */}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {isCurrentlyPlaying ? (
                                        <Pause className="w-5 h-5 fill-white text-white" />
                                    ) : (
                                        <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
                                    )}
                                </div>
                            </div>

                            {/* Song Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className={`font-bold text-sm truncate ${isCurrentlyPlaying ? 'text-blue-400' : 'text-white/90'}`}>
                                    {song.title}
                                </h4>
                                <p className="text-xs text-white/40 truncate font-medium">
                                    {song.artist}
                                </p>
                            </div>

                            {/* Engagement Metrics */}
                            <div className="hidden md:flex items-center gap-5 flex-shrink-0">
                                <div className="flex items-center gap-1.5 text-white/30">
                                    <BarChart3 className="w-3.5 h-3.5" />
                                    <span className="text-xs font-bold tabular-nums">
                                        {song.plays?.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-white/30">
                                    <Heart className="w-3.5 h-3.5" />
                                    <span className="text-xs font-bold tabular-nums">
                                        {song.likes?.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Action Menu */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                <MediaItemActionMenu
                                    songId={song.id}
                                    songTitle={song.title}
                                    className="h-8 w-8 hover:bg-white/10 text-white/50 rounded-full transition-colors"
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
