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

    fetchVibes: async (songId) => {
        console.log(`[VibeStore] fetchVibes called for songId: ${songId}`)
        set({ isLoading: true })
        const supabase = createClient()

        // 1. Fetch Vibes
        // Ensure songId is a valid UUID before querying to avoid Postgres errors
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(songId)

        if (!isUUID) {
            console.warn(`[VibeStore] Skipping DB fetch for non-UUID song: ${songId}. Checking local storage.`)
            // Load Local Vibes ONLY
            try {
                const localVibesRaw = JSON.parse(localStorage.getItem('ekko_local_vibes') || '[]') as Vibe[]
                const localVibesForSong = localVibesRaw.filter(v => v.song_id === songId).sort((a, b) => a.timestamp - b.timestamp)
                console.log(`[VibeStore] Loaded ${localVibesForSong.length} local vibes for ${songId}`)
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
                console.warn("[VibeStore] 'vibes' table missing. Feature will be local-only.")

                // Load Local Vibes ONLY
                try {
                    const localVibesRaw = JSON.parse(localStorage.getItem('ekko_local_vibes') || '[]') as Vibe[]
                    const localVibesForSong = localVibesRaw.filter(v => v.song_id === songId).sort((a, b) => a.timestamp - b.timestamp)
                    console.log(`[VibeStore] Loaded ${localVibesForSong.length} local vibes (table missing)`)
                    set({ vibes: localVibesForSong, isLoading: false })
                } catch (e) {
                    set({ vibes: [], isLoading: false })
                }
                return
            }

            console.error('[VibeStore] Error fetching vibes:', JSON.stringify(vibeError, null, 2))
            set({ isLoading: false })
            return
        }

        const vibes = vibeData as Vibe[]
        console.log(`[VibeStore] Fetched ${vibes.length} vibes from DB`)

        if (vibes.length === 0) {
            // Still check local vibes even if DB returned empty
            try {
                const localVibesRaw = JSON.parse(localStorage.getItem('ekko_local_vibes') || '[]') as Vibe[]
                const localVibesForSong = localVibesRaw.filter(v => v.song_id === songId).sort((a, b) => a.timestamp - b.timestamp)
                if (localVibesForSong.length > 0) {
                    console.log(`[VibeStore] Merged ${localVibesForSong.length} local vibes with empty DB result`)
                    set({ vibes: localVibesForSong, isLoading: false })
                    return
                }
            } catch (e) { }

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
        const profileMap = new Map(profilesData?.map(p => [p.id, p]) || [])

        const vibesWithProfiles = vibes.map(v => ({
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

            console.log(`[VibeStore] Final vibes count: ${allVibes.length} (DB: ${vibes.length}, Local: ${uniqueLocalVibes.length})`)
            set({ vibes: allVibes, isLoading: false })
        } catch (e) {
            console.error("[VibeStore] Error loading local vibes:", e)
            set({ vibes: vibesWithProfiles, isLoading: false })
        }
    },

    addVibe: async (vibe) => {
        console.log("[VibeStore] addVibe called", vibe)
        const supabase = createClient()

        // Get current user profile for optimistic update
        const { data: { user } } = await supabase.auth.getUser()
        // We'll optimistically assume we can't get the profile details instantly without a fetch
        // unless we store current user profile in a separate store.
        // For now, let's just use a placeholder or empty profile optimistically.

        // Optimistic update
        const tempId = crypto.randomUUID()
        const newVibe: Vibe = {
            ...vibe,
            id: tempId,
            created_at: new Date().toISOString(),
            profiles: { username: 'You', avatar_url: null } // Placeholder
        }

        set((state) => ({ vibes: [...state.vibes, newVibe].sort((a, b) => a.timestamp - b.timestamp) }))
        console.log("[VibeStore] Optimistic Vibe Added", newVibe)

        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(vibe.song_id)

        if (vibe.song_id === "demo-radio" || vibe.user_id === "demo-user" || !isUUID) {
            // Demo mode OR non-database song: Don't hit Supabase, just let strict optimistic update persist
            console.log("[VibeStore] Demo/Local vibe detected. Saving to localStorage.")
            // Save to localStorage for persistence in this session
            try {
                const localVibes = JSON.parse(localStorage.getItem('ekko_local_vibes') || '[]')
                localVibes.push(newVibe)
                localStorage.setItem('ekko_local_vibes', JSON.stringify(localVibes))
                console.log("[VibeStore] Saved to localStorage")
            } catch (e) {
                console.error("[VibeStore] Failed to save local vibe", e)
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
            if (error.code === '42P01' || error.code === 'PGRST205') {
                console.warn("[VibeStore] 'vibes' table missing. Vibe added locally (not saved).")

                // Save to localStorage for persistence in this session
                try {
                    const localVibes = JSON.parse(localStorage.getItem('ekko_local_vibes') || '[]')
                    localVibes.push(newVibe)
                    localStorage.setItem('ekko_local_vibes', JSON.stringify(localVibes))
                    console.log("[VibeStore] Saved to localStorage (fallback)")
                } catch (e) {
                    console.error("[VibeStore] Failed to save local vibe", e)
                }

                // Do NOT rollback. Let the optimistic update stay.
                return
            }

            console.error('[VibeStore] Error adding vibe to DB:', error)
            // Rollback
            set((state) => ({ vibes: state.vibes.filter(v => v.id !== tempId) }))
            return
        }

        console.log("[VibeStore] Vibe saved to DB successfully")
        // Replace temp with real
        set((state) => ({
            vibes: state.vibes.map(v => v.id === tempId ? (data as unknown as Vibe) : v)
        }))
    },

    subscribeToVibes: (songId) => {
        const supabase = createClient()
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
            .subscribe((status, err) => {
                if (status === 'SUBSCRIBED') {
                    // console.log('Subscribed to vibes')
                }
                if (status === 'CHANNEL_ERROR') {
                    console.warn('VibeStream: Realtime subscription error (likely missing table).', err)
                }
            })

        set({ activeChannel: channel } as any)
    },

    unsubscribeFromVibes: () => {
        const { activeChannel } = get()
        if (activeChannel) {
            activeChannel.unsubscribe()
            set({ activeChannel: null })
        }
    }
}))
