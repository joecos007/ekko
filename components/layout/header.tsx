'use client'

import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import { ChevronLeft, ChevronRight, Disc, User as UserIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
    const [user, setUser] = useState<User | null>(null)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            if (user) {
                const { data } = await supabase.from('profiles').select('avatar_url').eq('id', user.id).single()
                if (data) setAvatarUrl(data.avatar_url)
            }
        }
        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                const { data } = await supabase.from('profiles').select('avatar_url').eq('id', session.user.id).single()
                if (data) setAvatarUrl(data.avatar_url)
            } else {
                setAvatarUrl(null)
            }
        })
        return () => subscription.unsubscribe()
    }, [])



    return (
        <div className="h-16 flex items-center justify-between px-6 sticky top-0 bg-background/95 backdrop-blur z-40">


            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 group md:hidden">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-hover:bg-primary/40 transition-all" />
                        <Disc className="w-7 h-7 text-primary relative z-10 animate-spin-slow" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">EKKO</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full bg-black/50 hover:bg-black/70 disabled:opacity-50 hidden md:flex">
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => router.forward()} className="rounded-full bg-black/50 hover:bg-black/70 disabled:opacity-50 hidden md:flex">
                    <ChevronRight className="w-5 h-5" />
                </Button>
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <div className="flex items-center gap-4">
                        <Link href="/profile">
                            <Avatar className="h-8 w-8 transition-transform hover:scale-105 border-2 border-transparent hover:border-white/20">
                                {/* Use a key to force re-render if avatar updates elsewhere, though simple refetch works for now */}
                                <AvatarImage src={avatarUrl || user.user_metadata?.avatar_url || ""} className="object-cover" />
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">
                                    {user.email?.[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </Link>
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
