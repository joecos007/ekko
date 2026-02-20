'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Users, Sparkles, Music2 } from 'lucide-react'

interface FeaturedSlide {
    id: string
    type: 'artist' | 'playlist' | 'personalized'
    title: string
    subtitle: string
    description?: string
    imageUrl: string
    accentColor: string
    stats?: { label: string; value: string }[]
    songs?: any[]
}

const FEATURED_SLIDES: FeaturedSlide[] = [
    {
        id: 'featured-artist',
        type: 'artist',
        title: 'Team Ekko',
        subtitle: 'Featured Artist',
        description: 'Original Filipino music — soulful vibes from Tiaong, Quezon',
        imageUrl: '/song-cover/mga-isla-sa-gitna-natin.png',
        accentColor: 'from-ekko-700/90 via-ekko-900/70',
        stats: [
            { label: 'Tracks', value: '10' },
            { label: 'Listeners', value: '1.2K' },
        ],
    },
    {
        id: 'curated-playlist',
        type: 'playlist',
        title: 'Pinoy Indie Hits',
        subtitle: 'Curated Playlist',
        description: 'The best of independent Filipino music, updated weekly',
        imageUrl: '/playlist-daily-mix.png',
        accentColor: 'from-ekko-600/90 via-ekko-800/70',
        stats: [
            { label: 'Songs', value: '20' },
            { label: 'Duration', value: '1hr 30m' },
        ],
    },
    {
        id: 'personalized-mix',
        type: 'personalized',
        title: 'Your Daily Mix',
        subtitle: 'Made For You',
        description: 'A personalized blend based on your listening habits',
        imageUrl: '/playlist-discover.png',
        accentColor: 'from-ekko-500/90 via-ekko-700/70',
        stats: [
            { label: 'Fresh', value: '5 new' },
            { label: 'Updated', value: 'Today' },
        ],
    },
]

export function FeaturedCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [direction, setDirection] = useState<'left' | 'right'>('right')

    const goToSlide = useCallback((index: number) => {
        setDirection(index > currentSlide ? 'right' : 'left')
        setCurrentSlide(index)
    }, [currentSlide])

    const nextSlide = useCallback(() => {
        setDirection('right')
        setCurrentSlide((prev) => (prev + 1) % FEATURED_SLIDES.length)
    }, [])

    const prevSlide = useCallback(() => {
        setDirection('left')
        setCurrentSlide((prev) => (prev - 1 + FEATURED_SLIDES.length) % FEATURED_SLIDES.length)
    }, [])

    // Auto-rotate every 8 seconds when not hovered
    useEffect(() => {
        if (isHovered) return
        const interval = setInterval(nextSlide, 8000)
        return () => clearInterval(interval)
    }, [isHovered, nextSlide])

    const slide = FEATURED_SLIDES[currentSlide]

    const TypeIcon = slide.type === 'artist' ? Users :
        slide.type === 'playlist' ? Music2 : Sparkles

    return (
        <div
            className="relative w-full h-[50vh] min-h-[400px] md:h-96 rounded-none overflow-hidden mb-8 md:mb-12 group shadow-2xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background Image with Parallax-like Effect */}
            {FEATURED_SLIDES.map((s, i) => (
                <div
                    key={s.id}
                    className={`absolute inset-0 transition-all duration-1000 ease-out ${i === currentSlide
                        ? 'opacity-100 scale-100'
                        : direction === 'right'
                            ? 'opacity-0 scale-105 translate-x-8'
                            : 'opacity-0 scale-105 -translate-x-8'
                        }`}
                >
                    <Image
                        src={s.imageUrl}
                        alt={s.title}
                        fill
                        className="object-cover"
                        priority={i === 0}
                        unoptimized
                    />
                </div>
            ))}

            {/* Gradient Overlays */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.accentColor} to-transparent transition-all duration-1000 z-[1]`} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-[1]" />

            {/* Ambient Glow */}
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-ekko-500/15 blur-[120px] rounded-full z-[1] animate-pulse-glow" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 z-10">
                {/* Type Badge */}
                <div className="flex items-center gap-2 mb-3">
                    <TypeIcon className="w-4 h-4 text-white/80" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-white/70">
                        {slide.subtitle}
                    </span>
                </div>

                {/* Title */}
                <h1 className={`text-4xl md:text-7xl font-black tracking-tighter text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transition-all duration-700 ${direction === 'right' ? 'animate-fade-in-up' : 'animate-fade-in-up'
                    }`}>
                    {slide.title}
                </h1>

                {/* Description */}
                {slide.description && (
                    <p className="text-white/70 text-base md:text-xl mt-2 md:mt-3 max-w-xl font-medium tracking-wide line-clamp-2 md:line-clamp-none">
                        {slide.description}
                    </p>
                )}

                {/* Stats Only - No Play Button for Clean Look */}
                {slide.stats && (
                    <div className="flex items-center gap-4 mt-5">
                        {slide.stats.map((stat) => (
                            <div key={stat.label} className="flex items-center gap-2">
                                <span className="text-white/90 font-bold text-sm">{stat.value}</span>
                                <span className="text-white/40 text-xs font-medium">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 duration-300"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>
            <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 duration-300"
            >
                <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dot Navigation - Subtle & Elegant */}
            <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
                {FEATURED_SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goToSlide(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        aria-current={i === currentSlide ? 'true' : undefined}
                        className={`rounded-full transition-all duration-500 ${i === currentSlide
                            ? 'w-8 h-1.5 bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.6)]'
                            : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50 hover:scale-110'
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}
