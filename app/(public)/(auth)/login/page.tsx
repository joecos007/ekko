'use client'

import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import Link from "next/link"
import { Loader2, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { PasswordInput } from "@/components/ui/password-input"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
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
        <div className="p-8 md:p-12 pb-10 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md shadow-xl max-w-md w-full mx-4">
            <div className="space-y-3 text-center mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
                <p className="text-neutral-400 text-base">Enter your credentials to sign in</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
                    <input
                        type="email"
                        placeholder="name@example.com"
                        className="w-full h-12 pl-11 pr-4 py-2 bg-neutral-900/50 border border-neutral-800 rounded-lg text-base text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-4">
                    <PasswordInput
                        value={password}
                        onChange={setPassword}
                        placeholder="Password"
                        required
                    />

                    <div className="flex items-center justify-between text-sm pt-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-primary focus:ring-primary/50 group-hover:border-neutral-500 transition-colors"
                            />
                            <span className="text-neutral-400 group-hover:text-neutral-300 transition-colors">Remember me</span>
                        </label>
                        <Link href="/forgot-password" className="text-neutral-400 hover:text-white transition-colors">
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <Button disabled={loading} className="w-full h-12 text-base font-medium bg-white text-black hover:bg-neutral-200 mt-2" size="lg">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                </Button>
            </form>

            <div className="mt-8 text-center text-sm text-neutral-500">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-white hover:underline underline-offset-4 ml-1">
                    Sign up
                </Link>
            </div>
        </div>
    )
}
