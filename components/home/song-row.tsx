'use client'

import Image from "next/image"
import { Play, Pause, MoreHorizontal, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePlayer } from "@/store/player-store"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { MediaItemActionMenu } from "@/components/media/media-item-action-menu"

interface Song {
    id: string
    title: string
    artist: string
    coverUrl: string
    audioUrl: string
    duration: number
    isSpecial?: boolean
}

interface SongRowProps {
    title: string
    songs: Song[]
}

export function SongRow({ title, songs }: SongRowProps) {
    const { isPlaying, queue, currentIndex, togglePlay, setQueue } = usePlayer()
    const currentSong = queue[currentIndex]

    if (!songs || songs.length === 0) return null

    return (
        <section className="mb-8">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{title}</h2>
                <Button variant="link" className="text-neutral-400 hover:text-white text-xs font-bold uppercase tracking-wider">
                    See All
                </Button>
            </div>

            <ScrollArea className="w-full whitespace-nowrap pb-4">
                <div className="flex w-max space-x-4">
                    {songs.map((song, i) => {
                        // We need to find the correct index in the global queue context or handle local queue
                        // For simplicity here, we assuming we play from this list
                        const isCurrentSong = currentSong?.id === song.id

                        return (
                            <div
                                key={song.id}
                                className="group relative w-[160px] md:w-[180px] cursor-pointer"
                                onClick={() => setQueue(songs, i)}
                            >
                                <div className="relative aspect-square w-full overflow-hidden rounded-none bg-neutral-800 mb-3 shadow-lg group-hover:shadow-xl transition-all">
                                    <Image
                                        src={song.coverUrl}
                                        alt={song.title}
                                        fill
                                        className={cn(
                                            "object-cover transition-transform duration-500 group-hover:scale-105",
                                            isCurrentSong && isPlaying ? "opacity-60" : ""
                                        )}
                                        unoptimized
                                    />

                                    <div className={cn(
                                        "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2",
                                        isCurrentSong ? "opacity-100 bg-black/40" : ""
                                    )}>
                                        <Button
                                            size="icon"
                                            className="rounded-full bg-ekko-500 hover:bg-ekko-400 text-white w-10 h-10 shadow-lg translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (isCurrentSong) {
                                                    togglePlay()
                                                } else {
                                                    setQueue(songs, i)
                                                }
                                            }}
                                        >
                                            {isCurrentSong && isPlaying ? (
                                                <Pause className="fill-white w-4 h-4" />
                                            ) : (
                                                <Play className="fill-white w-4 h-4 ml-0.5" />
                                            )}
                                        </Button>
                                    </div>
                                    {song.isSpecial && (
                                        <div className="absolute top-2 left-2 bg-ekko-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                            SPECIAL
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-0.5">
                                    <h3 className={cn(
                                        "font-semibold text-white truncate text-sm md:text-base",
                                        isCurrentSong ? "text-ekko-400" : ""
                                    )}>
                                        {song.title}
                                    </h3>
                                    <p className="text-xs md:text-sm text-neutral-400 truncate hover:underline cursor-pointer">{song.artist}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>
        </section>
    )
}
