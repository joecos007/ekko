'use client'

import { usePlaylists } from "@/hooks/use-playlists"
import { usePlayer } from "@/store/player-store"
import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import Image from 'next/image'
import Link from "next/link"
import { Heart, ListMusic, Play, Plus, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { getCoverArt, PLAYLIST_COVERS } from "@/lib/cover-art"
import { toast } from "sonner"

// Magic UI Components
import { BorderBeam } from "@/components/ui/border-beam"
import { MagicCard } from "@/components/ui/magic-card"

export default function LibraryPage() {
    const router = useRouter()
    const supabase = createClient()
    const { playlists, createPlaylist, deletePlaylist } = usePlaylists()
    const { setQueue } = usePlayer()

    const handleCreatePlaylist = async () => {
        const title = window.prompt("Enter playlist name:", `My Playlist #${(playlists?.length || 0) + 1}`)
        if (!title) return
        try {
            await createPlaylist.mutateAsync({ title })
            toast.success(`Created "${title}"`)
        } catch {
            toast.error("Failed to create playlist")
        }
    }

    const handleDeletePlaylist = async (playlistId: string, playlistTitle: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        
        const confirmed = window.confirm(`Delete "${playlistTitle}"? This action cannot be undone.`)
        if (!confirmed) return
        
        try {
            await deletePlaylist.mutateAsync(playlistId)
            toast.success(`Deleted "${playlistTitle}"`)
        } catch (error) {
            toast.error("Failed to delete playlist")
            console.error(error)
        }
    }

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
        <div className="p-6 sm:p-8 pt-6 min-h-full font-geist-sans relative">
            <div className="mb-8 md:mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-br from-white to-white/40">
                        Library
                    </h1>
                    <p className="text-sm md:text-base text-neutral-500 font-medium">Manage your frequencies and collections</p>
                </div>
                <Button
                    onClick={handleCreatePlaylist}
                    className="w-full md:w-auto justify-center rounded-full bg-white text-black hover:bg-neutral-200 font-black px-6 shadow-glow-white border-none h-12 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Collection
                </Button>
            </div>

            <Tabs defaultValue="playlists" className="w-full">
                <TabsList className="w-full md:w-auto h-auto flex flex-wrap gap-1.5 bg-neutral-900/80 border border-neutral-800/80 mb-6 md:mb-8 p-1.5 rounded-none">
                    <TabsTrigger value="playlists" className="rounded-full px-3 md:px-4 py-2 text-xs md:text-sm font-semibold">
                        Playlists
                    </TabsTrigger>
                    <TabsTrigger value="made-for-you" className="rounded-full px-3 md:px-4 py-2 text-xs md:text-sm font-semibold">
                        Made For You
                    </TabsTrigger>
                    <TabsTrigger value="liked" className="rounded-full px-3 md:px-4 py-2 text-xs md:text-sm font-semibold">
                        Liked Songs
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="playlists" className="mt-0">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {/* Liked Songs Card */}
                        <Link href="/liked">
                            <div className="relative overflow-hidden bg-neutral-900 md:col-span-2 p-5 md:p-6 rounded-none h-48 md:h-64 flex flex-col justify-end group cursor-pointer hover:scale-[1.01] transition-all shadow-lg">
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src={PLAYLIST_COVERS.liked}
                                        alt="Liked Songs"
                                        fill
                                        className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                </div>

                                <div className="relative z-10">
                                    <div className="mb-4">
                                        <Heart className="w-8 h-8 fill-white text-white drop-shadow-md" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold mb-1 tracking-tight">Liked Songs</h3>
                                    <p className="text-ekko-100 text-xs md:text-sm font-medium">{likedCount || 0} songs</p>
                                </div>
                                <BorderBeam size={250} duration={12} delay={9} />
                            </div>
                        </Link>

                        {/* User Playlists */}
                        {playlists?.map(playlist => (
                            <MagicCard key={playlist.id} gradientColor="#6366F1" className="h-48 md:h-64 rounded-none relative group/card">
                                <Link href={`/playlist/${playlist.id}`}>
                                    <div className="glass-card p-4 rounded-none h-full flex flex-col justify-end group cursor-pointer transition-all">
                                        <div className="flex-1 flex items-center justify-center mb-4 bg-neutral-900/50 rounded-none shadow-inner relative overflow-hidden group-hover:shadow-2xl transition-all">
                                            <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 opacity-50" />
                                            <ListMusic className="w-12 h-12 text-neutral-600 group-hover:text-white transition-colors relative z-10" />
                                        </div>
                                        <h3 className="font-bold truncate">{playlist.title}</h3>
                                        <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wide">My Playlist</p>
                                    </div>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover/card:opacity-100 transition-opacity bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 z-20"
                                    onClick={(e) => handleDeletePlaylist(playlist.id, playlist.title, e)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </MagicCard>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="made-for-you" className="mt-0">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {/* Daily Mix Card */}
                        <div
                            className="relative overflow-hidden border border-white/5 bg-neutral-900 rounded-none h-64 flex flex-col justify-end group cursor-pointer hover:scale-[1.02] transition-all shadow-lg"
                            onClick={() => router.push('/mix/daily')}
                        >
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={PLAYLIST_COVERS.dailyMix}
                                    alt="Daily Mix"
                                    fill
                                    className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            </div>

                            <div className="relative z-10 p-4 mb-2">
                                <h3 className="text-2xl font-bold tracking-tighter">Daily Mix 1</h3>
                                <p className="text-ekko-100 font-medium text-sm">New releases mixed just for you.</p>
                            </div>
                            <div className="absolute bottom-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-visible duration-300">
                                <Button size="icon" className="rounded-full bg-ekko-500 hover:bg-ekko-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] h-12 w-12 border-none"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        // Simple logic: pass newReleases if available
                                        if (newReleases) {
                                            setQueue(newReleases) // Or shuffle
                                        }
                                    }}
                                >
                                    <Play className="fill-white w-6 h-6 ml-1" />
                                </Button>
                            </div>
                        </div>

                        <div className="relative overflow-hidden border border-white/5 bg-neutral-900 rounded-none h-64 flex flex-col justify-end group cursor-pointer hover:scale-[1.02] transition-all shadow-lg opacity-90 hover:opacity-100">
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={PLAYLIST_COVERS.discover}
                                    alt="Discover Weekly"
                                    fill
                                    className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            </div>

                            <div className="relative z-10 p-4 mb-2">
                                <h3 className="text-2xl font-bold tracking-tighter">Discover Weekly</h3>
                                <p className="text-ekko-100 font-medium text-sm">Update every Monday.</p>
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
