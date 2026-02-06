'use client'

import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")
        setError(false)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setMessage(error.message)
            setError(true)
            toast.error(error.message)
        } else {
            // Fetch profile for welcome message
            const { data: { user } } = await supabase.auth.getUser()
            let welcomeName = email?.split('@')[0] || "User"

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('id', user.id)
                    .single()

                if (profile?.full_name) {
                    welcomeName = profile.full_name
                }
            }

            toast.success(`Welcome back, ${welcomeName}!`, {
                description: "Ready to stream some music?",
                duration: 4000,
            })

            router.push('/home')
        }
        setLoading(false)
    }

    return (
        <div className="p-8 pb-10 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md shadow-xl">
            <div className="space-y-2 text-center mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-white">Welcome back</h1>
                <p className="text-neutral-400 text-sm">Enter your credentials to sign in</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                    <input
                        type="email"
                        placeholder="name@example.com"
                        className="w-full h-10 px-3 py-2 bg-neutral-900/50 border border-neutral-800 rounded-md text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-1">
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full h-10 px-3 py-2 bg-neutral-900/50 border border-neutral-800 rounded-md text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <Button disabled={loading} className="w-full bg-white text-black hover:bg-neutral-200" size="lg">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                </Button>
            </form>

            {message && (
                <div className={`mt-6 p-3 rounded-md text-sm text-center ${error ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                    {message}
                </div>
            )}

            <div className="mt-6 text-center text-sm text-neutral-500">
                Don't have an account?{" "}
                <Link href="/signup" className="text-white hover:underline underline-offset-4">
                    Sign up
                </Link>
            </div>
        </div>
    )
}
