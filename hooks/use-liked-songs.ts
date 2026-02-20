"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { useUser } from '@/hooks/use-user'
import { toast } from 'sonner'

export function useLikedSongs() {
    const queryClient = useQueryClient()
    const supabase = createClient()
    const { user } = useUser()

    const { data: likedSongs, isLoading } = useQuery({
        queryKey: ['liked-songs', user?.id],
        enabled: !!user?.id,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('liked_songs')
                .select('song_id')
                .eq('user_id', user!.id)

            if (error) throw error
            return new Set(data.map((item: any) => item.song_id))
        }
    })

    const toggleLike = useMutation({
        mutationFn: async (songId: string) => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                toast.error("Please sign in to like songs")
                throw new Error("Not authenticated")
            }

            // Check DB directly for truth
            const { data: existingLike } = await supabase
                .from('liked_songs')
                .select('*')
                .eq('song_id', songId)
                .eq('user_id', user.id)
                .maybeSingle()

            if (existingLike) {
                const { error } = await supabase
                    .from('liked_songs')
                    .delete()
                    .eq('song_id', songId)
                    .eq('user_id', user.id)

                if (error) throw error
                return { action: 'removed', songId }
            } else {
                const { error } = await supabase
                    .from('liked_songs')
                    .insert({ song_id: songId, user_id: user.id })

                if (error) throw error
                return { action: 'added', songId }
            }
        },
        onMutate: async (songId) => {
            // Optimistic update
            await queryClient.cancelQueries({ queryKey: ['liked-songs'] })
            const previousLiked = queryClient.getQueryData<Set<string>>(['liked-songs'])

            if (previousLiked) {
                const newLiked = new Set(previousLiked)
                if (newLiked.has(songId)) {
                    newLiked.delete(songId)
                } else {
                    newLiked.add(songId)
                }
                queryClient.setQueryData(['liked-songs'], newLiked)
            }

            return { previousLiked }
        },
        onError: (err, songId, context) => {
            if (context?.previousLiked) {
                queryClient.setQueryData(['liked-songs'], context.previousLiked)
            }
            toast.error("Failed to update liked songs")
        },
        onSuccess: (data) => {
            if (data.action === 'added') {
                toast.success("Added to Liked Songs")
            } else {
                toast.success("Removed from Liked Songs")
            }
            queryClient.invalidateQueries({ queryKey: ['liked-songs'] })
            queryClient.invalidateQueries({ queryKey: ['liked-count'] })
        }
    })

    const isLiked = (songId: string) => {
        return likedSongs?.has(songId) || false
    }

    return { likedSongs, isLoading, toggleLike, isLiked }
}
