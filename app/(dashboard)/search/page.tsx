'use client'

import { SearchInput } from "@/components/search/search-input"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { usePlayer } from "@/store/player-store"
import { Play } from "lucide-react"
import { Suspense } from "react"
import { MediaItemActionMenu } from "@/components/media/media-item-action-menu"

function SearchContent() {
    const searchParams = useSearchParams()
    const query = searchParams.get("q")
    const { setQueue } = usePlayer()

    const { data: results, isLoading } = useQuery({
        queryKey: ['search', query],
        enabled: !!query,
        queryFn: async () => {
            if (!query) return []

            const searchQuery = `%${query}%`
            const { data, error } = await supabase
                .from('songs')
                .select('*')
                .ilike('title', searchQuery)
                .limit(20)

            if (error) throw error

            // Get signed URLs or local paths
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
                    duration: song.duration,
                    audio_path: song.audio_path,
                    audioUrl: audioUrl,
                    artist: "Unknown Artist",
                    coverUrl: ""
                }
            }))
        }
    })

    return (
        <div className="p-8 pt-4 min-h-full font-geist-mono">
            <div className="mb-8 sticky top-0 bg-background/95 backdrop-blur z-30 py-4 -mx-8 px-8 border-b border-neutral-900">
                <SearchInput />
            </div>

            {!query ? (
                <div className="text-center mt-20 text-neutral-500">
                    <h2 className="text-2xl font-bold mb-2">Search for songs</h2>
                    <p>Find your favorite tracks and start listening.</p>
                </div>
            ) : isLoading ? (
                <div className="text-center mt-20 text-neutral-500">Searching...</div>
            ) : (
                <div className="flex flex-col">
                    <h2 className="text-xl font-bold mb-4">Songs</h2>
                    {results && results.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {results.map((song: any, i: number) => (
                                <div
                                    key={song.id}
                                    className="grid grid-cols-[16px_1fr_1fr_1fr] gap-4 px-4 py-3 hover:bg-neutral-800/50 rounded-md group cursor-pointer items-center"
                                    onClick={() => setQueue(results, i)}
                                >
                                    <span className="text-neutral-400 flex items-center justify-center">
                                        <Play className="w-4 h-4 hidden group-hover:block fill-white" />
                                        <span className="group-hover:hidden text-xs">{i + 1}</span>
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="text-white font-medium">{song.title}</span>
                                        <span className="text-neutral-400 text-xs">{song.artist}</span>
                                    </div>
                                    <span className="text-neutral-400 text-sm">
                                        {/* Album would go here */}
                                    </span>
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
                        </div>
                    ) : (
                        <div className="text-neutral-500">No results found for "{query}"</div>
                    )}
                </div>
            )}
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
