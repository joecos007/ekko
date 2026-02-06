'use client'

import { useEffect, useRef } from 'react'
import { usePlayer } from '@/store/player-store'

export function AudioProvider() {
    const audioRef = useRef<HTMLAudioElement | null>(null)

    const {
        queue,
        currentIndex,
        isPlaying,
        volume,
        next,
        setCurrentTime,
        setDuration,
    } = usePlayer()

    const currentSong = queue[currentIndex]

    useEffect(() => {
        if (!audioRef.current || !currentSong) return

        // Only update src if it changed, to avoid reloading
        // Note: currentSong.audioUrl is the track
        if (audioRef.current.src !== currentSong.audioUrl) {
            audioRef.current.src = currentSong.audioUrl
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Play failed", e))
            }
        }
    }, [currentSong, isPlaying])
    // Dependency on isPlaying logic handled separately?
    // Proper way: 
    // 1. If song changes -> set src -> if isPlaying was true, play.
    // 2. If isPlaying changes -> play/pause.

    useEffect(() => {
        if (!audioRef.current) return
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Play error", e))
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying])

    useEffect(() => {
        if (!audioRef.current) return
        audioRef.current.volume = volume
    }, [volume])

    return (
        <audio
            ref={audioRef}
            onEnded={next}
            onTimeUpdate={() => {
                if (audioRef.current) setCurrentTime(audioRef.current.currentTime)
            }}
            onLoadedMetadata={() => {
                if (audioRef.current) setDuration(audioRef.current.duration)
            }}
            preload="auto"
        />
    )
}
