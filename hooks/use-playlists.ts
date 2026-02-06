import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export type Playlist = {
    id: string
    title: string
    user_id: string
    is_public: boolean
    created_at: string
}

export function usePlaylists() {
    const queryClient = useQueryClient()

    const { data: playlists, isLoading } = useQuery({
        queryKey: ['playlists'],
        queryFn: async () => {
            // Must get user first to ensure RLS policies work if not using session automatically?
            // Supabase client handles auth state automatically if cookie is set or local storage.
            // But we need to make sure we signed in?
            // For now, we assume user might be anon or signed in. RLS handles it.
            // If anon, we return empty array or RLS returns empty.

            const { data, error } = await supabase
                .from('playlists')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            return data as Playlist[]
        }
    })

    const createPlaylist = useMutation({
        mutationFn: async (title: string) => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error("Not authenticated")

            const { data, error } = await supabase
                .from('playlists')
                .insert({ title, user_id: user.id })
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['playlists'] })
        }
    })

    const addToPlaylist = useMutation({
        mutationFn: async ({ playlistId, songId }: { playlistId: string, songId: string }) => {
            const { error } = await supabase
                .from('playlist_songs')
                .insert({ playlist_id: playlistId, song_id: songId })

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['playlist-songs'] })
        }
    })

    const removeFromPlaylist = useMutation({
        mutationFn: async ({ playlistId, songId }: { playlistId: string, songId: string }) => {
            const { error } = await supabase
                .from('playlist_songs')
                .delete()
                .eq('playlist_id', playlistId)
                .eq('song_id', songId)

            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['playlist-songs'] })
        }
    })

    return { playlists, isLoading, createPlaylist, addToPlaylist, removeFromPlaylist }
}
