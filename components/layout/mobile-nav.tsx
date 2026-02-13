"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Library, User } from "lucide-react"
import { cn } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { Plus } from "lucide-react"

const UploadSongDialog = dynamic(
    () => import("@/components/upload/upload-song-dialog").then((mod) => mod.UploadSongDialog),
    { ssr: false }
)

export function MobileNav() {
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
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-[5.5rem] bg-black/95 backdrop-blur-xl border-t border-white/10 z-50 grid grid-cols-5 items-end pb-safe">

            {/* Home */}
            <Link href="/" className="flex flex-col items-center justify-center gap-1 h-full pb-2 active:scale-95 transition-transform">
                <Home className={cn("w-6 h-6", pathname === "/" ? "fill-white text-white" : "text-neutral-500")} />
                <span className={cn("text-[10px] font-medium tracking-wide", pathname === "/" ? "text-white" : "text-neutral-500")}>Home</span>
            </Link>

            {/* Search */}
            <Link href="/search" className="flex flex-col items-center justify-center gap-1 h-full pb-2 active:scale-95 transition-transform">
                <Search className={cn("w-6 h-6", pathname === "/search" ? "text-white stroke-[3px]" : "text-neutral-500")} />
                <span className={cn("text-[10px] font-medium tracking-wide", pathname === "/search" ? "text-white" : "text-neutral-500")}>Search</span>
            </Link>

            {/* Upload - Docked FAB */}
            <div className="relative flex flex-col items-center justify-end h-full -top-5">
                <UploadSongDialog>
                    <div className="group flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 transition-transform">
                        <div className="h-14 w-14 rounded-full bg-[#14F195] flex items-center justify-center shadow-[0_4px_20px_rgba(20,241,149,0.3)] border-4 border-black group-hover:bg-[#10c479] transition-colors">
                            <Plus className="w-7 h-7 text-black stroke-[3px]" />
                        </div>
                        <span className="text-[10px] font-bold text-[#14F195] tracking-wide">Upload</span>
                    </div>
                </UploadSongDialog>
            </div>

            {/* Library */}
            <Link href="/library" className="flex flex-col items-center justify-center gap-1 h-full pb-2 active:scale-95 transition-transform">
                <Library className={cn("w-6 h-6", pathname === "/library" ? "fill-white text-white" : "text-neutral-500")} />
                <span className={cn("text-[10px] font-medium tracking-wide", pathname === "/library" ? "text-white" : "text-neutral-500")}>Library</span>
            </Link>

            {/* Profile */}
            <Link href="/profile" className="flex flex-col items-center justify-center gap-1 h-full pb-2 active:scale-95 transition-transform">
                <div className={cn("rounded-full border-2 transition-all p-[1px]", pathname === "/profile" ? "border-white" : "border-transparent text-neutral-500")}>
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={avatarUrl || ""} className="object-cover" />
                        <AvatarFallback className="bg-neutral-800 text-[9px] text-white">
                            <User className="h-3 w-3" />
                        </AvatarFallback>
                    </Avatar>
                </div>
                <span className={cn("text-[10px] font-medium tracking-wide", pathname === "/profile" ? "text-white" : "text-neutral-500")}>Profile</span>
            </Link>
        </div>
    )
}
