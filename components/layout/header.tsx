import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/client"
import { useUser } from "@/hooks/use-user"
import { ChevronLeft, ChevronRight, Search, Heart, Settings } from "lucide-react"
import { EkkoLogo } from "@/components/brand/ekko-logo"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"

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
    const [supabase] = useState(() => createClient())
    const { user } = useUser()
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [greeting, setGreeting] = useState('Welcome')
    const [userName, setUserName] = useState('')
    const router = useRouter()

    useEffect(() => {
        const getProfile = async () => {
            if (user) {
                const { data } = await supabase.from('profiles').select('avatar_url, full_name').eq('id', user.id).single()
                if (data) {
                    setAvatarUrl(data.avatar_url)
                    // Try to get name from profile, fallback to metadata
                    const name = data.full_name || user.user_metadata?.full_name || user.user_metadata?.name || ''
                    setUserName(name.split(' ')[0])
                } else {
                    const name = user.user_metadata?.full_name || user.user_metadata?.name || ''
                    setUserName(name.split(' ')[0])
                }
            } else {
                setAvatarUrl(null)
                setUserName('')
            }
        }
        getProfile()
    }, [user, supabase])

    useEffect(() => {
        const h = new Date().getHours()
        if (h < 12) {
            setGreeting('Good Morning')
        } else if (h < 17) {
            setGreeting('Good Afternoon')
        } else {
            setGreeting('Good Evening')
        }
    }, [])

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
        <div className="h-20 flex items-center justify-between px-8 sticky top-0 bg-surface-1 z-40 border-b border-white/5">
            <div className="flex items-center gap-4 w-1/3">
                <div className="md:hidden">
                    <EkkoLogo size="sm" />
                </div>
                {/* Dynamic Greeting Replaces Nav Buttons */}
                <div className="hidden md:flex flex-col justify-center">
                    <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                        {greeting}{userName ? `, ${userName}` : ''}
                    </h1>
                </div>
            </div>

            {/* Central Search Bar */}
            <div className="flex-1 max-w-xl mx-4 relative hidden md:block">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-white transition-colors" />
                    <Input
                        placeholder="Search for a song"
                        className="w-full bg-surface-2 border-transparent focus:border-white/10 rounded-none h-12 pl-12 text-base placeholder:text-neutral-500 text-white transition-all shadow-none focus-visible:ring-0 focus-visible:bg-surface-3"
                    />
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 w-1/3">
                {user ? (
                    <div className="flex items-center gap-3">
                        {/* Removed Heart/Settings Icons & Static Name */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar className="h-10 w-10 transition-transform hover:scale-105 border border-white/10 hover:border-white/20 cursor-pointer relative shadow-lg rounded-none">
                                    {avatarUrl || user.user_metadata?.avatar_url ? (
                                        <img
                                            src={avatarUrl || user.user_metadata?.avatar_url}
                                            alt="Profile"
                                            className="aspect-square h-full w-full object-cover"
                                        />
                                    ) : (
                                        <AvatarFallback className="bg-gradient-to-br from-ekko-500 to-ekko-700 text-white text-xs font-bold rounded-none">
                                            {user.email?.[0]?.toUpperCase() ?? "?"}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 bg-surface-2 border-white/5 text-white shadow-xl rounded-none">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-white/5" />
                                <DropdownMenuItem onClick={() => router.push('/profile')}>
                                    <UserSettings className="mr-2 h-4 w-4" />
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/5" />
                                <DropdownMenuItem onClick={handleSignOut} className="text-red-400 focus:text-red-400 focus:bg-red-500/10">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link href="/signup">
                            <Button variant="outline" className="rounded-none h-10 px-6 font-semibold text-sm tracking-wide uppercase text-white border-white/20 hover:bg-white/5">
                                Sign up
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button className="rounded-none h-10 px-6 font-semibold text-sm tracking-wide uppercase bg-white text-black hover:bg-neutral-200">
                                Log in
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
