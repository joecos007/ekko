'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Library, Heart, Disc, User as UserIcon } from "lucide-react"
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
        <div className="hidden md:flex w-64 flex-col gap-2 bg-black h-[calc(100vh-6rem)] p-4 border-r border-neutral-900 sticky top-0 font-geist-mono">
            <div className="flex flex-col gap-4 px-2 py-4">
                <div className="flex items-center gap-2 group px-2 mb-2">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-hover:bg-primary/40 transition-all" />
                        <Disc className="w-6 h-6 text-primary relative z-10 animate-spin-slow" />
                    </div>
                    <span className="text-xl font-bold tracking-tighter bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">EKKO</span>
                </div>

                <nav className="flex flex-col gap-2">
                    <Link href="/">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-4 text-base font-normal",
                                pathname === "/" ? "bg-white text-black hover:bg-white/90 font-bold" : "text-neutral-400 hover:text-white"
                            )}
                        >
                            <Home className={cn("w-6 h-6", pathname === "/" ? "fill-black" : "")} />
                            Home
                        </Button>
                    </Link>
                    <Link href="/search">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-4 text-base font-normal",
                                pathname === "/search" ? "bg-white text-black hover:bg-white/90 font-bold" : "text-neutral-400 hover:text-white"
                            )}
                        >
                            <Search className={cn("w-6 h-6", pathname === "/search" ? "stroke-[3px]" : "")} />
                            Search
                        </Button>
                    </Link>
                    <Link href="/library">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-4 text-base font-normal",
                                pathname === "/library" ? "bg-white text-black hover:bg-white/90 font-bold" : "text-neutral-400 hover:text-white"
                            )}
                        >
                            <Library className={cn("w-6 h-6", pathname === "/library" ? "fill-black" : "")} />
                            Your Library
                        </Button>
                    </Link>
                    <Link href="/profile">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start gap-4 text-base font-normal",
                                pathname === "/profile" ? "bg-white text-black hover:bg-white/90 font-bold" : "text-neutral-400 hover:text-white"
                            )}
                        >
                            <Avatar className="w-6 h-6 mr-1">
                                <AvatarImage src={avatarUrl || ""} className="object-cover" />
                                <AvatarFallback className="bg-transparent">
                                    <UserIcon className={cn("w-5 h-5", pathname === "/profile" ? "fill-black" : "")} />
                                </AvatarFallback>
                            </Avatar>
                            Profile
                        </Button>
                    </Link>
                </nav>
            </div>

            <div className="flex flex-col gap-2 px-2 mt-4">
                <div className="px-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Playlists
                </div>
                <CreatePlaylistDialog />
                <Link href="/liked">
                    <Button variant="ghost" className="w-full justify-start gap-4 text-base font-normal hover:text-white group px-2">
                        <div className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 rounded-[2px] mr-4">
                            <Heart className="w-3 h-3 text-white fill-white" />
                        </div>
                        Liked Songs
                    </Button>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-4 border-t border-neutral-900 mt-2">
                {/* Playlist list */}
                {playlists?.map(playlist => (
                    <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
                        <div className="text-sm text-neutral-400 hover:text-white cursor-pointer py-1 truncate">
                            {playlist.title}
                        </div>
                    </Link>
                ))}
                {!playlists?.length && (
                    <div className="text-sm text-neutral-600 italic py-2">No playlists yet</div>
                )}
            </div>
        </div>
    )
}
