'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { usePlayer } from '@/store/player-store'
import { Button } from '@/components/ui/button'
import { Play, Pause, Share2, UserCheck, Music2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { getCoverArt } from '@/lib/cover-art'
import { SongGridSkeleton } from '@/components/ui/skeleton'
import { MediaItemActionMenu } from '@/components/media/media-item-action-menu'
import { ShareDialog } from '@/components/share/share-dialog'
import { cn } from '@/lib/utils'
import { SLUG_TO_NAME } from '@/lib/artists'

export default function ArtistPage() {
    const params = useParams()
    const slug = params.name as string
    const artistName = SLUG_TO_NAME[slug] || decodeURIComponent(slug)
    const [supabase] = useState(() => createClient())
    const { setQueue, queue, currentIndex, isPlaying, togglePlay } = usePlayer()
    const [showShare, setShowShare] = useState(false)
    const [following, setFollowing] = useState(false)

    const { data: songs, isLoading } = useQuery({
        queryKey: ['artist-songs', artistName],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('songs')
                .select('*')
                .ilike('artist', `%${artistName}%`)
                .order('created_at', { ascending: false })

            if (error) throw error

            return data.map((song: any) => {
                let audioUrl = song.audio_path
                if (!song.audio_path?.startsWith('http') && !song.audio_path?.startsWith('/')) {
                    audioUrl = supabase.storage.from('songs').getPublicUrl(song.audio_path).data.publicUrl
                }

                return {
                    id: song.id,
                    title: song.title,
                    artist: song.artist || artistName,
                    duration: song.duration || 0,
                    audioUrl,
                    coverUrl: song.cover_url || song.image_path || getCoverArt({ title: song.title }),
                    source: 'db',
                }
            })
        },
    })

    const currentSong = queue[currentIndex]
    const isPlayingArtist = songs?.some((s: any) => s.id === currentSong?.id) && isPlaying

    const handlePlayAll = () => {
        if (songs && songs.length > 0) {
            if (isPlayingArtist) {
                togglePlay()
            } else {
                setQueue(songs, 0)
            }
        }
    }

    return (
        <div className="relative min-h-full">
            {/* Hero Banner */}
            <div className="relative h-72 md:h-96 overflow-hidden">
                {/* Banner Image */}
                {slug && (
                    <Image
                        src={`/artists/ghibli/banner-${slug}.png`}
                        alt={`${artistName} Banner`}
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                        onError={(e) => {
                            // Fallback if banner doesn't exist (only 4 artists have banners)
                            (e.target as any).style.display = 'none'
                        }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-ekko-600/20 via-ekko-900/10 to-black" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                    <div className="flex items-end gap-6">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-ekko-500 to-ekko-700 overflow-hidden shadow-2xl border-4 border-black shrink-0 relative">
                            {slug ? (
                                <Image
                                    src={`/artists/ghibli/profile-${slug}.png`}
                                    alt={artistName}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-4xl md:text-5xl font-black text-white">
                                        {artistName.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0 pb-2">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-ekko-400 mb-1">Artist</p>
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight truncate">{artistName}</h1>
                            <p className="text-sm text-neutral-400 mt-2">{songs?.length || 0} tracks</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="px-8 py-6 flex items-center gap-4">
                <Button
                    onClick={handlePlayAll}
                    className="rounded-full bg-ekko-500 hover:bg-ekko-400 text-white h-14 w-14 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                    size="icon"
                >
                    {isPlayingArtist ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                </Button>
                <Button
                    variant="outline"
                    onClick={() => setFollowing(!following)}
                    className={cn(
                        "rounded-full px-6 border-white/10 font-bold transition-all",
                        following ? "bg-ekko-500/10 text-ekko-400 border-ekko-500/30" : "text-white hover:bg-white/5"
                    )}
                >
                    <UserCheck className="w-4 h-4 mr-2" />
                    {following ? 'Following' : 'Follow'}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setShowShare(true)} className="rounded-full text-neutral-400 hover:text-white">
                    <Share2 className="w-5 h-5" />
                </Button>
            </div>

            {/* Discography */}
            <div className="px-8 pb-32">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="bg-ekko-500 w-1.5 h-6 rounded-full" />
                    Discography
                </h2>

                {isLoading ? (
                    <SongGridSkeleton count={6} />
                ) : songs && songs.length > 0 ? (
                    <div className="space-y-1">
                        {songs.map((song: any, i: number) => (
                            <div
                                key={song.id}
                                className={cn(
                                    "flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-all group cursor-pointer",
                                    currentSong?.id === song.id && "bg-ekko-500/10"
                                )}
                                onClick={() => setQueue(songs, i)}
                            >
                                <span className="text-sm font-mono text-neutral-600 w-6 text-right group-hover:hidden">
                                    {i + 1}
                                </span>
                                <Play className="w-4 h-4 text-ekko-400 hidden group-hover:block ml-1" />

                                <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                                    <Image src={song.coverUrl} alt={song.title} fill className="object-cover" unoptimized />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className={cn("text-sm font-medium truncate", currentSong?.id === song.id ? "text-ekko-400" : "text-white/80 group-hover:text-white")}>
                                        {song.title}
                                    </p>
                                </div>

                                <span className="text-xs font-mono text-neutral-600">
                                    {song.duration > 0 ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : '--:--'}
                                </span>

                                <div className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                    <MediaItemActionMenu songId={song.id} songTitle={song.title} className="h-8 w-8 text-neutral-400 hover:text-white rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-neutral-600">
                        <Music2 className="w-12 h-12 mb-3" />
                        <p className="font-medium">No tracks found</p>
                        <p className="text-sm mt-1">This artist hasn&apos;t uploaded any tracks yet.</p>
                    </div>
                )}
            </div>

            <ShareDialog open={showShare} onClose={() => setShowShare(false)} title={artistName} type="artist" id={encodeURIComponent(artistName)} />
        </div>
    )
}
