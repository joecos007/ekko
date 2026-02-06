"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Library, User } from "lucide-react"
import { cn } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

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
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-neutral-800 z-50 flex items-center justify-around px-2 pb-1">
            <Link href="/" className="flex flex-col items-center gap-1 p-2">
                <Home className={cn("w-6 h-6", pathname === "/" ? "fill-white text-white" : "text-neutral-500")} />
                <span className={cn("text-[10px]", pathname === "/" ? "text-white" : "text-neutral-500")}>Home</span>
            </Link>
            <Link href="/search" className="flex flex-col items-center gap-1 p-2">
                <Search className={cn("w-6 h-6", pathname === "/search" ? "text-white stroke-[3px]" : "text-neutral-500")} />
                <span className={cn("text-[10px]", pathname === "/search" ? "text-white" : "text-neutral-500")}>Search</span>
            </Link>
            <Link href="/library" className="flex flex-col items-center gap-1 p-2">
                <Library className={cn("w-6 h-6", pathname === "/library" ? "fill-white text-white" : "text-neutral-500")} />
                <span className={cn("text-[10px]", pathname === "/library" ? "text-white" : "text-neutral-500")}>Library</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center gap-1 p-2">
                <div className={cn("rounded-full border-2 transition-all", pathname === "/profile" ? "border-white" : "border-transparent")}>
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={avatarUrl || ""} className="object-cover" />
                        <AvatarFallback className="bg-neutral-800 text-[10px] text-white">
                            <User className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                </div>
                <span className={cn("text-[10px]", pathname === "/profile" ? "text-white" : "text-neutral-500")}>Profile</span>
            </Link>
        </div>
    )
}
