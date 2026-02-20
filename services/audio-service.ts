import { Howl, Howler } from 'howler'
import { usePlayer } from '@/store/player-store'

const MAX_RETRIES = 3
const LIVE_BUFFER_TIMEOUT_MS = 5000 // Force-play live streams after 5s

class AudioService {
    private sound: Howl | null = null
    private currentTrkId: string | null = null
    private rafId: number | null = null
    private retryCount: number = 0
    private lastProgressUpdate: number = 0
    private bufferTimeoutId: ReturnType<typeof setTimeout> | null = null

    constructor() {
        if (typeof window !== 'undefined') {
            Howler.autoUnlock = true
            Howler.html5PoolSize = 10
        }
    }

    private clearBufferTimeout() {
        if (this.bufferTimeoutId) {
            clearTimeout(this.bufferTimeoutId)
            this.bufferTimeoutId = null
        }
    }

    play(src: string, isLive: boolean, metadata?: { id: string, title: string, artist: string, coverUrl: string }) {
        // 1. Check if same track — resume if paused
        if (this.sound && this.currentTrkId === metadata?.id) {
            if (!this.sound.playing()) {
                this.sound.fade(0, usePlayer.getState().volume, 200)
                this.sound.play()
                this.startProgressLoop()
            }
            return
        }

        // 2. New track: Cleanup previous
        this.cleanup()

        this.currentTrkId = metadata?.id || 'unknown'
        this.retryCount = 0
        const store = usePlayer.getState()
        store.setIsLoading(true)

        let hasStartedPlaying = false

        this.sound = new Howl({
            src: [src],
            html5: true,
            preload: true,
            volume: 0,
            onplay: () => {
                hasStartedPlaying = true
                this.clearBufferTimeout()
                store.setIsLoading(false)
                store.setDuration(isLive ? Infinity : this.sound?.duration() || 0)
                this.startProgressLoop()
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
                if (!isLive && store.currentTime > 0) {
                    this.sound?.seek(store.currentTime)
                }
                // Resume playback only if still intended
                if (store.isPlaying && !this.sound?.playing()) {
                    this.sound?.play()
                }
                // Clear any previous radio error on successful load
                if (isLive) {
                    store.clearRadioError()
                }
            },
            onloaderror: (_id, err) => {
                console.warn('[AudioService] Load Error:', err)
                this.clearBufferTimeout()
                if (this.retryCount < MAX_RETRIES) {
                    this.retryCount++
                    const delay = Math.min(1000 * Math.pow(2, this.retryCount - 1), 5000)
                    console.log(`[AudioService] Retry ${this.retryCount}/${MAX_RETRIES} in ${delay}ms`)
                    setTimeout(() => this.sound?.load(), delay)
                } else {
                    store.setIsLoading(false)
                    if (isLive) {
                        store.setRadioError('Stream unavailable. Try another station.')
                    }
                    console.error('[AudioService] Max retries reached, giving up.')
                }
            },
            onplayerror: (_id, err) => {
                console.warn('[AudioService] Play Error:', err)
                this.sound?.once('unlock', () => {
                    this.sound?.play()
                })
            }
        })

        this.sound.play()

        // For live streams: force-start after timeout to avoid infinite buffering
        if (isLive) {
            this.bufferTimeoutId = setTimeout(() => {
                if (!hasStartedPlaying && this.sound && !this.sound.playing()) {
                    console.log('[AudioService] Buffer timeout reached, force-starting playback')
                    store.setIsLoading(false)
                    store.setDuration(Infinity)
                    this.startProgressLoop()
                    this.sound.fade(0, store.volume, 300)
                    this.updateMediaSession(metadata, isLive)
                }
            }, LIVE_BUFFER_TIMEOUT_MS)
        }
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

    /** Full cleanup of current sound and timers */
    private cleanup() {
        this.clearBufferTimeout()
        this.stopProgressLoop()
        if (this.sound) {
            this.sound.unload()
            this.sound = null
        }
    }

    private startProgressLoop() {
        if (this.rafId) cancelAnimationFrame(this.rafId)

        const loop = () => {
            if (this.sound && this.sound.playing()) {
                const now = performance.now()
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

    private updateMediaSession(metadata: { id: string, title: string, artist: string, coverUrl: string } | undefined, isLive: boolean) {
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
