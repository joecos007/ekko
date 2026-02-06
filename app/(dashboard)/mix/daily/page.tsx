'use client'

import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { usePlayer } from "@/store/player-store"
import { Button } from "@/components/ui/button"
import { Clock, Play, Sparkles } from "lucide-react"
import { MediaItemActionMenu } from "@/components/media/media-item-action-menu"
import { getCoverArt, PLAYLIST_COVERS } from "@/lib/cover-art"

export default function DailyMixPage() {
    const { setQueue } = usePlayer()

    // Fetch mix songs (simulated as latest 20 songs shuffled)
    const { data: songsWithUrls } = useQuery({
        queryKey: ['daily-mix'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('songs')
                .select('*')
                .limit(50) // Get pool of songs

            if (error) throw error

            // Shuffle locally for "Daily Mix" feel
            const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 20)

            const songs = await Promise.all(shuffled.map(async (song: any) => {
                let audioUrl = ""
                if (song.audio_path?.startsWith('/')) {
                    audioUrl = song.audio_path
                } else {
                    const { data } = await supabase.storage.from('songs').createSignedUrl(song.audio_path, 3600)
                    audioUrl = data?.signedUrl || ""
                }

                return {
                    id: song.id,
                    title: song.title,
                    artist: song.title.includes("Mga Isla") ? "Team Ekko (Special)" : "Team Ekko",
                    isSpecial: song.title.includes("Mga Isla"),
                    duration: song.duration,
                    audio_path: song.audio_path,
                    audioUrl: audioUrl,
                    coverUrl: getCoverArt({ title: song.title, coverUrl: song.cover_url })
                }
            }))

            // Force inject "Mga Isla Sa Gitna Natin" if missing
            const specialTitle = "Mga Isla Sa Gitna Natin"
            const hasSpecial = songs.some(s => s.title.includes(specialTitle))

            if (!hasSpecial) {
                songs.unshift({
                    id: 'special-feature-local',
                    title: specialTitle,
                    artist: "Team Ekko (Special)",
                    isSpecial: true,
                    duration: 180,
                    audio_path: "/music/Mga Isla Sa Gitna Natin.mp3",
                    audioUrl: "/music/Mga Isla Sa Gitna Natin.mp3",
                    coverUrl: getCoverArt({ title: specialTitle })
                })
            }

            return songs
        },
        staleTime: 1000 * 60 * 60 * 24 // Keep mix stable for 24h ideally (client session)
    })

    return (
        <div className="p-8 pt-0 min-h-full font-geist-mono">
            {/* Header */}
            <div className="flex items-end gap-6 mb-8 mt-4">
                <div className="w-52 h-52 relative shadow-xl rounded-sm overflow-hidden group">
                    <img
                        src={PLAYLIST_COVERS.dailyMix}
                        alt="Daily Mix 1"
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-bold uppercase tracking-widest text-emerald-400">Made For You</span>
                    <h1 className="text-7xl font-bold tracking-tighter text-white">Daily Mix 1</h1>
                    <p className="text-sm text-neutral-400 mt-2 font-medium">
                        A mix of news releases and deep cuts, updated daily.
                        <span className="mx-2">•</span>
                        {songsWithUrls?.length || 0} songs
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mb-8">
                {songsWithUrls && songsWithUrls.length > 0 && (
                    <Button
                        size="icon"
                        className="w-14 h-14 rounded-full bg-neon-teal hover:bg-emerald-400 text-black shadow-lg hover:scale-105 transition-transform"
                        onClick={() => songsWithUrls && setQueue(songsWithUrls)}
                    >
                        <Play className="w-6 h-6 fill-black ml-1" />
                    </Button>
                )}
            </div>

            {/* List */}
            <div className="flex flex-col">
                <div className="grid grid-cols-[16px_40px_1fr_1fr_1fr] gap-4 px-4 py-2 border-b border-neutral-800 text-neutral-400 text-sm uppercase">
                    <span>#</span>
                    <span></span>
                    <span>Title</span>
                    <span>Artist</span>
                    <span className="flex justify-end"><Clock className="w-4 h-4" /></span>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                    {songsWithUrls?.map((song: any, i: number) => (
                        <div
                            key={song.id}
                            className={`grid grid-cols-[16px_40px_1fr_1fr_1fr] gap-4 px-4 py-2 hover:bg-white/5 rounded-md group cursor-pointer items-center transition-colors ${song.isSpecial ? 'bg-yellow-500/10 border border-yellow-500/20' : ''}`}
                            onClick={() => songsWithUrls && setQueue(songsWithUrls, i)}
                        >
                            <span className="text-neutral-400 flex items-center justify-center">
                                <span className={`group-hover:hidden text-sm font-mono ${song.isSpecial ? 'text-yellow-500' : ''}`}>
                                    {song.isSpecial ? '⭐' : i + 1}
                                </span>
                                <Play className={`w-4 h-4 hidden group-hover:block ${song.isSpecial ? 'fill-yellow-500' : 'fill-white'}`} />
                            </span>

                            <div className="relative w-10 h-10 overflow-hidden rounded-sm bg-neutral-800">
                                <img src={song.coverUrl} alt={song.title} className="object-cover w-full h-full" />
                            </div>

                            <div className="flex flex-col min-w-0">
                                <span className={`font-medium truncate ${song.isSpecial ? 'text-yellow-400' : 'text-white'}`}>{song.title}</span>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-neutral-400 text-sm truncate">{song.artist}</span>
                            </div>
                            <span className="text-neutral-400 text-sm flex items-center justify-end font-variant-numeric tabular-nums gap-4">
                                <span>{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
                                <div onClick={(e) => e.stopPropagation()}>
                                    <MediaItemActionMenu
                                        songId={song.id}
                                        songTitle={song.title}
                                        artistName={song.artist}
                                    />
                                </div>
                            </span>
                        </div>
                    ))}

                    {!songsWithUrls && (
                        <div className="py-20 text-center text-neutral-500">
                            Loading your mix...
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
