'use client'

import { Music2, Mic2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LyricsViewProps {
    songTitle?: string
    artist?: string
    className?: string
}

export function LyricsView({ songTitle, artist, className }: LyricsViewProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center text-center px-8 py-12", className)}>
            <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-ekko-500/10 flex items-center justify-center">
                    <Mic2 className="w-8 h-8 text-ekko-400" />
                </div>
                <div className="absolute -inset-2 rounded-full border border-ekko-500/20 animate-pulse" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">Lyrics</h3>

            {songTitle && (
                <p className="text-sm text-neutral-400 mb-6">
                    {songTitle} {artist && <span className="text-neutral-600">by {artist}</span>}
                </p>
            )}

            <div className="space-y-3 max-w-xs">
                <p className="text-neutral-500 text-sm leading-relaxed">
                    Synced lyrics are coming soon. We&apos;re working on bringing real-time lyrics to every track.
                </p>
                <div className="flex items-center justify-center gap-2 text-ekko-400/60 text-xs font-medium">
                    <Music2 className="w-3.5 h-3.5" />
                    <span>Stay tuned for updates</span>
                </div>
            </div>
        </div>
    )
}
