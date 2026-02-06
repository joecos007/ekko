'use client'

import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"
import { usePlayer } from "@/store/player-store"
import { Button } from "@/components/ui/button"
import { Clock, Play } from "lucide-react"
import { MediaItemActionMenu } from "@/components/media/media-item-action-menu"
import { getCoverArt } from "@/lib/cover-art"

export default function PlaylistPage() {
    const { id } = useParams()
    const { setQueue } = usePlayer()

    // Fetch playlist details
    const { data: playlist } = useQuery({
        queryKey: ['playlist', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('playlists')
                .select('*')
                .eq('id', id)
                .single()
            if (error) throw error
            return data
        }
    })

    // Fetch playlist songs
    const { data: songs } = useQuery({
        queryKey: ['playlist-songs', id],
        queryFn: async () => {
            // Join playlist_songs with songs
            const { data, error } = await supabase
                .from('playlist_songs')
                .select('song_id, songs(*)')
                .eq('playlist_id', id)
                .order('position', { ascending: true })

            if (error) throw error

            // Map to Song type
            return data.map((item: any) => ({
                id: item.songs.id,
                title: item.songs.title,
                artist: item.songs.title.includes("Mga Isla") ? "Team Ekko (Special)" : "Team Ekko",
                isSpecial: item.songs.title.includes("Mga Isla"),
                duration: item.songs.duration,
                audioUrl: item.songs.audio_path?.startsWith('/') ? item.songs.audio_path : "",
                coverUrl: getCoverArt({ title: item.songs.title, coverUrl: "" }),
                audio_path: item.songs.audio_path
            }))
        }
    })

    // Augment songs with signed URLs
    const { data: songsWithUrls } = useQuery({
        queryKey: ['playlist-songs-signed', id, songs],
        enabled: !!songs,
        queryFn: async () => {
            if (!songs) return []
            return Promise.all(songs.map(async (s: any) => {
                const { data } = await supabase.storage.from('songs').createSignedUrl(s.audio_path, 3600)
                return {
                    ...s,
                    audioUrl: data?.signedUrl
                }
            }))
        }
    })


    if (!playlist) return <div className="p-8">Loading playlist...</div>

    return (
        <div className="p-8 pt-0 min-h-full font-geist-mono">
            {/* Header */}
            <div className="flex items-end gap-6 mb-8 mt-4">
                <div className="w-52 h-52 bg-gradient-to-br from-neutral-800 to-neutral-700 shadow-xl flex items-center justify-center">
                    <span className="text-6xl">🎵</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-bold uppercase">Playlist</span>
                    <h1 className="text-7xl font-bold tracking-tighter">{playlist.title}</h1>
                    <p className="text-sm text-neutral-400 mt-2">
                        {songs?.length || 0} songs
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mb-8">
                {songsWithUrls && songsWithUrls.length > 0 && (
                    <Button
                        size="icon"
                        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 text-black shadow-lg hover:scale-105 transition-transform"
                        onClick={() => songsWithUrls && setQueue(songsWithUrls)}
                    >
                        <Play className="w-6 h-6 fill-black" />
                    </Button>
                )}
            </div>

            {/* List or Empty State */}
            {songsWithUrls && songsWithUrls.length > 0 ? (
                <div className="flex flex-col">
                    <div className="grid grid-cols-[16px_40px_1fr_1fr_1fr] gap-4 px-4 py-2 border-b border-neutral-800 text-neutral-400 text-sm uppercase">
                        <span>#</span>
                        <span></span>
                        <span>Title</span>
                        <span>Artist</span>
                        <span className="flex justify-end"><Clock className="w-4 h-4" /></span>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                        {songsWithUrls.map((song: any, i: number) => (
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
                                            playlistId={id as string}
                                        />
                                    </div>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
                    <div className="w-20 h-20 bg-neutral-800/50 rounded-full flex items-center justify-center mb-6">
                        <span className="text-4xl grayscale">🎵</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Playlist is empty</h3>
                    <p className="max-w-sm text-center mb-8">
                        Find songs you love and add them to this playlist.
                    </p>
                    <Button variant="outline" className="border-white/20 hover:bg-white hover:text-black hover:border-white transition-colors"
                        onClick={() => window.location.href = '/search'}
                    >
                        Find Songs
                    </Button>
                </div>
            )}
        </div>
    )
}
