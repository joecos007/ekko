'use client'

import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useUser } from "@/hooks/use-user"
import { ChevronLeft, ChevronRight, Disc } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User as UserSettings } from "lucide-react"
import { toast } from "sonner"

export function Header() {
    const supabase = createClient()
    const { user } = useUser()
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const router = useRouter()

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

    const handleSignOut = async () => {
        try {
            await supabase.auth.signOut()
            toast.success("Signed out successfully")
            router.push('/')
        } catch (error: any) {
            toast.error(error.message || "Failed to sign out")
        }
    }

    return (
        <div className="h-16 flex items-center justify-between px-6 sticky top-0 bg-transparent border-b border-white/5 z-40">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 group md:hidden">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full group-hover:bg-blue-500/40 transition-all" />
                        <Disc className="w-7 h-7 text-blue-400 relative z-10 animate-spin-slow" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">EKKO</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full hover:bg-white/5 disabled:opacity-50 hidden md:flex transition-all">
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => router.forward()} className="rounded-full hover:bg-white/5 disabled:opacity-50 hidden md:flex transition-all">
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="h-8 w-8 transition-transform hover:scale-105 border-2 border-transparent hover:border-white/20 cursor-pointer">
                                    <AvatarImage src={avatarUrl || user.user_metadata?.avatar_url || ""} className="object-cover" />
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">
                                        {user.email?.[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-neutral-900 border-neutral-800 text-white">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-neutral-800" />
                                <DropdownMenuItem onClick={() => router.push('/profile')}>
                                    <UserSettings className="mr-2 h-4 w-4" />
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-neutral-800" />
                                <DropdownMenuItem onClick={handleSignOut} className="text-red-400 focus:text-red-400 focus:bg-red-400/10">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link href="/signup" className="text-neutral-400 hover:text-white font-bold text-sm tracking-wide">
                            Sign up
                        </Link>
                        <Link href="/login">
                            <Button className="rounded-full px-8 font-bold bg-white text-black hover:bg-neutral-200">
                                Log in
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
