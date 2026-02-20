'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MoreVertical, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PremiumButton } from '@/components/ui/premium-button'
import Image from 'next/image'

export interface HeroItem {
    id: string
    title: string
    description: string
    image: string
    stats: string
    gradient: string
    href?: string
    vibeScore?: string
}

interface HeroBannerProps {
    items: HeroItem[]
}

export function HeroBanner({ items }: HeroBannerProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (!items || items.length <= 1) return

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length)
        }, 8000) // Speed up slightly to 8s for better engagement, user requested smooth transitions

        return () => clearInterval(timer)
    }, [items])

    if (!items || items.length === 0) return null

    return (
        <div className="w-full relative rounded-none overflow-hidden bg-surface-2 border border-white/5 
            h-[560px] md:h-[380px] lg:h-[420px] 
            flex items-center shadow-2xl group isolate">

            {/* Background Decor (Static) to preventing re-rendering flickering */}
            <div className="absolute top-0 right-0 w-[80%] max-w-[600px] aspect-square bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none mix-blend-overlay z-0" />
            <div className="absolute bottom-0 left-0 w-[60%] max-w-[400px] aspect-square bg-black/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none z-0" />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay z-0" />

            {/* 
                AnimatePresence with direct mapping ensures that exiting and entering slides 
                overlap perfectly using absolute positioning.
            */}
            <AnimatePresence>
                {items.map((item, index) => (
                    index === currentIndex && (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, zIndex: 10 }}
                            exit={{ opacity: 0, zIndex: 0 }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            className="absolute inset-0 w-full h-full"
                        >
                            {/* Dynamic Background Glow for this specific slide */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-15 pointer-events-none`} />

                            <div className="container mx-auto px-6 sm:px-8 md:px-12 py-6 md:py-0 relative z-10 h-full flex items-center">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 w-full items-center h-full">

                                    {/* Text Content */}
                                    <div className="col-span-1 md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left text-white order-2 md:order-1 pt-2 md:pt-0">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                                        >
                                            <span className="inline-block px-3 py-1 rounded-none bg-white/5 border border-white/10 backdrop-blur-md text-[10px] md:text-xs font-bold tracking-[0.2em] text-white/70 uppercase mb-3 shadow-sm">
                                                Featured Artist
                                            </span>
                                            <h1 className="font-bold tracking-tight mb-3 drop-shadow-xl text-white leading-[0.95]"
                                                style={{ fontSize: 'clamp(1.75rem, 3vw + 0.5rem, 3rem)' }}>
                                                {item.title}
                                            </h1>
                                            <p className="text-neutral-400 font-normal leading-relaxed max-w-md mx-auto md:mx-0 line-clamp-2 md:line-clamp-3 mb-6"
                                                style={{ fontSize: 'clamp(0.8rem, 0.8vw + 0.4rem, 0.95rem)' }}>
                                                {item.description}
                                            </p>

                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 w-full">
                                                <PremiumButton
                                                    href={item.href}
                                                    className="rounded-none font-bold h-12 text-sm md:text-base shadow-xl hover:scale-105 transition-all duration-300"
                                                    icon={<Users className="w-5 h-5" />}
                                                >
                                                    View Artist
                                                </PremiumButton>
                                                <div className="flex gap-2">
                                                    <Button size="icon" variant="ghost" className="rounded-none text-white hover:bg-white/10 w-12 h-12 border border-white/5 backdrop-blur-sm group/btn">
                                                        <Heart className="w-5 h-5 group-hover/btn:text-ekko-400 transition-colors" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="rounded-none text-white hover:bg-white/10 w-12 h-12 border border-white/5 backdrop-blur-sm">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </Button>
                                                </div>

                                                {/* Vibe Score Badge */}
                                                {item.vibeScore && (
                                                    <div className="hidden md:flex ml-4 items-center gap-2 px-3 py-1.5 rounded-none bg-black/20 border border-white/10 backdrop-blur-md">
                                                        <span className="w-2 h-2 rounded-full bg-ekko-400 animate-pulse" />
                                                        <span className="text-xs font-bold text-white/90 tracking-wide">{item.vibeScore}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center md:justify-start gap-3 w-full">
                                                <div className="flex -space-x-2">
                                                    {['/song-cover/mga-isla-sa-gitna-natin.png', '/song-cover/groove-ni-chele.png', '/song-cover/si-jai.png', '/song-cover/dito-sa-tiaong.png'].map((src, i) => (
                                                        <div key={i} className="w-7 h-7 rounded-none border border-white/10 overflow-hidden ring-1 ring-black/50">
                                                            <Image src={src} alt="" width={28} height={28} className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className="text-[11px] font-medium text-white/50 tracking-wider">{item.stats}</span>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Image Content */}
                                    <div className="col-span-1 md:col-span-5 relative h-[200px] md:h-[380px] w-full flex items-center justify-center md:justify-end order-1 md:order-2">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, rotate: 2 }}
                                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                                            className="relative w-full h-full max-w-[320px] md:max-w-none filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.5)]"
                                        >
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-contain object-center md:object-right-bottom"
                                                priority={true}
                                                draggable={false}
                                            />
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
                ))}
            </AnimatePresence>

            {/* Indicators - Independent of Slide Transitions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-50">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`h-1.5 rounded-none transition-all duration-500 ease-out border border-black/10 backdrop-blur-sm ${index === currentIndex
                            ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                            : 'w-2 bg-white/20 hover:bg-white/40'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
