'use client'

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuTrigger,
    ContextMenuSub,
    ContextMenuSubTrigger,
    ContextMenuSubContent,
} from "@/components/ui/context-menu"
import { Plus, ListMusic, User, Heart, Play } from "lucide-react"
import { usePlaylists } from "@/hooks/use-playlists"
import { useLikedSongs } from "@/hooks/use-liked-songs"
import { usePlayer } from "@/store/player-store"
import { toast } from "sonner"

interface SongContextMenuProps {
    songId: string
    songTitle: string
    songIndex?: number
    songs?: any[]
    playlistId?: string
    children: React.ReactNode
}

export function SongContextMenu({
    songId,
    songTitle,
    songIndex,
    songs,
    playlistId,
    children,
}: SongContextMenuProps) {
    const { playlists, addToPlaylist, removeFromPlaylist, createPlaylist } = usePlaylists()
    const { toggleLike, isLiked } = useLikedSongs()
    const { setQueue } = usePlayer()

    const handleAddToPlaylist = async (targetPlaylistId: string, playlistTitle: string) => {
        try {
            await addToPlaylist.mutateAsync({ playlistId: targetPlaylistId, songId })
            toast.success(`Added "${songTitle}" to ${playlistTitle}`)
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
    }

    const handlePlay = () => {
        if (songs && songIndex !== undefined) {
            setQueue(songs, songIndex)
        }
    }

    const liked = isLiked(songId)

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64 bg-neutral-900/95 backdrop-blur-xl border-white/5 text-white/90 shadow-2xl p-1.5">
                <ContextMenuLabel className="px-3 py-2 text-xs font-bold uppercase tracking-widest text-neutral-500 truncate">
                    {songTitle}
                </ContextMenuLabel>
                <ContextMenuSeparator className="bg-white/5 mx-1" />

                {songs && songIndex !== undefined && (
                    <ContextMenuItem onClick={handlePlay} className="rounded-none focus:bg-white/10 group">
                        <Play className="w-4 h-4 mr-3 text-ekko-400" />
                        <span className="font-medium">Play Now</span>
                    </ContextMenuItem>
                )}

                <ContextMenuSub>
                    <ContextMenuSubTrigger className="rounded-none focus:bg-white/10">
                        <Plus className="w-4 h-4 mr-3 text-neutral-400" />
                        <span className="font-medium">Add to Playlist</span>
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-56 bg-neutral-900/95 backdrop-blur-xl border-white/5 text-white/90 shadow-2xl p-1.5">
                        <ContextMenuItem onClick={handleCreateAndAdd} className="bg-white/5 mb-1 rounded-none focus:bg-white/10 group">
                            <Plus className="w-4 h-4 mr-3 text-ekko-400 group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-ekko-400">Create New Playlist</span>
                        </ContextMenuItem>
                        <ContextMenuSeparator className="bg-white/5 mx-1 mb-1" />
                        {playlists?.map(playlist => (
                            <ContextMenuItem
                                key={playlist.id}
                                onClick={() => handleAddToPlaylist(playlist.id, playlist.title)}
                                className="rounded-none focus:bg-white/10"
                            >
                                <ListMusic className="w-4 h-4 mr-3 text-neutral-500" />
                                <span className="truncate">{playlist.title}</span>
                            </ContextMenuItem>
                        ))}
                        {!playlists?.length && (
                            <ContextMenuItem disabled className="text-neutral-500">
                                No playlists yet
                            </ContextMenuItem>
                        )}
                    </ContextMenuSubContent>
                </ContextMenuSub>

                <ContextMenuItem onClick={handleToggleLike} className="rounded-none focus:bg-white/10 group">
                    <Heart className={`w-4 h-4 mr-3 transition-colors ${liked ? "fill-ekko-400 text-ekko-400" : "text-neutral-400 group-hover:text-ekko-300"}`} />
                    <span className="font-medium">{liked ? "Remove from Liked" : "Add to Liked Songs"}</span>
                </ContextMenuItem>

                {playlistId && (
                    <>
                        <ContextMenuSeparator className="bg-white/5 mx-1" />
                        <ContextMenuItem onClick={handleRemoveFromPlaylist} className="text-ekko-400 rounded-none focus:bg-ekko-500/10 focus:text-ekko-300">
                            <ListMusic className="w-4 h-4 mr-3" />
                            <span className="font-medium">Remove from Playlist</span>
                        </ContextMenuItem>
                    </>
                )}

                <ContextMenuSeparator className="bg-white/5 mx-1" />

                <ContextMenuItem disabled className="rounded-none group opacity-50">
                    <User className="w-4 h-4 mr-3 text-neutral-400" />
                    <span className="font-medium">Go to Artist</span>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}
