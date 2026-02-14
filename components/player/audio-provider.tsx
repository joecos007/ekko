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
        prev,
        play,
        pause,
        currentTime,
        setCurrentTime,
        setDuration,
        isRadio,
        toggleRadio
    } = usePlayer()

    const currentSong = queue[currentIndex]

    // MediaSession API Implementation
    useEffect(() => {
        if (!('mediaSession' in navigator)) return

        const { currentStation, radioMetadata } = usePlayer.getState()

        if (isRadio) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: radioMetadata.title || "Live Radio",
                artist: radioMetadata.artist || "EKKO",
                artwork: [
                    { src: radioMetadata.coverUrl || "/digital-village.png", sizes: "512x512", type: "image/png" }
                ]
            })
        } else if (currentSong) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentSong.title,
                artist: currentSong.artist,
                artwork: [
                    { src: currentSong.coverUrl, sizes: "512x512", type: "image/png" }
                ]
            })
        }

        // Action Handlers
        navigator.mediaSession.setActionHandler('play', () => play())
        navigator.mediaSession.setActionHandler('pause', () => pause())
        navigator.mediaSession.setActionHandler('previoustrack', () => prev())
        navigator.mediaSession.setActionHandler('nexttrack', () => next())

        navigator.mediaSession.setActionHandler('seekto', (details) => {
            if (isRadio) return
            if (details.seekTime !== undefined) {
                usePlayer.getState().requestSeek(details.seekTime)
            }
        })

        return () => {
            // Cleanup if needed, though usually not strictly necessary for singleton player
            // navigator.mediaSession.metadata = null
        }

    }, [currentSong, isRadio, usePlayer.getState().currentStation, usePlayer.getState().radioMetadata])

    // Helper to start the animation frame loop
    const startProgressLoop = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)

        const loop = () => {
            if (soundRef.current && soundRef.current.playing()) {
                const seek = soundRef.current.seek()
                // Update global currentTime (used for VibeStream and Progress)
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

        const { currentStation } = usePlayer.getState()

        if (isRadio) {
            // EKKO Live Radio Stream
            src = currentStation.url
            isLive = true
        } else if (currentSong) {
            src = currentSong.audioUrl
        } else {
            // Set playback state to none if nothing is playing
            if ('mediaSession' in navigator) {
                navigator.mediaSession.playbackState = "none"
            }
            return
        }

        // Update MediaSession Playback State
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused"
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
                // Verify seek on load if resuming song
                if (!isLive && usePlayer.getState().currentTime > 0) {
                    sound.seek(usePlayer.getState().currentTime)
                }
            },
            onloaderror: (id, err) => {
                // If it's a load error 4 with a live stream, it might just be a connection blip or empty stream.
                // We'll suppress the loud error for user experience and maybe retry silently once.
                console.warn('Audio Load Warning:', err)
                if (isLive) {
                    // Retry logic: wait 2s and try to reload if it was a stream error
                    setTimeout(() => {
                        if (usePlayer.getState().isRadio) {
                            sound.load()
                        }
                    }, 2000)
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
            try {
                sound.volume(0)
                // If we are resuming a song (not radio) and have a saved time, seek first
                if (!isLive && currentTime > 0) {
                    sound.seek(currentTime)
                }

                const playResult = sound.play() as any;
                if (playResult && typeof playResult.catch === 'function') {
                    playResult.catch((err: any) => {
                        if (err.name === 'AbortError') {
                            console.log('Play request was interrupted (AbortError), safe to ignore.');
                        } else {
                            console.error('Play Promise Error:', err);
                        }
                    });
                }
                sound.fade(0, volume, 50)
            } catch (e) {
                console.error('Immediate play error:', e);
            }
        }

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            sound.unload()
        }
    }, [currentSong, isRadio, usePlayer.getState().currentStation]) // Re-run when song changes OR radio mode toggles OR station changes

    // Handle Play/Pause State
    useEffect(() => {
        const sound = soundRef.current
        if (!sound) return

        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused"
        }

        if (isPlaying) {
            if (!sound.playing()) {
                sound.volume(0)
                // Ensure we seek to current time if resuming
                // Check if it's NOT radio before seeking (Radio streams shouldn't seek)
                if (!usePlayer.getState().isRadio && currentTime > 0) {
                    sound.seek(currentTime)
                }

                sound.play()
                sound.fade(0, volume, 50)
            }
        } else {
            if (sound.playing()) {
                // Fade out before pausing
                sound.fade(volume, 0, 50)
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
