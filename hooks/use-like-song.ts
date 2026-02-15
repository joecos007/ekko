import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { useCallback } from "react"

export function useLikeSong() {
    const supabase = createClient()

    const likeSong = useCallback(async (songId: string, songTitle: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast.error("Please login to like songs")
                return
            }

            const { error } = await supabase
                .from('liked_songs')
                .insert({
                    song_id: songId,
                    user_id: user.id
                })

            if (error) {
                if (error.code === '23505') { // unique_violation
                    toast.info(`"${songTitle}" is already in Liked Songs`)
                } else {
                    throw error
                }
            } else {
                toast.success(`Added "${songTitle}" to Liked Songs`)
            }
        } catch (error) {
            console.error('Error liking song:', error)
            toast.error("Failed to add to Liked Songs")
        }
    }, [supabase])

    return { likeSong }
}
