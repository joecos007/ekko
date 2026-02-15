import { useState, useEffect } from "react"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerTrigger,
    DrawerClose
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { X, Home, Search, Library, Heart, Disc, User, LogOut, Sparkles } from "lucide-react"
import Link from "next/link"
import { usePlaylists } from "@/hooks/use-playlists"
import { createClient } from "@/utils/supabase/client"
import { useRouter, usePathname } from "next/navigation"
import { TeamStoryDialog } from "@/components/layout/team-story-dialog"

interface MenuDrawerProps {
    children: React.ReactNode
}

export function MenuDrawer({ children }: MenuDrawerProps) {
    const supabase = createClient()
    const { playlists } = usePlaylists()
    const router = useRouter()
    const pathname = usePathname() // Add usePathname
    const [open, setOpen] = useState(false) // Add open state

    // Close drawer when pathname changes
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => setOpen(false), 0)
            return () => clearTimeout(timer)
        }
    }, [pathname, open])

    const handleLogout = async () => {
        setOpen(false)
        await supabase.auth.signOut()
        router.refresh()
        router.replace('/login')
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent className="bg-neutral-950 border-white/10 text-white h-[90vh] outline-none flex flex-col">
                <div className="mx-auto w-full max-w-md flex flex-col h-full relative p-6 overflow-hidden">
                    <DrawerHeader className="sr-only">
                        <DrawerTitle>Menu</DrawerTitle>
                        <DrawerDescription>Navigation links</DrawerDescription>
                    </DrawerHeader>

                    <DrawerClose asChild className="absolute top-4 right-4 z-50">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-neutral-800/50 hover:bg-neutral-800 text-neutral-400">
                            <X className="w-5 h-5" />
                        </Button>
                    </DrawerClose>

                    {/* Brand */}
                    <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 mb-8 mt-2 group cursor-pointer">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-hover:bg-primary/40 transition-all" />
                            <Disc className="w-8 h-8 text-primary relative z-10 animate-spin-slow" />
                        </div>
                        <span className="text-4xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">EKKO</span>
                    </Link>

                    <div className="flex-1 overflow-y-auto space-y-8 pr-2">
                        {/* Main Nav */}
                        <div className="flex flex-col gap-2">
                            <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-4 text-xl font-bold text-neutral-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                                <Home className="w-6 h-6" /> Home
                            </Link>
                            <Link href="/search" onClick={() => setOpen(false)} className="flex items-center gap-4 text-xl font-bold text-neutral-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                                <Search className="w-6 h-6" /> Search
                            </Link>
                            <Link href="/vibes" onClick={() => setOpen(false)} className="flex items-center gap-4 text-xl font-bold text-neutral-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                                <Sparkles className="w-6 h-6" /> Community Vibes
                            </Link>
                            <Link href="/library" onClick={() => setOpen(false)} className="flex items-center gap-4 text-xl font-bold text-neutral-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                                <Library className="w-6 h-6" /> Your Library
                            </Link>
                            <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-4 text-xl font-bold text-neutral-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
                                <User className="w-6 h-6" /> Profile
                            </Link>
                            <TeamStoryDialog>
                                <button className="w-full flex items-center gap-4 text-xl font-bold text-neutral-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg text-left">
                                    <div className="w-6 h-6 flex items-center justify-center">
                                        <span className="text-sm font-bold border border-current rounded-full w-5 h-5 flex items-center justify-center">?</span>
                                    </div>
                                    Team Story
                                </button>
                            </TeamStoryDialog>
                        </div>

                        {/* Your Music */}
                        <div>
                            <div className="px-2 text-[10px] font-black text-blue-400/50 uppercase tracking-[0.2em] mb-4">Your Music</div>
                            <Link href="/liked" onClick={() => setOpen(false)} className="flex items-center gap-4 text-lg font-medium text-neutral-300 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg group">
                                <div className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[6px] shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                                    <Heart className="w-3.5 h-3.5 text-white fill-white" />
                                </div>
                                Liked Songs
                            </Link>
                        </div>

                        {/* Playlists */}
                        <div>
                            <div className="px-2 text-[10px] font-black text-blue-400/50 uppercase tracking-[0.2em] mb-4">Playlists</div>
                            <div className="flex flex-col gap-1">
                                {playlists?.map(playlist => (
                                    <Link key={playlist.id} href={`/playlist/${playlist.id}`} onClick={() => setOpen(false)} className="text-lg font-medium text-neutral-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg truncate">
                                        {playlist.title}
                                    </Link>
                                ))}
                                {!playlists?.length && (
                                    <div className="text-neutral-600 italic px-2">No playlists yet</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-4 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-5 h-5" />
                            Log Out
                        </Button>
                        <div className="mt-4 flex gap-4 text-neutral-600 text-[10px] justify-center">
                            <Link href="/terms" onClick={() => setOpen(false)}>Terms</Link>
                            <Link href="/privacy" onClick={() => setOpen(false)}>Privacy</Link>
                            <span>v1.0.0</span>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
