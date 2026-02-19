'use client'

import { useEffect, useRef } from 'react'
import { usePlayer } from '@/store/player-store'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { audioService } from '@/services/audio-service'
import { useListeningHistory } from '@/hooks/use-listening-history'

export function AudioProvider() {
    useKeyboardShortcuts()
    const { addToHistory } = useListeningHistory()
    const lastTrackedId = useRef<string | null>(null)

    const {
        queue, currentIndex, isPlaying, volume, isRadio,
        currentStation, radioMetadata, seekRequest, resetSeekRequest
    } = usePlayer()

    const currentSong = queue[currentIndex]

    // 1. Handle Song/Station Change
    useEffect(() => {
        if (isRadio) {
            audioService.play(currentStation.url, true, {
                id: currentStation.id,
                title: radioMetadata.title,
                artist: radioMetadata.artist,
                coverUrl: radioMetadata.coverUrl
            })
        } else if (currentSong) {
            audioService.play(currentSong.audioUrl, false, {
                id: currentSong.id,
                title: currentSong.title,
                artist: currentSong.artist,
                coverUrl: currentSong.coverUrl
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSong?.id, isRadio, currentStation?.id]) // ID checks are stable

    // Track listening history
    useEffect(() => {
        if (currentSong && !isRadio && currentSong.id !== lastTrackedId.current) {
            lastTrackedId.current = currentSong.id
            addToHistory({
                songId: currentSong.id,
                title: currentSong.title,
                artist: currentSong.artist,
                coverUrl: currentSong.coverUrl || '',
            })
        }
    }, [currentSong?.id, isRadio, addToHistory])

    // 2. Handle Play/Pause Toggle
    useEffect(() => {
        if (isPlaying) {
            // Read current state inside the effect to avoid stale closure
            const state = usePlayer.getState()
            const song = state.queue[state.currentIndex]
            if (song || state.isRadio) {
                if (state.isRadio) {
                    audioService.play(state.currentStation.url, true, {
                        id: state.currentStation.id,
                        title: state.radioMetadata.title,
                        artist: state.radioMetadata.artist,
                        coverUrl: state.radioMetadata.coverUrl
                    })
                } else if (song) {
                    audioService.play(song.audioUrl, false, {
                        id: song.id,
                        title: song.title,
                        artist: song.artist,
                        coverUrl: song.coverUrl
                    })
                }
            }
        } else {
            audioService.pause()
        }
    }, [isPlaying])

    // 3. Handle Volume
    useEffect(() => {
        audioService.setVolume(volume)
    }, [volume])

    // 4. Handle Seek
    useEffect(() => {
        if (seekRequest !== null) {
            audioService.seek(seekRequest)
            resetSeekRequest()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seekRequest])

    return null
}
