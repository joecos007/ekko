'use client'

import { usePlaylists } from "@/hooks/use-playlists"
import { usePlayer } from "@/store/player-store"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Heart, ListMusic, Sparkles, Disc, Play } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { getCoverArt, PLAYLIST_COVERS } from "@/lib/cover-art"

export default function LibraryPage() {
    const { playlists } = usePlaylists()
    const { setQueue } = usePlayer()

    // Fetch count of liked songs
    const { data: likedCount } = useQuery({
        queryKey: ['liked-count'],
        queryFn: async () => {
            const { count, error } = await supabase
                .from('liked_songs')
                .select('*', { count: 'exact', head: true })
            if (error) throw error
            return count
        }
    })

    // Fetch "New Releases" for Daily Mix playback
    const { data: newReleases } = useQuery({
        queryKey: ['new-releases-library'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('songs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20)

            if (error) throw error

            return Promise.all(data.map(async (song: any) => {
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
                    duration: song.duration,
                    audio_path: song.audio_path,
                    audioUrl: audioUrl,
                    coverUrl: getCoverArt({ title: song.title, coverUrl: song.cover_url })
                }
            }))
        }
    })

    return (
        <div className="p-8 pt-6 min-h-full font-geist-mono">
            <div className="mb-8 flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Library</h1>
                    <p className="text-neutral-400">Manage your music collection</p>
                </div>
            </div>

            <Tabs defaultValue="playlists" className="w-full">
                <TabsList className="bg-neutral-900 border border-neutral-800 mb-8">
                    <TabsTrigger value="playlists">Playlists</TabsTrigger>
                    <TabsTrigger value="made-for-you">Made For You</TabsTrigger>
                    <TabsTrigger value="liked">Liked Songs</TabsTrigger>
                </TabsList>

                <TabsContent value="playlists" className="mt-0">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Liked Songs Card */}
                        <Link href="/liked">
                            <div className="relative overflow-hidden bg-neutral-900 md:col-span-2 p-6 rounded-lg h-64 flex flex-col justify-end group cursor-pointer hover:scale-[1.01] transition-all shadow-lg glow-purple">
                                <div className="absolute inset-0 z-0">
                                    <img
                                        src={PLAYLIST_COVERS.liked}
                                        alt="Liked Songs"
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                </div>

                                <div className="relative z-10">
                                    <div className="mb-4">
                                        <Heart className="w-8 h-8 fill-white text-white drop-shadow-md" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-1 tracking-tight">Liked Songs</h3>
                                    <p className="text-indigo-100 text-sm font-medium">{likedCount || 0} songs</p>
                                </div>
                            </div>
                        </Link>

                        {/* User Playlists */}
                        {playlists?.map(playlist => (
                            <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
                                <div className="glass-card glow-teal p-4 rounded-lg h-64 flex flex-col justify-end group cursor-pointer transition-all">
                                    <div className="flex-1 flex items-center justify-center mb-4 bg-neutral-900/50 rounded-md shadow-inner relative overflow-hidden group-hover:shadow-2xl transition-all">
                                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 opacity-50" />
                                        <ListMusic className="w-12 h-12 text-neutral-600 group-hover:text-white transition-colors relative z-10" />
                                    </div>
                                    <h3 className="font-bold truncate">{playlist.title}</h3>
                                    <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wide">My Playlist</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="made-for-you" className="mt-0">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Daily Mix Card */}
                        <div
                            className="relative overflow-hidden border border-white/5 bg-neutral-900 rounded-lg h-64 flex flex-col justify-end group cursor-pointer hover:scale-[1.02] transition-all shadow-lg glow-teal"
                            onClick={() => window.location.href = '/mix/daily'}
                        >
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={PLAYLIST_COVERS.dailyMix}
                                    alt="Daily Mix"
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            </div>

                            <div className="relative z-10 p-4 mb-2">
                                <h3 className="text-2xl font-bold tracking-tighter">Daily Mix 1</h3>
                                <p className="text-emerald-100 font-medium text-sm">New releases mixed just for you.</p>
                            </div>
                            <div className="absolute bottom-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-visible duration-300">
                                <Button size="icon" className="rounded-full bg-neon-teal hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(20,241,149,0.6)] h-12 w-12 border-none"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        // Simple logic: pass newReleases if available
                                        if (newReleases) {
                                            setQueue(newReleases) // Or shuffle
                                        }
                                    }}
                                >
                                    <Play className="fill-black w-6 h-6 ml-1" />
                                </Button>
                            </div>
                        </div>

                        <div className="relative overflow-hidden border border-white/5 bg-neutral-900 rounded-lg h-64 flex flex-col justify-end group cursor-pointer hover:scale-[1.02] transition-all shadow-lg glow-purple opacity-90 hover:opacity-100">
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={PLAYLIST_COVERS.discover}
                                    alt="Discover Weekly"
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            </div>

                            <div className="relative z-10 p-4 mb-2">
                                <h3 className="text-2xl font-bold tracking-tighter">Discover Weekly</h3>
                                <p className="text-indigo-100 font-medium text-sm">Update every Monday.</p>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="liked">
                    {/* Just a different view for Liked Songs, maybe list view? For now redirect hint */}
                    <div className="text-center py-12">
                        <p className="text-neutral-400 mb-4">You can view all your liked songs in the dedicated page.</p>
                        <Link href="/liked" className="inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-3 font-bold hover:scale-105 transition-transform">
                            Open Liked Songs
                        </Link>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
