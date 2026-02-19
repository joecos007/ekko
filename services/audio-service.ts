import { Howl, Howler } from 'howler'
import { usePlayer } from '@/store/player-store'

class AudioService {
    private sound: Howl | null = null
    private currentTrkId: string | null = null
    private rafId: number | null = null
    private retryCount: number = 0
    private lastProgressUpdate: number = 0

    constructor() {
        // Global configuration
        if (typeof window !== 'undefined') {
            Howler.autoUnlock = true
            Howler.html5PoolSize = 10
        }
    }

    play(src: string, isLive: boolean, metadata?: { id: string, title: string, artist: string, coverUrl: string }) {
        // 1. Check if same track
        if (this.sound && this.currentTrkId === metadata?.id) {
            // Same track: If paused, resume.
            if (!this.sound.playing()) {
                this.sound.fade(0, usePlayer.getState().volume, 200)
                this.sound.play()
                this.startProgressLoop()
            }
            return
        }

        // 2. New track: Cleanup previous
        if (this.sound) {
            this.sound.unload()
            this.sound = null
        }

        this.currentTrkId = metadata?.id || 'unknown'
        this.retryCount = 0
        const store = usePlayer.getState()
        store.setIsLoading(true)

        this.sound = new Howl({
            src: [src],
            html5: true, // Force HTML5 Audio for streaming/large files
            preload: true,
            volume: 0, // Start silent for fade-in
            format: isLive ? ['mp3'] : undefined,
            onplay: () => {
                store.setIsLoading(false)
                store.setDuration(isLive ? Infinity : this.sound?.duration() || 0)
                this.startProgressLoop()

                // Fade In
                this.sound?.fade(0, store.volume, 300)

                this.updateMediaSession(metadata, isLive)
            },
            onend: () => {
                if (!isLive) {
                    store.next()
                }
            },
            onpause: () => {
                this.stopProgressLoop()
            },
            onstop: () => {
                this.stopProgressLoop()
            },
            onload: () => {
                // Determine if we need to seek (e.g. resumption)
                if (!isLive && store.currentTime > 0) {
                    this.sound?.seek(store.currentTime)
                }
                // If we were supposed to be playing, but aren't (e.g. load finished late), play now
                if (store.isPlaying && !this.sound?.playing()) {
                    this.sound?.play()
                }
            },
            onloaderror: (id, err) => {
                console.warn('[AudioService] Load Error:', err)
                if (this.retryCount < 1) {
                    this.retryCount++
                    setTimeout(() => this.sound?.load(), 1000)
                } else {
                    store.setIsLoading(false)
                    // Optionally trigger next() or error state
                }
            },
            onplayerror: (id, err) => {
                console.warn('[AudioService] Play Error:', err)
                this.sound?.once('unlock', () => {
                    this.sound?.play()
                })
            }
        })

        this.sound.play()
    }

    pause() {
        if (this.sound && this.sound.playing()) {
            this.sound.fade(this.sound.volume(), 0, 200)
            this.sound.once('fade', () => {
                this.sound?.pause()
                this.stopProgressLoop()
            })
        }
    }

    seek(time: number) {
        if (this.sound) {
            this.sound.seek(time)
            usePlayer.getState().setCurrentTime(time)
        }
    }

    setVolume(volume: number) {
        if (this.sound) {
            this.sound.volume(volume)
        }
    }

    private startProgressLoop() {
        if (this.rafId) cancelAnimationFrame(this.rafId)

        const loop = () => {
            if (this.sound && this.sound.playing()) {
                const now = performance.now()
                // Throttle state updates to ~4Hz (every 250ms)
                if (now - this.lastProgressUpdate >= 250) {
                    const seek = this.sound.seek()
                    usePlayer.getState().setCurrentTime(typeof seek === 'number' ? seek : 0)
                    this.lastProgressUpdate = now
                }
                this.rafId = requestAnimationFrame(loop)
            }
        }
        loop()
    }

    private stopProgressLoop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId)
            this.rafId = null
        }
    }

    // Bridge to MediaSession API
    private updateMediaSession(metadata: any, isLive: boolean) {
        if ('mediaSession' in navigator && metadata) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: metadata.title,
                artist: metadata.artist,
                artwork: [{ src: metadata.coverUrl || '/placeholder.png', sizes: '512x512', type: 'image/png' }]
            })

            navigator.mediaSession.setActionHandler('play', () => usePlayer.getState().play())
            navigator.mediaSession.setActionHandler('pause', () => usePlayer.getState().pause())
            navigator.mediaSession.setActionHandler('previoustrack', () => usePlayer.getState().prev())
            navigator.mediaSession.setActionHandler('nexttrack', () => usePlayer.getState().next())
            navigator.mediaSession.setActionHandler('seekto', (details) => {
                if (!isLive && details.seekTime) usePlayer.getState().requestSeek(details.seekTime)
            })
        }
    }
}

export const audioService = new AudioService()
