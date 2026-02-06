'use client'

import { usePlayer } from '@/store/player-store'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { ChevronDown, Heart, MoreHorizontal, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, ListMusic } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { MediaItemActionMenu } from '@/components/media/media-item-action-menu'

export function NowPlayingView() {
    const {
        queue,
        currentIndex,
        isPlaying,
        toggleExpanded,
        isExpanded,
        play,
        pause,
        next,
        prev,
        shuffle,
        toggleShuffle,
        repeat,
        cycleRepeat,
        currentTime,
        duration,
        setCurrentTime,
        setDuration
    } = usePlayer()

    const [sliderValue, setSliderValue] = useState([0])
    const [isDragging, setIsDragging] = useState(false)

    const song = queue[currentIndex]

    useEffect(() => {
        if (!isDragging) {
            setSliderValue([currentTime])
        }
    }, [currentTime, isDragging])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    if (!isExpanded || !song) return null

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col font-geist-sans">
            {/* Background Blur */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {song.coverUrl && (
                    <Image
                        src={song.coverUrl}
                        alt="Background"
                        fill
                        className="object-cover blur-3xl opacity-40 scale-110"
                    />
                )}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between p-6 pt-12 md:pt-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleExpanded}
                    className="text-white hover:bg-white/10 rounded-full h-10 w-10"
                >
                    <ChevronDown className="w-6 h-6" />
                </Button>
                <span className="text-xs font-bold tracking-widest uppercase text-white/70">Now Playing</span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 rounded-full h-10 w-10"
                >
                    <MoreHorizontal className="w-6 h-6" />
                </Button>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 max-w-2xl mx-auto w-full">
                {/* Album Art */}
                <div className="w-full aspect-square relative mb-12 shadow-2xl rounded-lg overflow-hidden ring-1 ring-white/10">
                    {song.coverUrl ? (
                        <Image
                            src={song.coverUrl}
                            alt={song.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                            <span className="text-neutral-700">No Art</span>
                        </div>
                    )}
                </div>

                {/* Track Info */}
                <div className="w-full flex items-end justify-between mb-8">
                    <div className="flex flex-col">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight tracking-tight">{song.title}</h1>
                        <p className="text-xl text-neutral-400 font-medium">{song.artist}</p>
                    </div>

                    <div className="flex items-center gap-4 mb-2">
                        {/* Action Menu integration */}
                        <MediaItemActionMenu songId={song.id} songTitle={song.title} artistName={song.artist}>
                            <Button size="icon" variant="ghost" className="text-neutral-400 hover:text-white hover:scale-110 transition-transform">
                                <Heart className="w-8 h-8" />
                            </Button>
                        </MediaItemActionMenu>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full mb-8 group">
                    <Slider
                        value={sliderValue}
                        max={duration || 100}
                        step={1}
                        onValueChange={(val) => {
                            setIsDragging(true)
                            setSliderValue(val)
                        }}
                        onValueCommit={(val) => {
                            setIsDragging(false)
                            const player = document.querySelector('audio')
                            if (player) {
                                player.currentTime = val[0]
                                setCurrentTime(val[0])
                            }
                        }}
                        className="w-full hover:cursor-pointer py-4"
                    />
                    <div className="flex justify-between text-xs font-medium text-neutral-500 font-mono mt-2 group-hover:text-neutral-400 transition-colors">
                        <span>{formatTime(sliderValue[0])}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="w-full flex items-center justify-between max-w-sm mx-auto">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleShuffle}
                        className={cn("text-neutral-400 hover:text-white transition-colors", shuffle && "text-green-400 hover:text-green-300")}
                    >
                        <Shuffle className="w-5 h-5" />
                    </Button>

                    <Button variant="ghost" size="icon" onClick={prev} className="scale-125 text-white hover:text-neutral-300">
                        <SkipBack className="w-8 h-8 fill-current" />
                    </Button>

                    <Button
                        size="icon"
                        onClick={isPlaying ? pause : play}
                        className="h-20 w-20 rounded-full bg-white text-black hover:scale-105 transition-transform shadow-xl hover:bg-neutral-200"
                    >
                        {isPlaying ? (
                            <Pause className="h-8 w-8 fill-current" />
                        ) : (
                            <Play className="h-8 w-8 fill-current ml-1" />
                        )}
                    </Button>

                    <Button variant="ghost" size="icon" onClick={next} className="scale-125 text-white hover:text-neutral-300">
                        <SkipForward className="w-8 h-8 fill-current" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={cycleRepeat}
                        className={cn("text-neutral-400 hover:text-white transition-colors relative", repeat !== 'off' && "text-green-400 hover:text-green-300")}
                    >
                        <Repeat className="w-5 h-5" />
                        {repeat === 'one' && <span className="absolute top-2 right-2 text-[8px] font-bold">1</span>}
                    </Button>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="relative z-10 w-full p-8 flex justify-between items-center max-w-2xl mx-auto">
                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
                    <ListMusic className="w-5 h-5" />
                </Button>
            </div>
        </div>
    )
}
