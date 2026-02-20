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

import { MoreHorizontal, Plus, ListMusic, User, Heart } from "lucide-react"
import { usePlaylists } from "@/hooks/use-playlists"
import { useLikedSongs } from "@/hooks/use-liked-songs"
import { toast } from "sonner"
import { useState } from "react"

interface MediaItemActionMenuProps {
    songId: string
    songTitle: string
    children?: React.ReactNode
    className?: string
    playlistId?: string // Context for removal
}

export function MediaItemActionMenu({
    songId,
    songTitle,
    children,
    className,
    playlistId
}: MediaItemActionMenuProps) {

    const { playlists, addToPlaylist, removeFromPlaylist, createPlaylist } = usePlaylists()
    const { toggleLike, isLiked } = useLikedSongs()
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

    const handleCreateAndAdd = async () => {
        const title = window.prompt("Enter playlist name:", `My Playlist #${(playlists?.length || 0) + 1}`)
        if (!title) return

        try {
            const newPlaylist = await createPlaylist.mutateAsync({ title })
            if (newPlaylist) {
                await addToPlaylist.mutateAsync({ playlistId: newPlaylist.id, songId })
                toast.success(`Created "${title}" and added song`)
            }
            setIsOpen(false)
        } catch (error) {
            toast.error("Failed to create playlist")
            console.error(error)
        }
    }

    const handleToggleLike = async () => {
        try {
            await toggleLike.mutateAsync(songId)
        } catch (error) {
            console.error(error)
        }
        setIsOpen(false)
    }

    const liked = isLiked(songId)

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                {children || (
                    <Button variant="ghost" size="icon" className={className}>
                        <MoreHorizontal className="w-4 h-4 text-neutral-400 hover:text-white" />
                    </Button>
                )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-neutral-900/95 backdrop-blur-xl border-white/5 text-white/90 shadow-2xl p-1.5 focus:ring-0">
                <DropdownMenuLabel className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
                    {songTitle}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5 mx-1" />

                <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="rounded-none focus:bg-white/10">
                        <Plus className="w-4 h-4 mr-3 text-neutral-400" />
                        <span className="font-medium">Add to Playlist</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-56 bg-neutral-900/95 backdrop-blur-xl border-white/5 text-white/90 shadow-2xl p-1.5 focus:ring-0">
                        <DropdownMenuItem onClick={handleCreateAndAdd} className="bg-white/5 mb-1 rounded-none focus:bg-white/10 group">
                            <Plus className="w-4 h-4 mr-3 text-ekko-400 group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-ekko-400">Create New Playlist</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/5 mx-1 mb-1" />
                        {playlists?.map(playlist => (
                            <DropdownMenuItem
                                key={playlist.id}
                                onClick={() => handleAddToPlaylist(playlist.id, playlist.title)}
                                className="rounded-none focus:bg-white/10"
                            >
                                <ListMusic className="w-4 h-4 mr-3 text-neutral-500" />
                                <span className="truncate">{playlist.title}</span>
                            </DropdownMenuItem>
                        ))}
                        {!playlists?.length && (
                            <DropdownMenuItem disabled className="text-neutral-500">
                                No playlists yet
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuSubContent>
                </DropdownMenuSub>

                <DropdownMenuItem onClick={handleToggleLike} className="rounded-none focus:bg-white/10 group">
                    <Heart className={`w-4 h-4 mr-3 transition-colors ${liked ? "fill-ekko-400 text-ekko-400" : "text-neutral-400 group-hover:text-ekko-300"}`} />
                    <span className="font-medium">{liked ? "Remove from Liked" : "Add to Liked Songs"}</span>
                </DropdownMenuItem>

                {playlistId && (
                    <>
                        <DropdownMenuSeparator className="bg-white/5 mx-1" />
                        <DropdownMenuItem onClick={handleRemoveFromPlaylist} className="text-ekko-400 rounded-none focus:bg-ekko-500/10 focus:text-ekko-300">
                            <ListMusic className="w-4 h-4 mr-3" />
                            <span className="font-medium">Remove from this Playlist</span>
                        </DropdownMenuItem>
                    </>
                )}

                <DropdownMenuSeparator className="bg-white/5 mx-1" />

                <DropdownMenuItem disabled className="rounded-none group opacity-50">
                    <User className="w-4 h-4 mr-3 text-neutral-400" />
                    <span className="font-medium">Go to Artist</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
