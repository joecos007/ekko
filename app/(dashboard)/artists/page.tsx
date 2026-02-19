'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Mic2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MagicCard } from '@/components/ui/magic-card'
import { TextAnimate } from '@/components/ui/text-animate'

const ARTISTS = [
    { id: 'a1', name: 'Team Ekko', avatarUrl: '/song-cover/mga-isla-sa-gitna-natin.png', tracks: 10, genre: 'Philippine AI Music' },
    { id: 'a2', name: 'Chele', avatarUrl: '/song-cover/groove-ni-chele.png', tracks: 1, genre: 'Groove' },
    { id: 'a3', name: 'Jai', avatarUrl: '/song-cover/si-jai.png', tracks: 1, genre: 'P-Pop' },
    { id: 'a4', name: 'Tiaong Sound', avatarUrl: '/song-cover/dito-sa-tiaong.png', tracks: 1, genre: 'Local Vibes' },
    { id: 'a5', name: 'Isla Beats', avatarUrl: '/song-cover/sarap-ng-buhay.png', tracks: 1, genre: 'Island Beats' },
    { id: 'a6', name: 'Pagsikat', avatarUrl: '/song-cover/sa-muling-pagsikat.png', tracks: 1, genre: 'Rising Stars' },
    { id: 'a7', name: 'Uwian', avatarUrl: '/song-cover/uwian-na.png', tracks: 1, genre: 'Homecoming' },
    { id: 'a8', name: 'Poblacion', avatarUrl: '/song-cover/poblacion-3-groove.jpeg', tracks: 1, genre: 'City Groove' },
]

export default function ArtistsPage() {
    return (
        <div className="px-4 md:px-8 py-8 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-none bg-ekko-500/10 border border-ekko-500/20">
                        <Mic2 className="w-6 h-6 text-ekko-400" />
                    </div>
                    <TextAnimate animation="blurInUp" by="word" className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        Artists
                    </TextAnimate>
                </div>
                <p className="text-neutral-400 text-sm md:text-base ml-14">
                    Discover the voices behind EKKO.
                </p>
            </div>

            {/* Artist Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {ARTISTS.map((artist) => (
                    <Link
                        key={artist.id}
                        href={`/artist/${encodeURIComponent(artist.name)}`}
                        className="group"
                    >
                        <MagicCard
                            className="relative overflow-hidden rounded-none border border-white/5 p-5 md:p-6 transition-all duration-300 hover:border-ekko-500/20 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] bg-surface-2/50"
                            gradientColor="rgba(99, 102, 241, 0.08)"
                        >
                            <div className="flex flex-col items-center text-center gap-4">
                                {/* Avatar */}
                                <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-2 ring-white/10 group-hover:ring-ekko-500/30 transition-all duration-300 shadow-xl">
                                    <Image
                                        src={artist.avatarUrl}
                                        alt={artist.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        unoptimized
                                    />
                                </div>

                                {/* Info */}
                                <div className="space-y-1">
                                    <h3 className="text-base md:text-lg font-bold text-white group-hover:text-ekko-300 transition-colors truncate max-w-full">
                                        {artist.name}
                                    </h3>
                                    <p className="text-xs text-neutral-500 font-medium">{artist.genre}</p>
                                    <p className="text-[11px] text-neutral-600">{artist.tracks} {artist.tracks === 1 ? 'Track' : 'Tracks'}</p>
                                </div>
                            </div>
                        </MagicCard>
                    </Link>
                ))}
            </div>
        </div>
    )
}
