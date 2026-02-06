import { create } from 'zustand'

export type Song = {
    id: string
    title: string
    audioUrl: string
    duration: number
    artist: string
    coverUrl: string
}

type PlayerState = {
    queue: Song[]
    currentIndex: number
    isPlaying: boolean
    volume: number
    currentTime: number
    duration: number
    shuffle: boolean
    repeat: 'off' | 'one' | 'all'

    setQueue: (songs: Song[], startIndex?: number) => void
    play: () => void
    pause: () => void
    next: () => void
    prev: () => void
    setVolume: (v: number) => void
    setCurrentTime: (t: number) => void
    setDuration: (d: number) => void
    toggleShuffle: () => void
    cycleRepeat: () => void
    isExpanded: boolean
    toggleExpanded: () => void
    setExpanded: (expanded: boolean) => void

    seekRequest: number | null
    resetSeekRequest: () => void
    requestSeek: (time: number) => void

    previousVolume: number
    setPreviousVolume: (v: number) => void
}

export const usePlayer = create<PlayerState>((set, get) => ({
    queue: [],
    currentIndex: 0,
    isPlaying: false,
    volume: 1,
    currentTime: 0,
    duration: 0,
    shuffle: false,
    repeat: 'off',

    setQueue: (songs, startIndex = 0) =>
        set({ queue: songs, currentIndex: startIndex, isPlaying: true }),

    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),

    next: () => {
        const { queue, currentIndex, shuffle, repeat } = get()
        if (queue.length === 0) return

        let nextIndex = currentIndex + 1

        if (shuffle) {
            nextIndex = Math.floor(Math.random() * queue.length)
        }

        if (nextIndex >= queue.length) {
            if (repeat === 'all') {
                nextIndex = 0
            } else {
                set({ isPlaying: false })
                return
            }
        }

        set({ currentIndex: nextIndex, isPlaying: true })
    },

    prev: () => {
        const { currentIndex, currentTime } = get()
        if (currentTime > 3) {
            // Logic to replay song will be handled by UI consuming this state
            // For now, we update state, but usually we need a way to signal "seek to 0" 
            // We'll rely on the AudioProvider listening to 'currentIndex' change or explicit seek
            // But preventing 'prev' means we just stay on current index.
            // We'll leave it as is for now: UI sets audio.currentTime = 0 if detecting this?
            // Actually, best to just decrement index if possible, or do nothing.
            // Simplified:
        }

        if (currentIndex > 0) {
            set({ currentIndex: currentIndex - 1, isPlaying: true })
        }
    },

    setVolume: (v) => set({ volume: v }),

    setCurrentTime: (t) => set({ currentTime: t }),
    setDuration: (d) => set({ duration: d }),

    toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
    cycleRepeat: () => set((s) => ({
        repeat: s.repeat === 'off' ? 'all' : s.repeat === 'all' ? 'one' : 'off'
    })),

    isExpanded: false,
    toggleExpanded: () => set((s) => ({ isExpanded: !s.isExpanded })),
    setExpanded: (expanded: boolean) => set({ isExpanded: expanded }),

    seekRequest: null,
    resetSeekRequest: () => set({ seekRequest: null }),
    requestSeek: (time: number) => set({ seekRequest: time, currentTime: time }),

    previousVolume: 0,
    setPreviousVolume: (v: number) => set({ previousVolume: v })
}))
