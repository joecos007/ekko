"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Compass, Radio, MoreHorizontal, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { UploadSongDialog } from "@/components/upload/upload-song-dialog"
import { MenuDrawer } from "@/components/layout/menu-drawer"
import { usePlayer } from "@/store/player-store"

import { ClientOnly } from "@/components/ui/client-only"

export function MobileNav() {
    const pathname = usePathname()
    const { isRadio, toggleRadio } = usePlayer()

    return (
        <>
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-[var(--mobile-nav-safe)] bg-neutral-950/80 backdrop-blur-2xl border-t border-white/5 z-50 grid grid-cols-5 items-center pb-[calc(0.5rem+var(--safe-bottom))] px-2 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">

                {/* Home */}
                <Link href="/home" className="flex flex-col items-center justify-center gap-1 h-full active:scale-90 transition-transform duration-300 group">
                    <div className={cn("p-1 rounded-full transition-colors duration-300 group-active:bg-white/10", pathname === "/home" && !isRadio ? "bg-white/5" : "")}>
                        <Home className={cn("w-6 h-6 transition-colors duration-300", pathname === "/home" && !isRadio ? "fill-white text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-neutral-500 group-hover:text-neutral-300")} />
                    </div>
                    <span className={cn("text-[10px] font-bold tracking-wider uppercase transition-colors duration-300", pathname === "/home" && !isRadio ? "text-white" : "text-neutral-600 group-hover:text-neutral-500")}>Home</span>
                </Link>

                {/* Explore */}
                <Link href="/search" className="flex flex-col items-center justify-center gap-1 h-full active:scale-90 transition-transform duration-300 group">
                    <div className={cn("p-1 rounded-full transition-colors duration-300 group-active:bg-white/10", pathname === "/search" ? "bg-white/5" : "")}>
                        <Compass className={cn("w-6 h-6 transition-colors duration-300", pathname === "/search" ? "text-white fill-white/20 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-neutral-500 group-hover:text-neutral-300")} />
                    </div>
                    <span className={cn("text-[10px] font-bold tracking-wider uppercase transition-colors duration-300", pathname === "/search" ? "text-white" : "text-neutral-600 group-hover:text-neutral-500")}>Explore</span>
                </Link>

                {/* Upload - Docked FAB */}
                <div className="relative flex flex-col items-center justify-start h-full -top-5">
                    <ClientOnly>
                        <UploadSongDialog>
                            <div className="group flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-90 transition-transform duration-500 ease-out-back">
                                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-ekko-400 to-ekko-600 flex items-center justify-center shadow-[0_8px_30px_rgba(99,102,241,0.4)] border-[3px] border-black group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <PlusCircle className="w-7 h-7 text-white fill-white/20" />
                                </div>
                                <span className="text-[10px] font-black text-transparent bg-clip-text bg-gradient-to-r from-ekko-300 to-ekko-400 tracking-widest uppercase mt-1 drop-shadow-sm">Upload</span>
                            </div>
                        </UploadSongDialog>
                    </ClientOnly>
                </div>

                {/* Radio (Replaces Library) */}
                <div
                    onClick={toggleRadio}
                    className="flex flex-col items-center justify-center gap-1 h-full active:scale-90 transition-transform duration-300 group cursor-pointer"
                >
                    <div className={cn("p-1 rounded-full transition-colors duration-300 group-active:bg-white/10", isRadio ? "bg-white/5" : "")}> 
                        <Radio className={cn("w-6 h-6 transition-colors duration-300", isRadio ? "text-ekko-400 fill-ekko-500/20 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] animate-pulse" : "text-neutral-500 group-hover:text-neutral-300")} />
                    </div>
                    <span className={cn("text-[10px] font-bold tracking-wider uppercase transition-colors duration-300", isRadio ? "text-ekko-400" : "text-neutral-600 group-hover:text-neutral-500")}>Radio</span>
                </div>

                {/* Menu / Profile */}
                <div className="flex flex-col items-center justify-center gap-1 h-full group">
                    <ClientOnly>
                        <MenuDrawer>
                            <button className="flex flex-col items-center justify-center gap-1 cursor-pointer w-full h-full">
                                <div className={cn("p-1 rounded-full transition-colors duration-300", pathname === "/profile" ? "bg-white/5" : "")}>
                                    <MoreHorizontal className={cn("w-6 h-6 transition-colors duration-300", pathname === "/profile" ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-neutral-500 group-hover:text-neutral-300")} />
                                </div>
                                <span className={cn("text-[10px] font-bold tracking-wider uppercase transition-colors duration-300", pathname === "/profile" ? "text-white" : "text-neutral-600 group-hover:text-neutral-500")}>Menu</span>
                            </button>
                        </MenuDrawer>
                    </ClientOnly>
                </div>
            </div>

        </>
    )
}
