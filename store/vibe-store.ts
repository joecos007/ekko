import { create } from 'zustand'
import { createClient } from '@/utils/supabase/client'

export type Vibe = {
    id: string
    song_id: string
    user_id: string
    timestamp: number
    text?: string
    emoji?: string
    color?: string
    created_at: string
    profiles?: {
        username: string | null
        avatar_url: string | null
    }
}

type VibeState = {
    vibes: Vibe[]
    isLoading: boolean
    activeChannel: any | null
    retryTimeout: NodeJS.Timeout | null

    // Actions
    fetchVibes: (songId: string) => Promise<void>
    addVibe: (vibe: Omit<Vibe, 'id' | 'created_at' | 'profiles'>) => Promise<void>
    subscribeToVibes: (songId: string) => void
    unsubscribeFromVibes: () => void
}

export const useVibeStore = create<VibeState>((set, get) => ({
    vibes: [],
    isLoading: false,
    activeChannel: null,
    retryTimeout: null,

    fetchVibes: async (songId) => {
        set({ isLoading: true })
        const supabase = createClient()

        // 1. Fetch Vibes
        // Ensure songId is a valid UUID before querying to avoid Postgres errors
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(songId)

        if (!isUUID) {
            // Non-UUID song: load local vibes only
            // Load Local Vibes ONLY
            try {
                const localVibesRaw = JSON.parse(localStorage.getItem('ekko_local_vibes') || '[]') as Vibe[]
                const localVibesForSong = localVibesRaw.filter(v => v.song_id === songId).sort((a, b) => a.timestamp - b.timestamp)
                set({ vibes: localVibesForSong, isLoading: false })
            } catch (e) {
                console.error("[VibeStore] Error parsing local vibes", e)
                set({ vibes: [], isLoading: false })
            }
            return
        }

        const { data: vibeData, error: vibeError } = await supabase
            .from('vibes')
            .select('*')
            .eq('song_id', songId)
            .order('timestamp', { ascending: true })

        if (vibeError) {
            // Check if table is missing (Postgres code 42P01 or PostgREST code PGRST205)
            if (vibeError.code === '42P01' || vibeError.code === 'PGRST205') {
                // 'vibes' table missing — feature will be local-only

                // Load Local Vibes ONLY
                try {
                    const localVibesRaw = JSON.parse(localStorage.getItem('ekko_local_vibes') || '[]') as Vibe[]
                    const localVibesForSong = localVibesRaw.filter(v => v.song_id === songId).sort((a, b) => a.timestamp - b.timestamp)
                    set({ vibes: localVibesForSong, isLoading: false })
                } catch {
                    set({ vibes: [], isLoading: false })
                }
                return
            }

            // Handle Network Errors gracefully (e.g. adblockers, offline)
            if (vibeError.message && (
                vibeError.message.includes("NetworkError") ||
                vibeError.message.includes("fetch") ||
                vibeError.message.includes("AbortError") ||
                vibeError.code === 'AbortError'
            )) {
                // Network error or Aborted — use local fallback if available, or just ignore if aborted
                try {
                    const localVibesRaw = JSON.parse(localStorage.getItem('ekko_local_vibes') || '[]') as Vibe[]
                    const localVibesForSong = localVibesRaw.filter(v => v.song_id === songId).sort((a, b) => a.timestamp - b.timestamp)
                    set({ vibes: localVibesForSong, isLoading: false })
                } catch {
                    set({ vibes: [], isLoading: false })
                }
                return
            }

            console.error('[VibeStore] Error fetching vibes:', vibeError)
            set({ isLoading: false })
            return
        }

        const vibes = vibeData as Vibe[]

        if (vibes.length === 0) {
            // Still check local vibes even if DB returned empty
            try {
                const localVibesRaw = JSON.parse(localStorage.getItem('ekko_local_vibes') || '[]') as Vibe[]
                const localVibesForSong = localVibesRaw.filter(v => v.song_id === songId).sort((a, b) => a.timestamp - b.timestamp)
                if (localVibesForSong.length > 0) {
                    set({ vibes: localVibesForSong, isLoading: false })
                    return
                }
            } catch { }

            set({ vibes: [], isLoading: false })
            return
        }

        // 2. Fetch Profiles separately (Robust against missing FKs)
        const userIds = Array.from(new Set(vibes.map(v => v.user_id)))

        const { data: profilesData } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .in('id', userIds)

        // 3. Map profiles to vibes
        const profileMap = new Map(profilesData?.map((p: any) => [p.id, p]) || [])

        const vibesWithProfiles = vibes.map((v: any) => ({
            ...v,
            profiles: profileMap.get(v.user_id) || { username: 'Unknown', avatar_url: null }
        }))

        // 4. Merge with Local Vibes (for Demo/Missing Table)
        try {
            const localVibesRaw = JSON.parse(localStorage.getItem('ekko_local_vibes') || '[]') as Vibe[]
            const localVibesForSong = localVibesRaw.filter(v => v.song_id === songId)

            // Avoid duplicates
            const existingIds = new Set(vibesWithProfiles.map(v => v.id))
            const uniqueLocalVibes = localVibesForSong.filter(v => !existingIds.has(v.id))

            const allVibes = [...vibesWithProfiles, ...uniqueLocalVibes].sort((a, b) => a.timestamp - b.timestamp)

            set({ vibes: allVibes, isLoading: false })
        } catch (e) {
            console.error("[VibeStore] Error loading local vibes:", e)
            set({ vibes: vibesWithProfiles, isLoading: false })
        }
    },

    addVibe: async (vibe) => {
        const supabase = createClient()

        // Optimistic update
        const tempId = crypto.randomUUID()
        const newVibe: Vibe = {
            ...vibe,
            id: tempId,
            created_at: new Date().toISOString(),
            profiles: { username: 'You', avatar_url: null } // Placeholder
        }

        set((state) => ({ vibes: [...state.vibes, newVibe].sort((a, b) => a.timestamp - b.timestamp) }))

        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(vibe.song_id)

        if (vibe.song_id === "demo-radio" || vibe.user_id === "demo-user" || !isUUID) {
            // Demo mode OR non-database song: Don't hit Supabase, just let strict optimistic update persist
            // Demo/Local vibe: save to localStorage only
            // Save to localStorage for persistence in this session
            try {
                const localVibes = JSON.parse(localStorage.getItem('ekko_local_vibes') || '[]')
                localVibes.push(newVibe)
                localStorage.setItem('ekko_local_vibes', JSON.stringify(localVibes))
            } catch {
                console.error("[VibeStore] Failed to save local vibe")
            }
            return
        }

        const { data, error } = await supabase
            .from('vibes')
            .insert(vibe)
            .select('*, profiles(username, avatar_url)')
            .single()

        if (error) {
            // Check if table is missing (Postgres code 42P01 or PostgREST code PGRST205)
            // OR if RLS/permission denied (42501, PGRST301)
            if (error.code === '42P01' || error.code === 'PGRST205' || error.code === '42501' || error.code === 'PGRST301') {
                // 'vibes' table missing OR permission denied — save locally

                // Save to localStorage for persistence in this session
                try {
                    const localVibes = JSON.parse(localStorage.getItem('ekko_local_vibes') || '[]')
                    localVibes.push(newVibe)
                    localStorage.setItem('ekko_local_vibes', JSON.stringify(localVibes))
                } catch {
                    console.error("[VibeStore] Failed to save local vibe")
                }

                // Do NOT rollback. Let the optimistic update stay.
                return
            }

            console.error('[VibeStore] Error adding vibe to DB:', error)
            // Rollback
            set((state) => ({ vibes: state.vibes.filter(v => v.id !== tempId) }))
            return
        }

        // Replace temp with real
        set((state) => ({
            vibes: state.vibes.map(v => v.id === tempId ? (data as unknown as Vibe) : v)
        }))
    },

    subscribeToVibes: (songId) => {
        const { activeChannel, retryTimeout } = get()
        const supabase = createClient()

        // ALWAYS cleanup existing first
        if (retryTimeout) {
            clearTimeout(retryTimeout)
            set({ retryTimeout: null })
        }
        if (activeChannel) {
            supabase.removeChannel(activeChannel)
            set({ activeChannel: null })
        }

        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(songId)
        if (!isUUID) return

        if (typeof window !== 'undefined' && !navigator.onLine) {
            console.warn('[VibeStore] Offline: realtime subscription skipped.')
            return
        }

        let retryCount = 0
        const MAX_RETRIES = 5
        const BASE_DELAY = 3000

        const setupSubscription = () => {
            const channel = supabase
                .channel(`vibes:${songId}`)
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: 'vibes', filter: `song_id=eq.${songId}` },
                    async (payload: any) => {
                        const newVibeRaw = payload.new

                        // Fetch profile for this user
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('username, avatar_url')
                            .eq('id', newVibeRaw.user_id)
                            .single()

                        const newVibe: Vibe = {
                            ...newVibeRaw,
                            profiles: profile || { username: 'Unknown', avatar_url: null }
                        }

                        set((state) => {
                            // Avoid duplicates if we just added it optimistically
                            if (state.vibes.some(v => v.id === newVibe.id)) return state
                            return { vibes: [...state.vibes, newVibe].sort((a, b) => a.timestamp - b.timestamp) }
                        })
                    }
                )
                .subscribe((status: any) => {
                    if (status === 'SUBSCRIBED') {
                        retryCount = 0 // Reset on success
                        const currentTimeout = get().retryTimeout
                        if (currentTimeout) {
                            clearTimeout(currentTimeout)
                            set({ retryTimeout: null })
                        }
                    }
                    if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                        console.warn(`[VibeStore] Channel error: ${status}`)

                        if (retryCount < MAX_RETRIES) {
                            retryCount++
                            const timeout = setTimeout(() => {
                                // Clean up current channel before retrying
                                supabase.removeChannel(channel)
                                setupSubscription()
                            }, BASE_DELAY * Math.pow(2, retryCount - 1))

                            set({ retryTimeout: timeout })
                        } else {
                            supabase.removeChannel(channel)
                            set({ activeChannel: null })
                            console.warn("[VibeStore] Max retries reached. Realtime updates disabled for this session — vibes will still work via polling.")
                        }
                    }
                })

            set({ activeChannel: channel })
        }

        setupSubscription()
    },

    unsubscribeFromVibes: () => {
        const { activeChannel, retryTimeout } = get()
        const supabase = createClient()

        if (retryTimeout) {
            clearTimeout(retryTimeout)
            set({ retryTimeout: null })
        }

        if (activeChannel) {
            supabase.removeChannel(activeChannel)
            set({ activeChannel: null })
        }
    }
}))
