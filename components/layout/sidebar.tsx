'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Library, Heart, Disc, User as UserIcon, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { usePlaylists } from "@/hooks/use-playlists"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/hooks/use-user"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"


const CreatePlaylistDialog = dynamic(
    () => import("@/components/playlists/create-playlist-dialog").then((mod) => mod.CreatePlaylistDialog),
    { ssr: false }
)

const UploadSongDialog = dynamic(
    () => import("@/components/upload/upload-song-dialog").then((mod) => mod.UploadSongDialog),
    { ssr: false }
)

const TeamStoryDialog = dynamic(
    () => import("@/components/layout/team-story-dialog").then((mod) => mod.TeamStoryDialog),
    { ssr: false }
)

import { PlusCircle } from "lucide-react"

export function Sidebar() {
    const supabase = createClient()
    const { playlists } = usePlaylists()
    const { user } = useUser()
    const pathname = usePathname()
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

    useEffect(() => {
        const getProfile = async () => {
            if (user) {
                const { data } = await supabase.from('profiles').select('avatar_url').eq('id', user.id).single()
                if (data) setAvatarUrl(data.avatar_url)
            } else {
                setAvatarUrl(null)
            }
        }
        getProfile()
    }, [user, supabase])

    return (
        <div className="hidden md:flex w-72 flex-col gap-2 glass-sidebar h-[100dvh] p-4 sticky top-0 font-geist-sans z-20">
            <div className="flex flex-col gap-6 px-3 py-6">
                <Link href="/" className="flex items-center gap-2 group px-2 mb-2 cursor-pointer">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-hover:bg-primary/40 transition-all" />
                        <Disc className="w-6 h-6 text-primary relative z-10 animate-spin-slow" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent glow-text-purple">EKKO</span>
                </Link>

                <nav className="flex flex-col gap-1.5">
                    <Link href="/home">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-4 text-sm font-medium transition-all duration-300 relative overflow-hidden group/btn",
                                pathname === "/home"
                                    ? "bg-blue-600/10 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] border border-blue-500/30"
                                    : "text-neutral-400 hover:text-white hover:bg-white/5 hover:pl-6"
                            )}
                        >
                            {pathname === "/home" && <div className="absolute inset-y-0 left-0 w-1 bg-blue-500 shadow-[0_0_10px_#3b82f6]" />}
                            <Home className={cn("w-5 h-5 transition-colors", pathname === "/home" ? "text-blue-400" : "group-hover/btn:text-blue-400")} />
                            Home
                        </Button>
                    </Link>
                    <Link href="/search">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-4 text-sm font-medium transition-all duration-300 relative overflow-hidden group/btn",
                                pathname === "/search"
                                    ? "bg-purple-600/10 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)] border border-purple-500/30"
                                    : "text-neutral-400 hover:text-white hover:bg-white/5 hover:pl-6"
                            )}
                        >
                            {pathname === "/search" && <div className="absolute inset-y-0 left-0 w-1 bg-purple-500 shadow-[0_0_10px_#a855f7]" />}
                            <Search className={cn("w-5 h-5 transition-colors", pathname === "/search" ? "text-purple-400" : "group-hover/btn:text-purple-400")} />
                            Search
                        </Button>
                    </Link>
                    <Link href="/vibes">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-4 text-sm font-medium transition-all duration-300 relative overflow-hidden group/btn",
                                pathname === "/vibes"
                                    ? "bg-pink-600/10 text-white shadow-[0_0_20px_rgba(219,39,119,0.3)] border border-pink-500/30"
                                    : "text-neutral-400 hover:text-white hover:bg-white/5 hover:pl-6"
                            )}
                        >
                            {pathname === "/vibes" && <div className="absolute inset-y-0 left-0 w-1 bg-pink-500 shadow-[0_0_10px_#ec4899]" />}
                            <Sparkles className={cn("w-5 h-5 transition-colors", pathname === "/vibes" ? "text-pink-400" : "group-hover/btn:text-pink-400")} />
                            Vibes
                        </Button>
                    </Link>
                    <Link href="/library">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-4 text-sm font-medium transition-all duration-300 relative overflow-hidden group/btn",
                                pathname === "/library"
                                    ? "bg-green-600/10 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)] border border-green-500/30"
                                    : "text-neutral-400 hover:text-white hover:bg-white/5 hover:pl-6"
                            )}
                        >
                            {pathname === "/library" && <div className="absolute inset-y-0 left-0 w-1 bg-green-500 shadow-[0_0_10px_#22c55e]" />}
                            <Library className={cn("w-5 h-5 transition-colors", pathname === "/library" ? "text-green-400" : "group-hover/btn:text-green-400")} />
                            Library
                        </Button>
                    </Link>
                    <Link href="/profile">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-4 text-sm font-medium transition-all duration-300",
                                pathname === "/profile"
                                    ? "bg-white/10 text-white shadow-glow-white border border-white/10"
                                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Avatar className="w-5 h-5 border border-white/10 shadow-sm">
                                <AvatarImage src={avatarUrl || undefined} className="object-cover" />
                                <AvatarFallback className="bg-transparent">
                                    <UserIcon className={cn("w-4 h-4", pathname === "/profile" ? "text-blue-400" : "")} />
                                </AvatarFallback>
                            </Avatar>
                            Profile
                        </Button>
                    </Link>
                    <TeamStoryDialog>
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-4 text-sm font-medium transition-all duration-300",
                                "text-neutral-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <div className="w-5 h-5 flex items-center justify-center">
                                <span className="text-xs font-bold border border-current rounded-full w-4 h-4 flex items-center justify-center text-neutral-400">?</span>
                            </div>
                            Team Story
                        </Button>
                    </TeamStoryDialog>
                </nav>
            </div>

            <div className="flex flex-col gap-1.5 px-2 mt-6">
                <div className="px-2 text-[10px] font-black text-blue-400/50 uppercase tracking-[0.2em] mb-3">
                    Your Music
                </div>
                <CreatePlaylistDialog />
                <UploadSongDialog>
                    <Button variant="ghost" className="w-full justify-start gap-4 text-sm font-medium transition-all duration-300 text-neutral-400 hover:text-white hover:bg-white/5 group px-3">
                        <PlusCircle className="w-5 h-5" />
                        Upload Song
                    </Button>
                </UploadSongDialog>
                <Link href="/liked">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start gap-4 text-sm font-medium transition-all duration-300 relative overflow-hidden group/btn px-3",
                            pathname === "/liked"
                                ? "bg-red-600/10 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] border border-red-500/30"
                                : "text-neutral-400 hover:text-white hover:bg-white/5 hover:pl-4"
                        )}
                    >
                        {pathname === "/liked" && <div className="absolute inset-y-0 left-0 w-1 bg-red-500 shadow-[0_0_10px_#ef4444]" />}
                        <div className="w-5 h-5 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[4px] shadow-lg shadow-blue-600/20 group-hover/btn:scale-110 transition-transform">
                            <Heart className={cn("w-3 h-3 text-white fill-white transition-colors", pathname === "/liked" ? "text-white" : "")} />
                        </div>
                        Liked Songs
                    </Button>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-4 border-t border-white/5 mt-4">
                <div className="px-3 text-[10px] font-black text-blue-400/50 uppercase tracking-[0.2em] mb-3">
                    Playlists
                </div>
                {playlists?.map(playlist => (
                    <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
                        <div className="text-sm text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer px-3 py-2 rounded-md transition-all truncate font-medium">
                            {playlist.title}
                        </div>
                    </Link>
                ))}
                {!playlists?.length && (
                    <div className="text-xs text-neutral-600 italic px-3 py-2">No playlists yet</div>
                )}
            </div>
        </div >
    )
}
