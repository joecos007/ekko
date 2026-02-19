'use client'

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/utils/supabase/client"
import { usePlayer } from "@/store/player-store"
import { Button } from "@/components/ui/button"
import { Clock, Play, Heart } from "lucide-react"
import { MediaItemActionMenu } from "@/components/media/media-item-action-menu"
import { BackButton } from "@/components/ui/back-button"
import { useLikedSongs } from "@/hooks/use-liked-songs"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function LikedSongsPage() {
    const router = useRouter()
    const supabase = createClient()
    const { setQueue } = usePlayer()
    const { toggleLike, isLiked } = useLikedSongs()

    const { data: likedSongs } = useQuery({
        queryKey: ['liked-songs-objects'], // Different key to avoid set vs array conflict
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
                    coverUrl: s.image_path,
                    audioUrl: audioUrl
                }
            }))
        }
    })

    const handleToggleLike = async (e: React.MouseEvent, songId: string) => {
        e.stopPropagation()
        try {
            await toggleLike.mutateAsync(songId)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="p-6 sm:p-8 pt-2 min-h-full font-geist-sans relative">
            <div className="absolute top-5 left-5 md:top-6 md:left-8 z-50">
                <BackButton />
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-8 mb-8 md:mb-10 mt-4 pt-12">
                <div className="w-36 h-36 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-gradient-to-br from-ekko-600 via-ekko-500 to-ekko-300 shadow-2xl rounded-none flex items-center justify-center relative overflow-hidden group">
                    <Heart className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 fill-white text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity" />
                </div>
                <div className="flex flex-col gap-3 pb-2">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-ekko-400">Collection</span>
                    <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight text-white drop-shadow-md">Liked Songs</h1>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-400 font-medium mt-1 sm:mt-2">
                        <span className="text-white">{likedSongs?.length || 0} tracks</span>
                        <span className="opacity-30">•</span>
                        <span>Personal Frequency</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 md:mb-10">
                <Button
                    size="icon"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-black hover:bg-neutral-200 shadow-glow-white hover:scale-105 transition-all active:scale-95 border-none"
                    onClick={() => likedSongs && setQueue(likedSongs)}
                >
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-black ml-1" />
                </Button>

                <div className="h-10 w-[1px] bg-white/10 mx-2" />

                <span className="text-xs sm:text-sm font-bold text-neutral-500 uppercase tracking-widest">
                    Shuffle Play
                </span>
            </div>

            {/* List */}
            <div className="flex flex-col bg-white/[0.02] rounded-none border border-white/5 overflow-hidden backdrop-blur-sm">
                <div className="hidden md:grid grid-cols-[16px_1fr_1fr_1fr_min-content] gap-4 px-8 py-4 border-b border-white/5 text-neutral-500 text-[10px] font-black uppercase tracking-widest">
                    <span>#</span>
                    <span>Title</span>
                    <span>Added on</span>
                    <span className="flex justify-end"><Clock className="w-4 h-4" /></span>
                    <span className="w-10"></span>
                </div>

                <div className="flex flex-col">
                    {likedSongs?.map((song: any, i: number) => (
                        <div
                            key={song.id}
                            className="hidden md:grid grid-cols-[16px_1fr_1fr_1fr_min-content] gap-4 px-8 py-5 hover:bg-white/5 group cursor-pointer items-center transition-all border-b border-white/[0.02] last:border-0"
                            onClick={() => likedSongs && setQueue(likedSongs, i)}
                        >
                            <span className="text-neutral-500 flex items-center justify-center font-mono text-xs">
                                <span className="group-hover:hidden">{i + 1}</span>
                                <Play className="w-4 h-4 hidden group-hover:block fill-white" />
                            </span>
                            <div className="flex flex-col min-w-0">
                                <span className="text-white font-bold truncate text-base hover:text-ekko-400 transition-colors uppercase tracking-tight">{song.title}</span>
                                <span className="text-neutral-500 text-xs font-medium truncate">{song.artist}</span>
                            </div>
                            <span className="text-neutral-500 text-sm hidden md:flex items-center font-medium" suppressHydrationWarning>
                                {song.created_at ? new Date(song.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                            </span>
                            <span className="text-neutral-400 text-sm flex items-center justify-end font-mono">
                                {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                            </span>
                            <div className="flex items-center gap-2 pl-4">
                                <button
                                    onClick={(e) => handleToggleLike(e, song.id)}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <Heart className="w-4 h-4 fill-ekko-400 text-ekko-400" />
                                </button>
                                <div onClick={(e) => e.stopPropagation()}>
                                    <MediaItemActionMenu
                                        songId={song.id}
                                        songTitle={song.title}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {likedSongs?.map((song: any, i: number) => (
                        <div
                            key={`${song.id}-mobile`}
                            className="md:hidden flex items-center gap-3 px-4 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                            onClick={() => likedSongs && setQueue(likedSongs, i)}
                        >
                            <span className="text-neutral-500 text-xs font-mono w-6 text-center">{i + 1}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold truncate text-sm">{song.title}</p>
                                <p className="text-neutral-500 text-xs truncate">{song.artist}</p>
                            </div>
                            <span className="text-neutral-400 text-xs font-mono">
                                {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={(e) => handleToggleLike(e, song.id)}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                >
                                    <Heart className="w-4 h-4 fill-ekko-400 text-ekko-400" />
                                </button>
                                <div onClick={(e) => e.stopPropagation()}>
                                    <MediaItemActionMenu
                                        songId={song.id}
                                        songTitle={song.title}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {likedSongs?.length === 0 && (
                        <div className="py-24 md:py-40 text-center flex flex-col items-center gap-6 animate-fade-in-up">
                            <div className="w-24 h-24 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/5 relative group">
                                <div className="absolute inset-0 bg-ekko-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Heart className="w-10 h-10 text-neutral-600 group-hover:text-ekko-400 group-hover:fill-ekko-400 transition-all duration-500 relative z-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white tracking-tighter">Your collection is silent.</h3>
                                <p className="text-neutral-500 max-w-xs text-sm font-medium leading-relaxed">
                                    Capture the frequencies you love. Tap the heart on any song to build your neural archive.
                                </p>
                            </div>
                            <Button
                                className="mt-4 bg-white text-black hover:bg-neutral-200 transition-all active:scale-95 rounded-full px-10 h-12 font-black uppercase tracking-widest text-[11px] shadow-glow-white border-none"
                                onClick={() => router.push('/search')}
                            >
                                Explore More
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
