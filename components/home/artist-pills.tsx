'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Artist {
    id: string
    name: string
    avatarUrl: string
    gradient: string
}

const FEATURED_ARTISTS: Artist[] = [
    { id: 'a1', name: 'Team Ekko', avatarUrl: '/song-cover/mga-isla-sa-gitna-natin.png', gradient: 'from-blue-500 to-indigo-600' },
    { id: 'a2', name: 'Chele', avatarUrl: '/song-cover/groove-ni-chele.png', gradient: 'from-purple-500 to-pink-600' },
    { id: 'a3', name: 'Jai', avatarUrl: '/song-cover/si-jai.png', gradient: 'from-emerald-500 to-teal-600' },
    { id: 'a4', name: 'Tiaong Sound', avatarUrl: '/song-cover/dito-sa-tiaong.png', gradient: 'from-orange-500 to-red-500' },
    { id: 'a5', name: 'Isla Beats', avatarUrl: '/song-cover/sarap-ng-buhay.png', gradient: 'from-cyan-500 to-blue-600' },
    { id: 'a6', name: 'Pagsikat', avatarUrl: '/song-cover/sa-muling-pagsikat.png', gradient: 'from-rose-500 to-purple-600' },
    { id: 'a7', name: 'Uwian', avatarUrl: '/song-cover/uwian-na.png', gradient: 'from-amber-500 to-orange-600' },
    { id: 'a8', name: 'Poblacion', avatarUrl: '/song-cover/poblacion-3-groove.jpeg', gradient: 'from-violet-500 to-indigo-600' },
]

export function ArtistPills() {
    const scrollRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return
        const scrollAmount = 200
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        })
    }

    return (
        <section className="mb-10 relative z-10">
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-black tracking-tight text-white/90 flex items-center gap-3">
                    <span className="bg-rose-500 w-1.5 h-6 rounded-full" />
                    Popular Artists
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-2 -mx-2 px-2"
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {FEATURED_ARTISTS.map((artist) => (
                    <div
                        key={artist.id}
                        className="flex flex-col items-center gap-3 cursor-pointer group flex-shrink-0"
                        style={{ scrollSnapAlign: 'start' }}
                    >
                        {/* Circular Avatar with Gradient Ring */}
                        <div className={`relative w-16 h-16 md:w-24 md:h-24 rounded-full p-[3px] bg-gradient-to-br ${artist.gradient} group-hover:scale-110 transition-all duration-500 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.3)]`}>
                            <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900 border-2 border-neutral-900">
                                <Image
                                    src={artist.avatarUrl}
                                    alt={artist.name}
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    unoptimized
                                />
                            </div>
                            {/* Online Indicator */}
                            <div className="absolute bottom-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-emerald-500 rounded-full border-[3px] border-neutral-950 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Artist Name */}
                        <span className="text-xs md:text-sm font-bold text-white/60 group-hover:text-white transition-colors duration-300 text-center max-w-[80px] md:max-w-[96px] truncate">
                            {artist.name}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    )
}
