'use client'

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/utils/supabase/client"
import { useParams, useRouter } from "next/navigation"
import { usePlayer } from "@/store/player-store"
import { usePlaylists } from "@/hooks/use-playlists"
import { Button } from "@/components/ui/button"
import { Clock, Play, Trash2, MoreHorizontal, Share2, Users, Shuffle } from "lucide-react"
import { MediaItemActionMenu } from "@/components/media/media-item-action-menu"
import { ShareDialog } from "@/components/share/share-dialog"
import Image from 'next/image'
import { getCoverArt } from "@/lib/cover-art"
import { toast } from "sonner"
import { useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function PlaylistPage() {
    const supabase = createClient()
    const router = useRouter()
    const { id } = useParams()
    const { setQueue } = usePlayer()
    const { deletePlaylist } = usePlaylists()
    const [showShare, setShowShare] = useState(false)
    const [isCollaborative, setIsCollaborative] = useState(false)

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


    const handleDeletePlaylist = async () => {
        if (!playlist) return
        
        const confirmed = window.confirm(`Delete "${playlist.title}"? This action cannot be undone.`)
        if (!confirmed) return
        
        try {
            await deletePlaylist.mutateAsync(id as string)
            toast.success(`Deleted "${playlist.title}"`)
            router.push('/library')
        } catch (error) {
            toast.error("Failed to delete playlist")
            console.error(error)
        }
    }

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
                    <>
                        <Button
                            size="icon"
                            className="w-14 h-14 rounded-full bg-ekko-500 hover:bg-ekko-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:scale-105 transition-transform"
                            onClick={() => songsWithUrls && setQueue(songsWithUrls)}
                        >
                            <Play className="w-6 h-6 fill-white ml-0.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 text-neutral-400 hover:text-white rounded-full"
                            onClick={() => {
                                if (songsWithUrls) {
                                    const shuffled = [...songsWithUrls].sort(() => 0.5 - Math.random())
                                    setQueue(shuffled)
                                }
                            }}
                            title="Shuffle Play"
                        >
                            <Shuffle className="w-5 h-5" />
                        </Button>
                    </>
                )}

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowShare(true)}
                    className="h-10 w-10 text-neutral-400 hover:text-white rounded-full"
                    title="Share"
                >
                    <Share2 className="w-5 h-5" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                        setIsCollaborative(!isCollaborative)
                        toast.success(isCollaborative ? 'Collaborative mode disabled' : 'Collaborative mode enabled — share the link to let friends add songs!')
                    }}
                    className={`h-10 w-10 rounded-full ${isCollaborative ? 'text-ekko-400 bg-ekko-500/10' : 'text-neutral-400 hover:text-white'}`}
                    title="Collaborate"
                >
                    <Users className="w-5 h-5" />
                </Button>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-neutral-400 hover:text-white rounded-full">
                            <MoreHorizontal className="w-5 h-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="bg-neutral-900/95 backdrop-blur-xl border-white/5 text-white w-48">
                        <DropdownMenuItem onClick={() => setShowShare(true)} className="cursor-pointer focus:bg-white/10">
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Playlist
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/5" />
                        <DropdownMenuItem 
                            onClick={handleDeletePlaylist}
                            className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Playlist
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {isCollaborative && (
                <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-lg bg-ekko-500/10 border border-ekko-500/20">
                    <Users className="w-4 h-4 text-ekko-400 shrink-0" />
                    <p className="text-sm text-ekko-300">Collaborative mode is on — anyone with the link can add songs.</p>
                </div>
            )}

            <ShareDialog open={showShare} onClose={() => setShowShare(false)} title={playlist?.title || ''} type="playlist" id={id as string} />

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
                                className={`grid grid-cols-[16px_40px_1fr_1fr_1fr] gap-4 px-4 py-2 hover:bg-white/5 rounded-md group cursor-pointer items-center transition-colors ${song.isSpecial ? 'bg-ekko-500/10 border border-ekko-500/20' : ''}`}
                                onClick={() => songsWithUrls && setQueue(songsWithUrls, i)}
                            >
                                <span className="text-neutral-400 flex items-center justify-center">
                                    <span className={`group-hover:hidden text-sm font-mono ${song.isSpecial ? 'text-ekko-400' : ''}`}>
                                        {song.isSpecial ? '⭐' : i + 1}
                                    </span>
                                    <Play className={`w-4 h-4 hidden group-hover:block ${song.isSpecial ? 'fill-ekko-400' : 'fill-white'}`} />
                                </span>

                                <div className="relative w-10 h-10 overflow-hidden rounded-sm bg-neutral-800">
                                    <Image src={song.coverUrl} alt={song.title} fill className="object-cover" unoptimized />
                                </div>

                                <div className="flex flex-col min-w-0">
                                    <span className={`font-medium truncate ${song.isSpecial ? 'text-ekko-300' : 'text-white'}`}>{song.title}</span>
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
                        onClick={() => router.push('/search')}
                    >
                        Find Songs
                    </Button>
                </div>
            )}
        </div>
    )
}
