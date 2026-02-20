'use client'

import { usePlayer } from '@/store/player-store'
import { Button } from '@/components/ui/button'
import { ListMusic, Play, X } from 'lucide-react'
import Image from 'next/image'

import { ScrollArea } from '@/components/ui/scroll-area'

interface QueueViewProps {
    open: boolean
    onClose: () => void
}

export function QueueView({ open, onClose }: QueueViewProps) {
    const { queue, currentIndex, isPlaying, setQueue } = usePlayer()
    const currentSong = queue[currentIndex]
    const upNext = queue.slice(currentIndex + 1)
    const played = queue.slice(0, currentIndex)

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Panel */}
            <div className="relative z-10 w-full max-w-lg bg-surface-2 border border-white/10 rounded-t-2xl md:rounded-none shadow-2xl max-h-[80vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/8">
                    <div className="flex items-center gap-3">
                        <ListMusic className="w-5 h-5 text-ekko-400" />
                        <h2 className="text-lg font-bold text-white">Queue</h2>
                        <span className="text-xs text-neutral-500 font-mono">{queue.length} tracks</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-neutral-400 hover:text-white rounded-full">
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <ScrollArea className="flex-1 overflow-y-auto">
                    <div className="p-4 space-y-6">
                        {/* Now Playing */}
                        {currentSong && (
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-ekko-400 mb-3 px-1">Now Playing</h3>
                                <div className="flex items-center gap-3 p-3 rounded-none bg-ekko-500/10 border border-ekko-500/20">
                                    <div className="relative w-12 h-12 rounded-none overflow-hidden flex-shrink-0 shadow-lg">
                                        <Image src={currentSong.coverUrl || '/placeholder.png'} alt={currentSong.title} fill className="object-cover" unoptimized />
                                        {isPlaying && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                <div className="flex items-end gap-[2px] h-4">
                                                    <span className="w-[3px] bg-ekko-400 rounded-full animate-pulse" style={{ height: '60%' }} />
                                                    <span className="w-[3px] bg-ekko-400 rounded-full animate-pulse" style={{ height: '100%', animationDelay: '0.15s' }} />
                                                    <span className="w-[3px] bg-ekko-400 rounded-full animate-pulse" style={{ height: '40%', animationDelay: '0.3s' }} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-white truncate">{currentSong.title}</p>
                                        <p className="text-xs text-neutral-400 truncate">{currentSong.artist}</p>
                                    </div>
                                    <span className="text-xs font-mono text-neutral-500">
                                        {Math.floor(currentSong.duration / 60)}:{(currentSong.duration % 60).toString().padStart(2, '0')}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Up Next */}
                        {upNext.length > 0 && (
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-3 px-1">Up Next</h3>
                                <div className="space-y-1">
                                    {upNext.map((song, i) => (
                                        <div
                                            key={`${song.id}-${i}`}
                                            className="flex items-center gap-3 p-2.5 rounded-none hover:bg-white/5 transition-colors group cursor-pointer"
                                            onClick={() => setQueue(queue, currentIndex + 1 + i)}
                                        >
                                            <span className="text-xs font-mono text-neutral-600 w-5 text-right group-hover:hidden">{i + 1}</span>
                                            <Play className="w-3.5 h-3.5 text-ekko-400 hidden group-hover:block ml-0.5" />
                                            <div className="relative w-10 h-10 rounded-none overflow-hidden flex-shrink-0">
                                                <Image src={song.coverUrl || '/placeholder.png'} alt={song.title} fill className="object-cover" unoptimized />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white/80 truncate group-hover:text-white">{song.title}</p>
                                                <p className="text-xs text-neutral-500 truncate">{song.artist}</p>
                                            </div>
                                            <span className="text-xs font-mono text-neutral-600">
                                                {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Previously Played */}
                        {played.length > 0 && (
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 mb-3 px-1">Previously Played</h3>
                                <div className="space-y-1 opacity-60">
                                    {played.map((song, i) => (
                                        <div
                                            key={`played-${song.id}-${i}`}
                                            className="flex items-center gap-3 p-2.5 rounded-none hover:bg-white/5 transition-colors group cursor-pointer"
                                            onClick={() => setQueue(queue, i)}
                                        >
                                            <div className="relative w-10 h-10 rounded-none overflow-hidden flex-shrink-0">
                                                <Image src={song.coverUrl || '/placeholder.png'} alt={song.title} fill className="object-cover" unoptimized />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white/60 truncate group-hover:text-white/80">{song.title}</p>
                                                <p className="text-xs text-neutral-600 truncate">{song.artist}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {queue.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-neutral-600">
                                <ListMusic className="w-10 h-10 mb-3" />
                                <p className="text-sm font-medium">Queue is empty</p>
                                <p className="text-xs mt-1">Play a song to get started</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}
