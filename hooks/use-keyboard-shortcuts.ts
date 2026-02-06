'use client'

import { useEffect, useCallback } from 'react'
import { usePlayer } from '@/store/player-store'

/**
 * Global keyboard shortcuts for the music player.
 * 
 * Shortcuts:
 * - Space: Play/Pause
 * - ArrowRight: Next track
 * - ArrowLeft: Previous track
 * - ArrowUp: Volume up (+10%)
 * - ArrowDown: Volume down (-10%)
 * - M: Mute/Unmute
 * - L: Like current song (placeholder for future)
 */
export function useKeyboardShortcuts() {
    const {
        isPlaying,
        play,
        pause,
        next,
        prev,
        volume,
        setVolume,
        previousVolume,
        setPreviousVolume,
        queue
    } = usePlayer()

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Don't trigger shortcuts when typing in inputs
        const target = e.target as HTMLElement
        if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable
        ) {
            return
        }

        // Don't trigger if no songs are loaded
        const hasSongs = queue.length > 0

        switch (e.code) {
            case 'Space':
                e.preventDefault()
                if (hasSongs) {
                    isPlaying ? pause() : play()
                }
                break

            case 'ArrowRight':
                e.preventDefault()
                if (hasSongs) next()
                break

            case 'ArrowLeft':
                e.preventDefault()
                if (hasSongs) prev()
                break

            case 'ArrowUp':
                e.preventDefault()
                setVolume(Math.min(1, volume + 0.1))
                break

            case 'ArrowDown':
                e.preventDefault()
                setVolume(Math.max(0, volume - 0.1))
                break

            case 'KeyM':
                e.preventDefault()
                // Toggle mute (set to 0 or restore previous volume)
                if (volume > 0) {
                    setPreviousVolume(volume)
                    setVolume(0)
                } else {
                    setVolume(previousVolume || 1)
                }
                break

            case 'KeyL':
                // Placeholder for like functionality
                // TODO: Integrate with liked songs mutation
                break

            default:
                break
        }
    }, [isPlaying, play, pause, next, prev, volume, setVolume, queue])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])
}
