'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { EkkoLogo } from '@/components/brand/ekko-logo'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
    const supabase = createClient()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) {
            toast.error('Please enter your email address')
            return
        }

        setLoading(true)
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${location.origin}/auth/callback?next=/reset-password`,
        })

        if (error) {
            toast.error(error.message)
        } else {
            setSent(true)
            toast.success('Reset link sent! Check your inbox.')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-[100dvh] bg-black text-white antialiased selection:bg-white/20 selection:text-white flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-ekko-500/15 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-ekko-700/15 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="group relative overflow-hidden rounded-none border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/40 ring-1 ring-white/10 transition-all duration-500 hover:border-white/20">
                    {/* Top hairline */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <div className="p-8 md:p-10">
                        {/* Brand */}
                        <div className="mb-8 flex items-center justify-between">
                            <Link href="/">
                                <EkkoLogo size="sm" />
                            </Link>
                        </div>

                        {sent ? (
                            /* Success State */
                            <div className="text-center space-y-4 py-4">
                                <div className="mx-auto w-16 h-16 rounded-full bg-neon-teal/10 border border-neon-teal/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-neon-teal" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-2">Check your inbox</h1>
                                    <p className="text-sm text-neutral-400">
                                        We sent a password reset link to <span className="text-white font-medium">{email}</span>
                                    </p>
                                </div>
                                <p className="text-xs text-neutral-500">
                                    Didn&apos;t receive it? Check spam or{' '}
                                    <button onClick={() => setSent(false)} className="text-ekko-400 hover:text-ekko-300 transition-colors">
                                        try again
                                    </button>
                                </p>
                                <Link href="/login">
                                    <Button variant="ghost" className="mt-4 text-ekko-400 hover:text-ekko-300 gap-2">
                                        <ArrowLeft className="w-4 h-4" /> Back to login
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            /* Form State */
                            <>
                                <div className="mb-6">
                                    <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Reset Password</h1>
                                    <p className="text-sm text-neutral-400">Enter your email and we&apos;ll send you a reset link.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label htmlFor="email" className="block text-xs font-medium text-neutral-400 ml-1">Email</label>
                                        <div className="group/input relative flex items-center rounded-none border border-white/10 bg-white/5 transition-all duration-300 hover:border-white/20 focus-within:border-ekko-500/50 focus-within:bg-white/[0.07] focus-within:ring-2 focus-within:ring-ekko-500/20">
                                            <Mail className="ml-3 h-4 w-4 text-neutral-500 transition-colors group-focus-within/input:text-ekko-400" />
                                            <input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@domain.com"
                                                required
                                                className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 pt-2">
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="relative w-full h-11 rounded-none bg-gradient-to-r from-ekko-500 to-ekko-300 hover:from-ekko-400 hover:to-ekko-200 text-black font-bold shadow-[0_0_20px_-5px_rgba(99,102,241,0.35)] hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.5)] transition-all duration-300 hover:scale-[1.02]"
                                        >
                                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                            Send Reset Link
                                        </Button>

                                        <Link href="/login" className="w-full">
                                            <Button variant="ghost" className="w-full text-neutral-400 hover:text-white gap-2">
                                                <ArrowLeft className="w-4 h-4" /> Back to login
                                            </Button>
                                        </Link>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
