'use client'

import Link from "next/link"
import React from "react"
import { usePathname } from "next/navigation"
import { HomeIcon, LayoutGrid, Library, Heart, Mic2, ChevronDown, PlusCircle } from "lucide-react"
import { EkkoLogo } from "@/components/brand/ekko-logo"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { usePlaylists } from "@/hooks/use-playlists"


import { motion } from "motion/react"

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
    const { playlists } = usePlaylists()
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    return (
        <motion.div
            initial={{ width: 256 }}
            animate={{ width: isCollapsed ? 80 : 256 }}
            className="hidden md:flex flex-col gap-2 glass-sidebar h-[100dvh] p-4 sticky top-0 font-geist-sans z-20 relative transition-all duration-300 ease-in-out"
        >
            {/* Toggle Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-8 h-6 w-6 rounded-full bg-neutral-800 border border-white/10 text-neutral-400 hover:text-white z-50 shadow-lg"
            >
                <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", isCollapsed ? "-rotate-90" : "rotate-90")} />
            </Button>

            <div className="flex flex-col gap-6 px-3 py-6">
                <Link href="/home" className={cn("px-2 mb-2 cursor-pointer transition-all", isCollapsed ? "mx-auto" : "")}>
                    <EkkoLogo size={isCollapsed ? "sm" : "md"} showText={!isCollapsed} />
                </Link>

                <div className="flex flex-col gap-1 mt-4">
                    <Link href="/home">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start h-12 text-base font-medium relative group overflow-hidden transition-all duration-300 border-l-2 border-transparent",
                                isCollapsed ? "px-0 justify-center" : "gap-4 px-4",
                                pathname === "/home"
                                    ? "bg-white/10 text-white shadow-glow-white/10 border-ekko-500"
                                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                            )}
                            title={isCollapsed ? "Home" : undefined}
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
                            <HomeIcon className={cn("w-5 h-5 flex-shrink-0", pathname === "/home" ? "text-ekko-400" : "")} />
                            {!isCollapsed && <span className="truncate">Home</span>}
                        </Button>
                    </Link>

                    <Link href="/categories">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start h-12 text-base font-medium relative group overflow-hidden transition-all duration-300 border-l-2 border-transparent",
                                isCollapsed ? "px-0 justify-center" : "gap-4 px-4",
                                pathname === "/categories"
                                    ? "bg-white/10 text-white shadow-glow-white/10 border-ekko-500"
                                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                            )}
                            title={isCollapsed ? "Categories" : undefined}
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
                            <LayoutGrid className={cn("w-5 h-5 flex-shrink-0", pathname === "/categories" ? "text-ekko-400" : "")} />
                            {!isCollapsed && <span className="truncate">Categories</span>}
                        </Button>
                    </Link>

                    <Link href="/artists">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start h-12 text-base font-medium relative group overflow-hidden transition-all duration-300 border-l-2 border-transparent",
                                isCollapsed ? "px-0 justify-center" : "gap-4 px-4",
                                pathname === "/artists"
                                    ? "bg-white/10 text-white shadow-glow-white/10 border-ekko-500"
                                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                            )}
                            title={isCollapsed ? "Artists" : undefined}
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
                            <Mic2 className={cn("w-5 h-5 flex-shrink-0", pathname === "/artists" ? "text-ekko-400" : "")} />
                            {!isCollapsed && <span className="truncate">Artists</span>}
                        </Button>
                    </Link>

                    <div className="pt-4 pb-2">
                        {!isCollapsed ? (
                            <div className="flex items-center justify-between px-4 mb-2 group cursor-pointer">
                                <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest group-hover:text-neutral-300 transition-colors">Playlists</span>
                                <ChevronDown className="w-3 h-3 text-neutral-600 group-hover:text-neutral-300 transition-colors" />
                            </div>
                        ) : (
                            <div className="h-[1px] w-8 mx-auto bg-white/5 mb-2" />
                        )}
                    </div>
                    <Link href="/library">
                        <Button
                            variant="ghost"
                            className={cn(
                                "w-full justify-start h-12 text-base font-medium relative group overflow-hidden transition-all duration-300 border-l-2 border-transparent",
                                isCollapsed ? "px-0 justify-center" : "gap-4 px-4",
                                pathname === "/library"
                                    ? "bg-white/10 text-white shadow-glow-white/10 border-ekko-500"
                                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                            )}
                            title={isCollapsed ? "Library" : undefined}
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
                            <Library className={cn("w-5 h-5 flex-shrink-0", pathname === "/library" ? "text-ekko-400" : "")} />
                            {!isCollapsed && <span className="truncate">Library</span>}
                        </Button>
                    </Link>
                </div >

                <TeamStoryDialog>
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start text-sm lg:text-base font-semibold transition-all duration-300",
                            isCollapsed ? "px-0 justify-center" : "gap-4 lg:gap-5",
                            "text-neutral-400 hover:text-white hover:bg-white/5"
                        )}
                        title={isCollapsed ? "Team Story" : undefined}
                    >
                        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold border border-current rounded-none w-4 h-4 flex items-center justify-center text-neutral-400">?</span>
                        </div>
                        {!isCollapsed && <span className="truncate">Team Story</span>}
                    </Button>
                </TeamStoryDialog >
            </div >

            <div className="flex flex-col gap-1.5 px-2 mt-6">
                {!isCollapsed && (
                    <div className="px-2 text-[10px] lg:text-xs font-black text-ekko-400/50 uppercase tracking-[0.2em] mb-3">
                        Your Music
                    </div>
                )}
                <CreatePlaylistDialog>
                    {/* Pass isCollapsed to customize trigger if needed, but for now button is external */}
                </CreatePlaylistDialog>
                <UploadSongDialog>
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start text-sm lg:text-base font-semibold transition-all duration-300 text-neutral-400 hover:text-white hover:bg-white/5 group px-3",
                            isCollapsed ? "px-0 justify-center" : "gap-4 lg:gap-5"
                        )}
                        title={isCollapsed ? "Upload Song" : undefined}
                    >
                        <PlusCircle className="w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0" />
                        {!isCollapsed && <span className="truncate">Upload Song</span>}
                    </Button>
                </UploadSongDialog>
                <Link href="/liked">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full justify-start text-sm lg:text-base font-semibold transition-all duration-300 relative overflow-hidden group/btn px-3",
                            isCollapsed ? "px-0 justify-center" : "gap-4 lg:gap-5",
                            pathname === "/liked"
                                ? "bg-red-600/10 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)] border border-red-500/30"
                                : "text-neutral-400 hover:text-white hover:bg-white/5 hover:pl-4"
                        )}
                        title={isCollapsed ? "Liked Songs" : undefined}
                    >
                        {pathname === "/liked" && <div className="absolute inset-y-0 left-0 w-1 bg-red-500 shadow-[0_0_10px_#ef4444]" />}
                        <div className="w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center bg-gradient-to-br from-ekko-500 to-ekko-700 shadow-lg shadow-ekko-600/20 group-hover/btn:scale-110 transition-transform flex-shrink-0">
                            <Heart className={cn("w-3 h-3 lg:w-3.5 lg:h-3.5 text-white fill-white transition-colors", pathname === "/liked" ? "text-white" : "")} />
                        </div>
                        {!isCollapsed && <span className="truncate">Liked Songs</span>}
                    </Button>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-4 border-t border-white/5 mt-4">
                {!isCollapsed && (
                    <div className="px-3 text-[10px] lg:text-xs font-black text-ekko-400/50 uppercase tracking-[0.2em] mb-3">
                        Playlists
                    </div>
                )}
                {playlists?.map(playlist => (
                    <Link key={playlist.id} href={`/playlist/${playlist.id}`}>
                        <div
                            className={cn(
                                "text-sm lg:text-base text-neutral-400 hover:text-white hover:bg-white/5 cursor-pointer py-2 transition-all truncate font-medium border-l-2 border-transparent hover:border-white/20",
                                isCollapsed ? "px-0 text-center text-xs" : "px-3"
                            )}
                            title={isCollapsed ? playlist.title : undefined}
                        >
                            {isCollapsed ? playlist.title.substring(0, 2).toUpperCase() : playlist.title}
                        </div>
                    </Link>
                ))}
            </div>
        </motion.div >
    )
}
