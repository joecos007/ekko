'use client'

import { useEffect, useRef } from 'react'
import { usePlayer } from '@/store/player-store'
import { Howl } from 'howler'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

export function AudioProvider() {
    // Enable global keyboard shortcuts
    useKeyboardShortcuts()
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
        isRadio,
        toggleRadio
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
        // Unload previous sound to free resources
        if (soundRef.current) {
            soundRef.current.unload()
        }

        let src = ""
        let isLive = false

        if (isRadio) {
            // EKKO Live Radio Stream (Mock URL for now, or use a real Icecast stream)
            // Using a reliable chill stream for demo purposes
            src = "https://stream.zeno.fm/f3wvbbqmdg8uv" // Example stable stream
            isLive = true
        } else if (currentSong) {
            src = currentSong.audioUrl
        } else {
            // No radio and no song? Do nothing.
            return
        }

        const sound = new Howl({
            src: [src],
            html5: true, // Forces HTML5 Audio to support large files/streaming
            volume: volume,
            format: isLive ? ['mp3'] : undefined,
            onplay: () => {
                setDuration(isLive ? Infinity : sound.duration())
                startProgressLoop()
            },
            onpause: () => {
                if (rafRef.current) cancelAnimationFrame(rafRef.current)
            },
            onstop: () => {
                if (rafRef.current) cancelAnimationFrame(rafRef.current)
            },
            onend: () => {
                if (!isLive) next()
            },
            onload: () => {
                setDuration(isLive ? Infinity : sound.duration())
            },
            onloaderror: (id, err) => {
                console.error('Load Error:', err)
                if (isLive) {
                    // Simple retry logic could go here
                    // toggleRadio() // Turn off if failed?
                }
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
    }, [currentSong, isRadio]) // Re-run when song changes OR radio mode toggles

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
