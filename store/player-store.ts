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

    isLoading: boolean
    setIsLoading: (loading: boolean) => void

    radioError: string | null
    setRadioError: (error: string) => void
    clearRadioError: () => void

    reset: () => void
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
    isLoading: false,

    setIsLoading: (loading) => set({ isLoading: loading }),

    reset: () => set({
        queue: [],
        currentIndex: 0,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        isRadio: false,
        isLoading: false,
        radioError: null,
        seekRequest: null,
        // We can keep volume and stations/metadata defaults
    }),

    setQueue: (songs, startIndex = 0) =>
        set({ queue: songs, currentIndex: startIndex, isPlaying: true, isRadio: false, isLoading: true, currentTime: 0 }),

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

        set({ currentIndex: nextIndex, isPlaying: true, isLoading: true, currentTime: 0 })
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
            // Restart the current song by seeking to the beginning
            set({ seekRequest: 0, currentTime: 0 })
            return
        }

        if (currentIndex > 0) {
            set({ currentIndex: currentIndex - 1, isPlaying: true, isLoading: true, currentTime: 0 })
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
            url: 'https://streaming.radio.co/s774887f7b/listen',
            style: 'Jazz / Pop',
            cover: '/images/stations/jazz.jpg'
        },
        {
            id: 'lofi-beats',
            name: 'Lofi Hip Hop',
            url: 'https://streams.ilovemusic.de/iloveradio17.mp3',
            style: 'Chill / Study',
            cover: '/images/stations/lofi.jpg'
        },
        {
            id: 'classical',
            name: 'Classical Flow',
            url: 'https://wrti-live.streamguys1.com/jazz-mp3',
            style: 'Classical / Focus',
            cover: '/images/stations/classical.jpg'
        },
        {
            id: 'ambient',
            name: 'Deep Ambient',
            url: 'https://streams.ilovemusic.de/iloveradio21.mp3',
            style: 'Sleep / Meditate',
            cover: '/images/stations/ambient.jpg'
        }
    ],
    currentStation: {
        id: 'smooth-jazz',
        name: 'Smooth Jazz & Pop',
        url: 'https://streaming.radio.co/s774887f7b/listen',
        style: 'Jazz / Pop',
        cover: '/images/stations/jazz.jpg'
    },

    toggleRadio: () => set((state) => {
        if (state.isRadio && state.radioError) {
            return {
                isRadio: true,
                isPlaying: true,
                radioError: null,
            }
        }
        const willBeRadio = !state.isRadio
        return {
            isRadio: willBeRadio,
            isPlaying: willBeRadio,
            radioError: null, // Clear errors on toggle
        }
    }),

    setRadioMetadata: (metadata) => set((state) => ({
        radioMetadata: { ...state.radioMetadata, ...metadata }
    })),

    setStation: (station) => set(() => ({
        currentStation: station,
        isRadio: true, // Auto switch to radio mode
        isPlaying: true, // Auto play
        isLoading: true, // Start loading
        currentTime: 0, // Reset time
        radioError: null, // Clear errors on station switch
        radioMetadata: {
            title: station.name,
            artist: station.style,
            coverUrl: "/digital-village.png", // Keep generic or use station specific
            listeners: 0
        }
    })),

    radioError: null,
    setRadioError: (error) => set({ radioError: error, isPlaying: false }),
    clearRadioError: () => set({ radioError: null }),
}))
