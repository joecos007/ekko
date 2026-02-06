'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { MoreHorizontal, Plus, ListMusic, User, Heart } from "lucide-react"
import { usePlaylists } from "@/hooks/use-playlists"
import { toast } from "sonner"
import { useState } from "react"

interface MediaItemActionMenuProps {
    songId: string
    songTitle: string
    artistName?: string
    children?: React.ReactNode
    className?: string
    playlistId?: string // Context for removal
}

export function MediaItemActionMenu({
    songId,
    songTitle,
    artistName,
    children,
    className,
    playlistId
}: MediaItemActionMenuProps) {
    const { playlists, addToPlaylist, removeFromPlaylist } = usePlaylists()
    const [isOpen, setIsOpen] = useState(false)

    const handleAddToPlaylist = async (targetPlaylistId: string, playlistTitle: string) => {
        try {
            await addToPlaylist.mutateAsync({ playlistId: targetPlaylistId, songId })
            toast.success(`Added "${songTitle}" to ${playlistTitle}`)
            setIsOpen(false)
        } catch (error) {
            toast.error("Failed to add song to playlist")
            console.error(error)
        }
    }

    const handleRemoveFromPlaylist = async () => {
        if (!playlistId) return
        try {
            await removeFromPlaylist.mutateAsync({ playlistId, songId })
            toast.success("Removed from playlist")
            setIsOpen(false)
        } catch (error) {
            toast.error("Failed to remove song")
            console.error(error)
        }
    }

    const handleLike = async () => {
        try {
            const { error } = await supabase
                .from('liked_songs')
                .insert({
                    song_id: songId,
                    user_id: (await supabase.auth.getUser()).data.user?.id
                })

            if (error) {
                // duplicate key error means already liked, which is fine
                if (error.code === '23505') {
                    toast.info("Already in Liked Songs")
                } else {
                    throw error
                }
            } else {
                toast.success("Added to Liked Songs")
            }
        } catch (error) {
            toast.error("Failed to add to Liked Songs")
            console.error(error)
        }
        setIsOpen(false)
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                {children || (
                    <Button variant="ghost" size="icon" className={className}>
                        <MoreHorizontal className="w-4 h-4 text-neutral-400 hover:text-white" />
                    </Button>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-neutral-900 border-neutral-800 text-white">
                <DropdownMenuLabel>{songTitle}</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-neutral-800" />

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Playlist
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="bg-neutral-900 border-neutral-800 text-white">
                        <DropdownMenuLabel>Select Playlist</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-neutral-800" />
                        {playlists?.map(playlist => (
                            <DropdownMenuItem
                                key={playlist.id}
                                onClick={() => handleAddToPlaylist(playlist.id, playlist.title)}
                            >
                                <ListMusic className="w-4 h-4 mr-2" />
                                {playlist.title}
                            </DropdownMenuItem>
                        ))}
                        {!playlists?.length && (
                            <DropdownMenuItem disabled>
                                No playlists created
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuItem onClick={handleLike}>
                    <Heart className="w-4 h-4 mr-2" />
                    Add to Liked Songs
                </DropdownMenuItem>

                {playlistId && (
                    <>
                        <DropdownMenuSeparator className="bg-neutral-800" />
                        <DropdownMenuItem onClick={handleRemoveFromPlaylist} className="text-red-500 focus:text-red-500">
                            <ListMusic className="w-4 h-4 mr-2" />
                            Remove from this Playlist
                        </DropdownMenuItem>
                    </>
                )}

                <DropdownMenuSeparator className="bg-neutral-800" />

                <DropdownMenuItem disabled>
                    <User className="w-4 h-4 mr-2" />
                    Go to Artist
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
