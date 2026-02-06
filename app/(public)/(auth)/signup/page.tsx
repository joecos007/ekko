'use client'

import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import Link from "next/link"
import { Loader2, Mail, User } from "lucide-react"
import { toast } from "sonner"
import { OAuthButtons } from "@/components/auth/oauth-buttons"
import { PasswordInput } from "@/components/ui/password-input"

export default function SignupPage() {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [acceptTerms, setAcceptTerms] = useState(false)
    const [message, setMessage] = useState("")

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!acceptTerms) {
            toast.error("Please accept the terms of service")
            return
        }

        setLoading(true)
        setMessage("")

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
                data: {
                    full_name: fullName,
                }
            },
        })

        if (error) {
            toast.error(error.message)
        } else {
            setMessage("Account created! Check your email to confirm.")
            toast.success("Account created!", {
                description: "Check your email to confirm your account.",
            })
        }
        setLoading(false)
    }

    return (
        <div className="p-8 pb-10 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md shadow-xl">
            <div className="space-y-2 text-center mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-white">Create an account</h1>
                <p className="text-neutral-400 text-sm">Enter your details to get started</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <input
                        type="text"
                        placeholder="Full name"
                        className="w-full h-10 pl-10 pr-3 py-2 bg-neutral-900/50 border border-neutral-800 rounded-md text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>

                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <input
                        type="email"
                        placeholder="name@example.com"
                        className="w-full h-10 pl-10 pr-3 py-2 bg-neutral-900/50 border border-neutral-800 rounded-md text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <PasswordInput
                    value={password}
                    onChange={setPassword}
                    placeholder="Create a password"
                    required
                    minLength={6}
                    showStrength
                />

                <label className="flex items-start gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-primary focus:ring-primary/50"
                    />
                    <span className="text-neutral-400 text-sm">
                        I agree to the{" "}
                        <Link href="/terms" className="text-white hover:underline underline-offset-4">
                            Terms of Service
                        </Link>
                        {" "}and{" "}
                        <Link href="/privacy" className="text-white hover:underline underline-offset-4">
                            Privacy Policy
                        </Link>
                    </span>
                </label>

                <Button disabled={loading} className="w-full bg-white text-black hover:bg-neutral-200" size="lg">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                </Button>
            </form>

            {message && (
                <div className="mt-6 p-3 rounded-md text-sm text-center bg-green-500/10 text-green-500 border border-green-500/20">
                    {message}
                </div>
            )}

            <div className="mt-6">
                <OAuthButtons />
            </div>

            <div className="mt-6 text-center text-sm text-neutral-500">
                Already have an account?{" "}
                <Link href="/login" className="text-white hover:underline underline-offset-4">
                    Sign in
                </Link>
            </div>
        </div>
    )
}
