import { create } from 'zustand'

export type Song = {
    id: string
    title: string
    audioUrl: string
    duration: number
    artist: string
    coverUrl: string
}

export type RadioStation = {
    id: string
    name: string
    url: string
    style: string
    cover?: string
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
    togglePlay: () => void
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

    isRadio: boolean
    radioMetadata: {
        title: string
        artist: string
        coverUrl: string
        listeners: number
    }
    stations: RadioStation[]
    currentStation: RadioStation
    toggleRadio: () => void
    setRadioMetadata: (metadata: Partial<{ title: string; artist: string; coverUrl: string; listeners: number }>) => void
    setStation: (station: RadioStation) => void
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
        set({ queue: songs, currentIndex: startIndex, isPlaying: true, isRadio: false }),

    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),
    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

    next: () => {
        const { queue, currentIndex, shuffle, repeat, isRadio, stations, currentStation, setStation } = get()

        if (isRadio) {
            const currentStationIndex = stations.findIndex(s => s.id === currentStation.id)
            const nextStationIndex = (currentStationIndex + 1) % stations.length
            setStation(stations[nextStationIndex])
            return
        }

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
        const { currentIndex, currentTime, isRadio, stations, currentStation, setStation } = get()

        if (isRadio) {
            const currentStationIndex = stations.findIndex(s => s.id === currentStation.id)
            const prevStationIndex = (currentStationIndex - 1 + stations.length) % stations.length
            setStation(stations[prevStationIndex])
            return
        }

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
    requestSeek: (time: number) => {
        const { duration } = get()
        const clamped = duration > 0 ? Math.max(0, Math.min(time, duration)) : Math.max(0, time)
        set({ seekRequest: clamped, currentTime: clamped })
    },

    previousVolume: 1,
    setPreviousVolume: (v: number) => set({ previousVolume: v }),

    // Live Radio State
    isRadio: false,
    radioMetadata: {
        title: "SMOOTH JAZZ & POP",
        artist: "Global Radio",
        coverUrl: "/digital-village.png",
        listeners: 0
    },

    // Station Logic
    stations: [
        {
            id: 'smooth-jazz',
            name: 'Smooth Jazz & Pop',
            url: 'https://smoothjazz.cdnstream1.com/2585_128.mp3',
            style: 'Jazz / Pop',
            cover: '/images/stations/jazz.jpg' // Placeholder, will fallback
        },
        {
            id: 'lofi-beats',
            name: 'Lofi Hip Hop',
            url: 'https://stream.zeno.fm/0r0xa792kwzuv',
            style: 'Chill / Study',
            cover: '/images/stations/lofi.jpg'
        },
        {
            id: 'classical',
            name: 'Classical Flow',
            url: 'https://icecast.radiofrance.fr/francemusiqueeasyclassique-midfi.mp3',
            style: 'Classical / Focus',
            cover: '/images/stations/classical.jpg'
        },
        {
            id: 'ambient',
            name: 'Deep Ambient',
            url: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
            style: 'Sleep / Meditate',
            cover: '/images/stations/ambient.jpg'
        }
    ],
    currentStation: {
        id: 'smooth-jazz',
        name: 'Smooth Jazz & Pop',
        url: 'https://smoothjazz.cdnstream1.com/2585_128.mp3',
        style: 'Jazz / Pop',
        cover: '/images/stations/jazz.jpg'
    },

    toggleRadio: () => set((state) => {
        const willBeRadio = !state.isRadio
        return {
            isRadio: willBeRadio,
            isPlaying: willBeRadio,
            ...(willBeRadio ? {} : { isPlaying: false })
        }
    }),

    setRadioMetadata: (metadata) => set((state) => ({
        radioMetadata: { ...state.radioMetadata, ...metadata }
    })),

    setStation: (station) => set((state) => ({
        currentStation: station,
        isRadio: true, // Auto switch to radio mode
        isPlaying: true, // Auto play
        radioMetadata: {
            title: station.name,
            artist: station.style,
            coverUrl: "/digital-village.png", // Keep generic or use station specific
            listeners: 0
        }
    }))
}))
