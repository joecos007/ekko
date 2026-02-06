'use client'

import { useEffect, useRef } from 'react'
import { usePlayer } from '@/store/player-store'
import { Howl } from 'howler'

export function AudioProvider() {
    const soundRef = useRef<Howl | null>(null)
    const rafRef = useRef<number | null>(null)

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

    // Helper to start the animation frame loop
    const startProgressLoop = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)

        const loop = () => {
            if (soundRef.current && soundRef.current.playing()) {
                const seek = soundRef.current.seek()
                setCurrentTime(typeof seek === 'number' ? seek : 0)
                rafRef.current = requestAnimationFrame(loop)
            }
        }
        loop()
    }

    // Initialize or change song
    useEffect(() => {
        if (!currentSong) return

        // Unload previous sound to free resources
        if (soundRef.current) {
            soundRef.current.unload()
        }

        const sound = new Howl({
            src: [currentSong.audioUrl],
            html5: true, // Forces HTML5 Audio to support large files/streaming
            volume: volume,
            onplay: () => {
                setDuration(sound.duration())
                startProgressLoop()
            },
            onpause: () => {
                if (rafRef.current) cancelAnimationFrame(rafRef.current)
            },
            onstop: () => {
                if (rafRef.current) cancelAnimationFrame(rafRef.current)
            },
            onend: () => {
                next()
            },
            onload: () => {
                setDuration(sound.duration())
            },
            onloaderror: (id, err) => {
                console.error('Load Error:', err)
            },
            onplayerror: (id, err) => {
                console.error('Play Error:', err)
                sound.once('unlock', () => {
                    sound.play()
                })
            }
        })

        soundRef.current = sound

        if (isPlaying) {
            // Smooth fade in
            sound.volume(0)
            sound.play()
            sound.fade(0, volume, 500)
        }

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            sound.unload()
        }
    }, [currentSong]) // Re-run only when song changes

    // Handle Play/Pause State
    useEffect(() => {
        const sound = soundRef.current
        if (!sound) return

        if (isPlaying) {
            if (!sound.playing()) {
                sound.volume(0)
                sound.play()
                sound.fade(0, volume, 300)
            }
        } else {
            if (sound.playing()) {
                // Fade out before pausing
                sound.fade(volume, 0, 300)
                sound.once('fade', () => {
                    if (!isPlaying) sound.pause() // Check isPlaying again in case user spammed play
                })
            }
        }
    }, [isPlaying])

    // Handle Volume Changes
    useEffect(() => {
        const sound = soundRef.current
        if (sound) {
            sound.volume(volume)
        }
    }, [volume])

    // Handle Seek Requests
    useEffect(() => {
        const { seekRequest, resetSeekRequest } = usePlayer.getState()
        if (seekRequest !== null && soundRef.current) {
            soundRef.current.seek(seekRequest)
            resetSeekRequest()
        }
    }, [usePlayer.getState().seekRequest])

    return null // Howler handles audio without visual element
}
