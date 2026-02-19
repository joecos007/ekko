'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HomeIcon, LayoutGrid, Library, Heart, Sparkles, Mic2, ChevronDown } from "lucide-react"
import { EkkoLogo } from "@/components/brand/ekko-logo"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { usePlaylists } from "@/hooks/use-playlists"
import { useUser } from "@/hooks/use-user"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { PlusCircle } from "lucide-react"

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
        <div className="hidden md:flex w-72 lg:w-80 flex-col gap-2 glass-sidebar h-[100dvh] p-4 lg:p-5 sticky top-0 font-geist-sans z-20">
            <div className="flex flex-col gap-6 px-3 py-6">
                <Link href="/home" className="px-2 mb-2 cursor-pointer">
                    <EkkoLogo size="md" />
                </Link>

                <div className="flex flex-col gap-1 mt-4">
                    <Link href="/home">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-4 px-4 h-12 text-base font-medium relative group overflow-hidden transition-all duration-300 border-l-2 border-transparent",
                                pathname === "/home"
                                    ? "bg-white/10 text-white shadow-glow-white/10 border-ekko-500"
                                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {pathname === "/home" && (
                                <motion.div
                                    layoutId="active-nav-indicator"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-ekko-500 shadow-[0_0_10px_#6366f1]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}
                            <HomeIcon className={cn("w-5 h-5", pathname === "/home" ? "text-ekko-400" : "")} />
                            Home
                        </Button>
                    </Link>

                    <Link href="/categories">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-4 px-4 h-12 text-base font-medium relative group overflow-hidden transition-all duration-300 border-l-2 border-transparent",
                                pathname === "/categories"
                                    ? "bg-white/10 text-white shadow-glow-white/10 border-ekko-500"
                                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {pathname === "/categories" && (
                                <motion.div
                                    layoutId="active-nav-indicator"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-ekko-500 shadow-[0_0_10px_#6366f1]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}
                            <LayoutGrid className={cn("w-5 h-5", pathname === "/categories" ? "text-ekko-400" : "")} />
                            Categories
                        </Button>
                    </Link>

                    <Link href="/artists">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-4 px-4 h-12 text-base font-medium relative group overflow-hidden transition-all duration-300 border-l-2 border-transparent",
                                pathname === "/artists"
                                    ? "bg-white/10 text-white shadow-glow-white/10 border-ekko-500"
                                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {pathname === "/artists" && (
                                <motion.div
                                    layoutId="active-nav-indicator"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-ekko-500 shadow-[0_0_10px_#6366f1]"
                                    initial={{ opacity: 1 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}
                            <Mic2 className={cn("w-5 h-5", pathname === "/artists" ? "text-ekko-400" : "")} />
                            Artists
                        </Button>
                    </Link>

                    <div className="pt-4 pb-2">
                        <div className="flex items-center justify-between px-4 mb-2 group cursor-pointer">
                            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest group-hover:text-neutral-300 transition-colors">Playlists</span>
                            <ChevronDown className="w-3 h-3 text-neutral-600 group-hover:text-neutral-300 transition-colors" />
                        </div>
                    </div>
                    <Link href="/library">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-4 px-4 h-12 text-base font-medium relative group overflow-hidden transition-all duration-300 border-l-2 border-transparent",
                                pathname === "/library"
                                    ? "bg-white/10 text-white shadow-glow-white/10 border-ekko-500"
                                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {pathname === "/library" && (
                                <motion.div
                                    layoutId="active-nav-indicator"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-ekko-500 rounded-r-full shadow-[0_0_10px_#6366f1]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                />
                            )}
                            <Library className={cn("w-5 h-5", pathname === "/library" ? "text-ekko-400" : "")} />
                            Library
                        </Button>
                    </Link>
                </div >

                <TeamStoryDialog>
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start gap-4 lg:gap-5 text-sm lg:text-base font-semibold transition-all duration-300",
                            "text-neutral-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <div className="w-5 h-5 flex items-center justify-center">
                            <span className="text-xs font-bold border border-current rounded-none w-4 h-4 flex items-center justify-center text-neutral-400">?</span>
                        </div>
                        Team Story
                    </Button>
                </TeamStoryDialog >
            </div >

            <div className="flex flex-col gap-1.5 px-2 mt-6">
                <div className="px-2 text-[10px] lg:text-xs font-black text-ekko-400/50 uppercase tracking-[0.2em] mb-3">
                    Your Music
                </div>
                <CreatePlaylistDialog />
                <UploadSongDialog>
                    <Button variant="ghost" className="w-full justify-start gap-4 lg:gap-5 text-sm lg:text-base font-semibold transition-all duration-300 text-neutral-400 hover:text-white hover:bg-white/5 group px-3">
                        <PlusCircle className="w-5 h-5 lg:w-6 lg:h-6" />
                        Upload Song
                    </Button>
                </UploadSongDialog>
                <Link href="/liked">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start gap-4 lg:gap-5 text-sm lg:text-base font-semibold transition-all duration-300 relative overflow-hidden group/btn px-3",
                            pathname === "/liked"
                                ? "bg-red-600/10 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] border border-red-500/30"
                                : "text-neutral-400 hover:text-white hover:bg-white/5 hover:pl-4"
                        )}
                    >
                        {pathname === "/liked" && <div className="absolute inset-y-0 left-0 w-1 bg-red-500 shadow-[0_0_10px_#ef4444]" />}
                        <div className="w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center bg-gradient-to-br from-ekko-500 to-ekko-700 shadow-lg shadow-ekko-600/20 group-hover/btn:scale-110 transition-transform">
                            <Heart className={cn("w-3 h-3 lg:w-3.5 lg:h-3.5 text-white fill-white transition-colors", pathname === "/liked" ? "text-white" : "")} />
                        </div>
                        Liked Songs
                    </Button>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-4 border-t border-white/5 mt-4">
                <div className="px-3 text-[10px] lg:text-xs font-black text-ekko-400/50 uppercase tracking-[0.2em] mb-3">
                    Playlists
                </div>
                {playlists?.map(playlist => (
                    <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
                        <div className="text-sm lg:text-base text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer px-3 py-2 transition-all truncate font-medium border-l-2 border-transparent hover:border-white/20">
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
