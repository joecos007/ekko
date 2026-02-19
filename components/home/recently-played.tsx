'use client'

import Image from 'next/image'
import { Play, Pause } from 'lucide-react'
import { usePlayer } from '@/store/player-store'
import { MediaItemActionMenu } from '@/components/media/media-item-action-menu'

export function RecentlyPlayed({ songs }: { songs: any[] }) {
    const { isPlaying, queue, currentIndex, togglePlay, setQueue } = usePlayer()
    const currentSong = queue[currentIndex]

    // Show last 6 unique songs as "recently played" (simulated with available songs, reversed)
    const recentSongs = (songs || []).slice(0, 6)

    if (recentSongs.length === 0) return null

    return (
        <section className="mb-12 relative z-10">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black tracking-tight text-white/90 flex items-center gap-3">
                    <span className="bg-ekko-500 w-1.5 h-6 rounded-full" />
                    Recently Played
                </h2>
                <button className="text-xs font-bold text-white/40 hover:text-white/70 transition-colors uppercase tracking-widest">
                    See all
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {recentSongs.map((song) => {
                    const isCurrentlyPlaying = isPlaying && currentSong?.id === song.id

                    return (
                        <div
                            key={song.id}
                            className={`group flex items-center gap-4 glass-card rounded-none p-3 cursor-pointer transition-all duration-300 hover:bg-white/8 hover:scale-[1.01] border border-white/5 hover:border-white/10 ${isCurrentlyPlaying ? 'bg-ekko-500/10 border-ekko-500/30' : ''
                                }`}
                            onClick={() => setQueue(songs, songs.findIndex(s => s.id === song.id))}
                        >
                            {/* Album Art */}
                            <div className="relative w-14 h-14 rounded-none overflow-hidden bg-neutral-900 flex-shrink-0 shadow-lg">
                                <Image
                                    src={song.coverUrl}
                                    alt={song.title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                                {/* Play Overlay */}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {isCurrentlyPlaying ? (
                                        <Pause className="w-5 h-5 fill-white text-white" />
                                    ) : (
                                        <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
                                    )}
                                </div>
                            </div>

                            {/* Song Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className={`font-bold text-sm truncate ${isCurrentlyPlaying ? 'text-ekko-400' : 'text-white/90'}`}>
                                    {song.title}
                                </h4>
                                <p className="text-xs text-white/40 truncate font-medium mt-0.5">
                                    {song.artist}
                                </p>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (isCurrentlyPlaying) togglePlay()
                                        else setQueue(songs, songs.findIndex(s => s.id === song.id))
                                    }}
                                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                >
                                    {isCurrentlyPlaying ? (
                                        <Pause className="w-3.5 h-3.5 fill-white text-white" />
                                    ) : (
                                        <Play className="w-3.5 h-3.5 fill-white text-white translate-x-0.5" />
                                    )}
                                </button>
                                <div onClick={(e) => e.stopPropagation()}>
                                    <MediaItemActionMenu
                                        songId={song.id}
                                        songTitle={song.title}
                                        className="h-8 w-8 hover:bg-white/10 text-white/40 rounded-full transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
