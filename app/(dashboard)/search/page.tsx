'use client'

import { SearchInput } from "@/components/search/search-input"
import { useSearchParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { usePlayer } from "@/store/player-store"
import { Play, ArrowUpRight, Loader2 } from "lucide-react"
import { Suspense } from "react"
import { MediaItemActionMenu } from "@/components/media/media-item-action-menu"

function SearchContent() {
    const searchParams = useSearchParams()
    const query = searchParams.get("q")
    const { setQueue } = usePlayer()
    const router = useRouter()

    const { data: results, isLoading } = useQuery({
        queryKey: ['search', query],
        enabled: !!query,
        queryFn: async () => {
            try {
                const searchQuery = `%${query}%`
                const { data, error } = await supabase
                    .from('songs')
                    .select('*')
                    .ilike('title', searchQuery)
                    .limit(20)

                if (error) {
                    if (error.message?.includes('abort')) return [];
                    throw error
                }

                return Promise.all(data.map(async (song: any) => {
                    let audioUrl = ""
                    if (song.audio_path?.startsWith('/')) {
                        audioUrl = song.audio_path
                    } else {
                        const { data } = await supabase.storage.from('songs').createSignedUrl(song.audio_path, 3600)
                        audioUrl = data?.signedUrl || ""
                    }

                    // Fallback mock duration if missing
                    const duration = song.duration || 180

                    return {
                        id: song.id,
                        title: song.title,
                        duration: duration,
                        audio_path: song.audio_path,
                        audioUrl: audioUrl,
                        artist: song.artist || "Unknown Artist",
                        coverUrl: song.cover_url || song.image_path || null // Use stored cover if available
                    }
                }))
            } catch (e: any) {
                if (e.name === 'AbortError') return [];
                throw e;
            }
        }
    })

    return (
        <div className="p-8 pt-4 min-h-full font-geist-sans selection:bg-purple-500/30">
            {/* Floating Header */}
            <div className="mb-12 sticky top-4 z-40 bg-black/60 backdrop-blur-xl py-6 rounded-full border border-white/5 shadow-2xl">
                <div className="max-w-4xl mx-auto px-4">
                    <SearchInput />
                </div>
            </div>

            <div className="max-w-7xl mx-auto pb-20">
                {!query ? (
                    <div className="flex flex-col items-center justify-center mt-10 animate-fade-in-up">
                        <div className="text-center mb-16 space-y-4">
                            <div className="inline-flex items-center gap-2 border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-purple-300 text-[10px] uppercase tracking-widest rounded-full mb-4">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                                </span>
                                System Index: Live
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-neutral-600 tracking-tighter">
                                Discover Frequencies
                            </h2>
                            <p className="text-neutral-400 text-lg max-w-lg mx-auto leading-relaxed">
                                Enter keywords to search the neural network or select a vibe channel below.
                            </p>
                        </div>

                        {/* Suggested Vibes Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
                            {["Cyberpunk", "Neon Noir", "Lo-Fi High", "Deep Focus", "Future Funk", "Ambient", "Tech House", "Synthwave"].map((vibe, i) => (
                                <button
                                    key={vibe}
                                    onClick={() => router.push(`/search?q=${encodeURIComponent(vibe)}`)}
                                    className="group relative h-24 rounded-xl bg-neutral-900/50 border border-white/5 overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/0 to-purple-500/0 group-hover:to-purple-500/10 transition-all" />
                                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowUpRight className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <span className="absolute bottom-4 left-4 font-bold text-neutral-300 group-hover:text-white group-hover:translate-x-1 transition-all">
                                        {vibe}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : isLoading ? (
                    <div className="flex flex-col items-center justify-center mt-32 space-y-4">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                        <span className="text-xs uppercase tracking-widest text-neutral-500 animate-pulse">Scanning Database...</span>
                    </div>
                ) : (
                    <div className="flex flex-col animate-fade-in-up">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold flex items-center gap-3">
                                <span className="bg-purple-600 w-1.5 h-6 rounded-full" />
                                Search Results
                                <span className="text-neutral-500 text-sm font-normal ml-2">({results?.length || 0} found)</span>
                            </h2>
                        </div>

                        {results && results.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {results.map((song: any, i: number) => (
                                    <div
                                        key={song.id}
                                        className="group relative bg-neutral-900/40 hover:bg-neutral-900/80 border border-white/5 hover:border-purple-500/30 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
                                        onClick={() => setQueue(results, i)}
                                    >
                                        <div className="aspect-square rounded-xl bg-neutral-950 mb-4 relative overflow-hidden shadow-lg border border-white/5">
                                            {song.coverUrl ? (
                                                <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-600">
                                                        <span className="font-black text-2xl">{song.title[0]}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Play Overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                                                <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-glow-purple transform scale-90 group-hover:scale-100 transition-transform">
                                                    <Play className="w-5 h-5 ml-1 fill-white" />
                                                </div>
                                            </div>

                                            {/* Action Menu - Top Right */}
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                                                <MediaItemActionMenu
                                                    songId={song.id}
                                                    songTitle={song.title}
                                                    artistName={song.artist}
                                                    className="bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full w-8 h-8 text-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <h3 className="font-bold text-white leading-tight truncate px-1 group-hover:text-purple-300 transition-colors">{song.title}</h3>
                                            <div className="flex items-center justify-between px-1">
                                                <p className="text-xs text-neutral-400 truncate max-w-[70%]">{song.artist}</p>
                                                <p className="text-[10px] font-mono text-neutral-600">{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-neutral-600 border border-dashed border-neutral-800 rounded-3xl">
                                <span className="text-4xl mb-4">∅</span>
                                <h3 className="text-lg font-bold text-neutral-400">No signals found</h3>
                                <p className="text-sm mt-1">Try adjusting your frequency range.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="p-8 text-neutral-500">Loading search...</div>}>
            <SearchContent />
        </Suspense>
    )
}
