'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { LayoutGrid, Play, Headphones, Music, Mic2, Radio, Sparkles, Zap, Coffee } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MagicCard } from '@/components/ui/magic-card'
import { TextAnimate } from '@/components/ui/text-animate'

const CATEGORIES = [
    { name: 'Pop', emoji: '🎵', gradient: 'from-pink-500/20 to-rose-600/20', border: 'hover:border-pink-500/30', query: 'pop' },
    { name: 'Hip-Hop', emoji: '🎤', gradient: 'from-amber-500/20 to-orange-600/20', border: 'hover:border-amber-500/30', query: 'hip-hop' },
    { name: 'R&B', emoji: '💜', gradient: 'from-purple-500/20 to-violet-600/20', border: 'hover:border-purple-500/30', query: 'r&b' },
    { name: 'Lo-Fi', emoji: '🌙', gradient: 'from-blue-500/20 to-indigo-600/20', border: 'hover:border-blue-500/30', query: 'lo-fi' },
    { name: 'Electronic', emoji: '⚡', gradient: 'from-cyan-500/20 to-teal-600/20', border: 'hover:border-cyan-500/30', query: 'electronic' },
    { name: 'Rock', emoji: '🎸', gradient: 'from-red-500/20 to-rose-700/20', border: 'hover:border-red-500/30', query: 'rock' },
    { name: 'Jazz', emoji: '🎷', gradient: 'from-yellow-500/20 to-amber-600/20', border: 'hover:border-yellow-500/30', query: 'jazz' },
    { name: 'Classical', emoji: '🎻', gradient: 'from-emerald-500/20 to-green-600/20', border: 'hover:border-emerald-500/30', query: 'classical' },
    { name: 'Indie', emoji: '🌿', gradient: 'from-lime-500/20 to-emerald-600/20', border: 'hover:border-lime-500/30', query: 'indie' },
    { name: 'Acoustic', emoji: '🪕', gradient: 'from-orange-500/20 to-yellow-600/20', border: 'hover:border-orange-500/30', query: 'acoustic' },
    { name: 'Chill', emoji: '🧊', gradient: 'from-sky-500/20 to-blue-600/20', border: 'hover:border-sky-500/30', query: 'chill' },
    { name: 'Workout', emoji: '🔥', gradient: 'from-red-600/20 to-orange-500/20', border: 'hover:border-red-600/30', query: 'workout' },
]

export default function CategoriesPage() {
    const router = useRouter()

    return (
        <div className="px-4 md:px-8 py-8 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-none bg-ekko-500/10 border border-ekko-500/20">
                        <LayoutGrid className="w-6 h-6 text-ekko-400" />
                    </div>
                    <TextAnimate animation="blurInUp" by="word" className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                        Browse Categories
                    </TextAnimate>
                </div>
                <p className="text-neutral-400 text-sm md:text-base ml-14">
                    Explore music by genre, mood, or activity.
                </p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {CATEGORIES.map((category) => (
                    <button
                        key={category.name}
                        onClick={() => router.push(`/search?q=${encodeURIComponent(category.query)}`)}
                        className="group text-left"
                    >
                        <MagicCard
                            className={cn(
                                "relative overflow-hidden rounded-none border border-white/5 p-6 md:p-8 transition-all duration-300 cursor-pointer",
                                "bg-gradient-to-br",
                                category.gradient,
                                category.border,
                                "hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                            )}
                            gradientColor="rgba(99, 102, 241, 0.05)"
                        >
                            <div className="flex flex-col gap-3">
                                <span className="text-4xl md:text-5xl">{category.emoji}</span>
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-ekko-300 transition-colors">
                                        {category.name}
                                    </h3>
                                </div>
                            </div>
                            {/* Decorative glow */}
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </MagicCard>
                    </button>
                ))}
            </div>
        </div>
    )
}
