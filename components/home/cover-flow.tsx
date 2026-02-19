'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface Album {
    id: string
    title: string
    artist: string
    cover: string
    color: string
}

// Sample data - in a real app this would come from props or API
const ALBUMS: Album[] = [
    {
        id: '1',
        title: "Mga Isla Sa Gitna Natin",
        artist: "Team Ekko",
        cover: "/song-cover/mga-isla-sa-gitna-natin.png",
        color: "from-blue-600 to-indigo-600"
    },
    {
        id: '2',
        title: "Groove Ni Chele",
        artist: "Chele",
        cover: "/song-cover/groove-ni-chele.png",
        color: "from-purple-500 to-pink-500"
    },
    {
        id: '3',
        title: "Dito Sa Tiaong",
        artist: "Tiaong Sound",
        cover: "/song-cover/dito-sa-tiaong.png",
        color: "from-emerald-500 to-teal-500"
    },
    {
        id: '4',
        title: "Sarap Ng Buhay",
        artist: "Isla Beats",
        cover: "/song-cover/sarap-ng-buhay.png",
        color: "from-orange-400 to-red-500"
    },
    {
        id: '5',
        title: "Uwian Na",
        artist: "Uwian",
        cover: "/song-cover/uwian-na.png",
        color: "from-cyan-500 to-blue-500"
    }
]

export function CoverFlow() {
    const [currentIndex, setCurrentIndex] = useState(2) // Start in middle
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % ALBUMS.length)
        setIsAutoPlaying(false)
    }

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + ALBUMS.length) % ALBUMS.length)
        setIsAutoPlaying(false)
    }

    useEffect(() => {
        if (!isAutoPlaying) return
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ALBUMS.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [isAutoPlaying])

    return (
        <div className="relative w-full h-[60vh] min-h-[500px] flex flex-col items-center justify-center overflow-hidden perspective-1000 py-8">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-1/50 to-surface-1 z-0 pointer-events-none" />

            {/* Background dynamic glow */}
            <div className="absolute inset-0 opacity-40 blur-3xl transition-colors duration-1000 ease-in-out">
                <div className={`w-full h-full bg-gradient-to-t ${ALBUMS[currentIndex].color} to-transparent`} />
            </div>

            {/* 3D Carousel (Images ONLY) */}
            <div className="relative w-full max-w-6xl mx-auto flex-1 flex items-center justify-center z-10 perspective-1000">
                <AnimatePresence mode='popLayout'>
                    {ALBUMS.map((album, index) => {
                        let position = index - currentIndex
                        if (position < -2) position += ALBUMS.length
                        if (position > 2) position -= ALBUMS.length

                        if (Math.abs(position) > 2) return null

                        const isActive = position === 0
                        const zIndex = 10 - Math.abs(position)

                        return (
                            <motion.div
                                key={album.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{
                                    x: `${position * 70}%`,
                                    scale: isActive ? 1 : 0.7,
                                    opacity: isActive ? 1 : 0.3,
                                    rotateY: position * -25,
                                    z: -Math.abs(position) * 150,
                                    zIndex: zIndex
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 25
                                }}
                                className="absolute w-[35vh] md:w-[45vh] aspect-square max-w-[450px] max-h-[450px] origin-center cursor-pointer"
                                onClick={() => {
                                    setCurrentIndex(index)
                                    setIsAutoPlaying(false)
                                }}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* Pristine Image Card - No Overlays */}
                                <div className={`relative w-full h-full rounded-none overflow-hidden shadow-2xl transition-all duration-500 ${isActive ? 'shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10' : ''}`}>
                                    <img
                                        src={album.cover}
                                        alt={album.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Reflection */}
                                <div className="absolute top-full left-0 right-0 h-full mt-4 scale-y-[-1] opacity-30 pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent)]">
                                    <img
                                        src={album.cover}
                                        className="w-full h-full object-cover rounded-none blur-sm"
                                        alt=""
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-1 to-surface-1" />
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>

            {/* External Metadata (Floating Below) */}
            <div className="relative z-20 mt-8 flex flex-col items-center justify-center text-center px-4 h-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center"
                    >
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 drop-shadow-2xl">
                            {ALBUMS[currentIndex].title}
                        </h2>
                        <p className="text-xl md:text-2xl text-white/80 font-medium mb-6 tracking-wide">
                            {ALBUMS[currentIndex].artist}
                        </p>

                        <div className="flex items-center gap-6">
                            <Button size="lg" className="rounded-full bg-white text-black hover:bg-neutral-200 font-bold px-10 h-14 text-lg shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform">
                                <Play className="w-5 h-5 fill-black mr-2" />
                                Listen Now
                            </Button>

                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handlePrev}
                                    className="rounded-full border-white/10 hover:bg-white/10 w-12 h-12"
                                >
                                    <ChevronLeft className="w-6 h-6 text-white" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleNext}
                                    className="rounded-full border-white/10 hover:bg-white/10 w-12 h-12"
                                >
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
