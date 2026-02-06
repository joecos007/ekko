'use client'

import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { usePlayer } from "@/store/player-store"
import { Button } from "@/components/ui/button"
import { Clock, Play, Heart } from "lucide-react"
import { MediaItemActionMenu } from "@/components/media/media-item-action-menu"

export default function LikedSongsPage() {
    const { setQueue } = usePlayer()

    const { data: likedSongs } = useQuery({
        queryKey: ['liked-songs'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('liked_songs')
                .select('song_id, songs(*)')
                .order('created_at', { ascending: false })

            if (error) throw error

            // Get signed URLs or local paths
            return Promise.all(data.map(async (item: any) => {
                const s = item.songs
                let audioUrl = ""
                if (s.audio_path?.startsWith('/')) {
                    audioUrl = s.audio_path
                } else {
                    const { data } = await supabase.storage.from('songs').createSignedUrl(s.audio_path, 3600)
                    audioUrl = data?.signedUrl || ""
                }

                return {
                    ...s,
                    audioUrl: audioUrl
                }
            }))
        }
    })

    return (
        <div className="p-8 pt-0 min-h-full font-geist-mono">
            {/* Header */}
            <div className="flex items-end gap-6 mb-8 mt-4">
                <div className="w-52 h-52 bg-gradient-to-br from-indigo-700 to-purple-800 shadow-xl flex items-center justify-center">
                    <Heart className="w-24 h-24 fill-white" />
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-bold uppercase">Playlist</span>
                    <h1 className="text-7xl font-bold tracking-tighter">Liked Songs</h1>
                    <p className="text-sm text-neutral-400 mt-2">
                        {likedSongs?.length || 0} songs
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mb-8">
                <Button
                    size="icon"
                    className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 text-black shadow-lg"
                    onClick={() => likedSongs && setQueue(likedSongs)}
                >
                    <Play className="w-6 h-6 fill-black" />
                </Button>
            </div>

            {/* List */}
            <div className="flex flex-col">
                <div className="grid grid-cols-[16px_1fr_1fr_1fr_min-content] gap-4 px-4 py-2 border-b border-neutral-800 text-neutral-400 text-sm uppercase">
                    <span>#</span>
                    <span>Title</span>
                    <span>Date Added</span>
                    <span className="flex justify-end"><Clock className="w-4 h-4" /></span>
                    <span className="w-8"></span>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                    {likedSongs?.map((song: any, i: number) => (
                        <div
                            key={song.id}
                            className="grid grid-cols-[16px_1fr_1fr_1fr_min-content] gap-4 px-4 py-2 hover:bg-neutral-800/50 rounded-md group cursor-pointer items-center"
                            onClick={() => likedSongs && setQueue(likedSongs, i)}
                        >
                            <span className="text-neutral-400 flex items-center justify-center">
                                <span className="group-hover:hidden">{i + 1}</span>
                                <Play className="w-4 h-4 hidden group-hover:block fill-white" />
                            </span>
                            <div className="flex flex-col">
                                <span className="text-white font-medium">{song.title}</span>
                                <span className="text-neutral-400 text-xs">{song.artist}</span>
                            </div>
                            <span className="text-neutral-400 text-sm flex items-center">
                                Today
                            </span>
                            <span className="text-neutral-400 text-sm flex items-center justify-end font-variant-numeric tabular-nums">
                                {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                            </span>
                            <div onClick={(e) => e.stopPropagation()}>
                                <MediaItemActionMenu
                                    songId={song.id}
                                    songTitle={song.title}
                                    artistName={song.artist}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
