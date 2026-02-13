'use client';

import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import Link from 'next/link';
import { Loader2, Mail, Lock, Eye, EyeOff, Shield, Clock, LayoutTemplate, MessageSquare, Disc } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Handle Login Logic
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Successfully logged in!');
            // Redirect handled by middleware/next logic usually, or we can force it here if needed
            window.location.href = '/home';
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black text-white antialiased selection:bg-white/20 selection:text-white flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
            {/* Background with gradients to match EKKO theme */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[150px]" />
            </div>

            {/* Main Card */}
            <div className="relative z-10 w-full max-w-md md:max-w-2xl lg:max-w-[800px] xl:max-w-[900px]">
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl shadow-black/40 ring-1 ring-white/10 transition-all duration-500 hover:border-white/20 hover:ring-white/20 hover:shadow-[0_0_50px_rgba(20,241,149,0.15)]">
                    {/* Top hairline */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                    <div className="relative flex flex-col md:flex-row">
                        {/* Left Side - Visual/Image */}
                        <div className="relative w-full md:w-1/2 h-48 md:h-auto min-h-[200px] md:min-h-[400px] overflow-hidden">
                            <div className="absolute inset-0 bg-neutral-900">
                                <img
                                    src="/auth.png"
                                    alt="Authentication"
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-lg border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-md">
                                <div className="flex items-center gap-2 text-[10px] text-white/75 font-medium">
                                    <LayoutTemplate className="h-3 w-3" />
                                    <span>EKKO Immersive</span>
                                </div>
                                <span className="text-[9px] text-white/50 uppercase tracking-wider">Music Reinvented</span>
                            </div>
                        </div>

                        {/* Right Side - Login Form */}
                        <div className="p-8 md:p-10 w-full md:w-1/2 bg-black/20">
                            <div className="mb-8 flex items-center justify-between">
                                {/* Logo Area */}
                                <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-hover:bg-primary/40 transition-all" />
                                        <Disc className="w-8 h-8 text-primary relative z-10 animate-spin-slow" />
                                    </div>
                                    <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">EKKO</span>
                                </Link>
                                <div className="text-xs text-white/30 font-mono">v2.0</div>
                            </div>

                            <div className="mb-8">
                                <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Welcome back</h1>
                                <p className="text-sm text-neutral-400">Sign in to continue your session.</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-5">
                                {/* Email Input */}
                                <div className="space-y-1.5">
                                    <label htmlFor="email" className="block text-xs font-medium text-neutral-400 ml-1">Email or username</label>
                                    <div className="group relative flex items-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-white/20 focus-within:border-primary/50 focus-within:bg-white/[0.07] focus-within:ring-2 focus-within:ring-primary/20">
                                        <Mail className="ml-3 h-4 w-4 text-neutral-500 transition-colors group-focus-within:text-primary" />
                                        <input
                                            id="email"
                                            type="email"
                                            required
                                            placeholder="you@domain.com"
                                            className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Password Input */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between ml-1">
                                        <label htmlFor="password" className="block text-xs font-medium text-neutral-400">Password</label>
                                        <Link href="/forgot-password" className="text-xs text-primary/70 hover:text-primary transition-colors">Forgot?</Link>
                                    </div>
                                    <div className="group relative flex items-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-white/20 focus-within:border-primary/50 focus-within:bg-white/[0.07] focus-within:ring-2 focus-within:ring-primary/20">
                                        <Lock className="ml-3 h-4 w-4 text-neutral-500 transition-colors group-focus-within:text-primary" />
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            placeholder="••••••••"
                                            className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="mr-3 text-neutral-500 hover:text-white transition-colors focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Divider Line */}
                                <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                                {/* Submit Button */}
                                <div className="grid gap-4">
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="relative w-full h-11 rounded-xl bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90 text-black font-bold shadow-[0_0_20px_-5px_rgba(20,241,149,0.4)] hover:shadow-[0_0_25px_-5px_rgba(20,241,149,0.6)] transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                                    >
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Sign in
                                    </Button>

                                    <p className="text-center text-xs text-neutral-500">
                                        New to EKKO? <Link href="/signup" className="text-primary hover:text-green-400 transition-colors font-medium">Create an account</Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Bottom Footer Area */}
                    <div className="flex items-center justify-between border-t border-white/5 bg-black/20 px-6 py-3 text-[10px] text-white/30 uppercase tracking-wider font-medium">
                        <div className="flex items-center gap-2">
                            <Shield className="h-3 w-3" />
                            <span>Secure Encrypted</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>24/7 Access</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
