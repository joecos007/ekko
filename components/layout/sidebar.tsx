'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Library, Heart, Disc, User as UserIcon, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { usePlaylists } from "@/hooks/use-playlists"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
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
    const { playlists } = usePlaylists()
    const pathname = usePathname()
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase.from('profiles').select('avatar_url').eq('id', user.id).single()
                if (data) setAvatarUrl(data.avatar_url)
            }
        }
        getProfile()
    }, [])

    return (
        <div className="hidden md:flex w-72 flex-col gap-2 glass-sidebar h-screen p-4 sticky top-0 font-geist-sans z-20">
            <div className="flex flex-col gap-6 px-3 py-6">
                <Link href="/" className="flex items-center gap-2 group px-2 mb-2 cursor-pointer">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-hover:bg-primary/40 transition-all" />
                        <Disc className="w-6 h-6 text-primary relative z-10 animate-spin-slow" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent glow-text-purple">EKKO</span>
                </Link>

                <nav className="flex flex-col gap-1.5">
                    <Link href="/">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-4 text-sm font-medium transition-all duration-300",
                                pathname === "/"
                                    ? "bg-white/10 text-white shadow-glow-white border border-white/10"
                                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Home className={cn("w-5 h-5", pathname === "/" ? "text-blue-400" : "")} />
                            Home
                        </Button>
                    </Link>
                    <Link href="/search">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-4 text-sm font-medium transition-all duration-300",
                                pathname === "/search"
                                    ? "bg-white/10 text-white shadow-glow-white border border-white/10"
                                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Search className={cn("w-5 h-5", pathname === "/search" ? "text-blue-400" : "")} />
                            Search
                        </Button>
                    </Link>
                    <Link href="/vibes">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-4 text-sm font-medium transition-all duration-300",
                                pathname === "/vibes"
                                    ? "bg-white/10 text-white shadow-glow-white border border-white/10"
                                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Sparkles className={cn("w-5 h-5", pathname === "/vibes" ? "text-blue-400" : "")} />
                            Community Vibes
                        </Button>
                    </Link>
                    <Link href="/library">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-4 text-sm font-medium transition-all duration-300",
                                pathname === "/library"
                                    ? "bg-white/10 text-white shadow-glow-white border border-white/10"
                                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Library className={cn("w-5 h-5", pathname === "/library" ? "text-blue-400" : "")} />
                            Your Library
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
                                <AvatarImage src={avatarUrl || ""} className="object-cover" />
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
                    <Button variant="ghost" className="w-full justify-start gap-4 text-sm font-medium transition-all duration-300 text-neutral-400 hover:text-white hover:bg-white/5 group px-3">
                        <div className="w-5 h-5 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[4px] shadow-lg shadow-blue-600/20">
                            <Heart className="w-3 h-3 text-white fill-white" />
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
