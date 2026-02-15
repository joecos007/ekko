'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { AuroraBackground } from '@/components/auth/aurora-background';
import { SocialAuthButtons } from '@/components/auth/social-auth-buttons';
import { motion } from 'framer-motion';

// Magic UI Components
import { SparklesText } from '@/components/ui/sparkles-text';
import { Ripple } from '@/components/ui/ripple';
import { NumberTicker } from '@/components/ui/number-ticker';
import { BorderBeam } from '@/components/ui/border-beam';

export default function LoginPage() {
    const supabase = createClient()
    const router = useRouter();
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
            router.push('/home');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-black text-white font-sans selection:bg-indigo-500/30">
            {/* Left Panel - Immersive Visual */}
            <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-neutral-900">
                {/* Background Illustration */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/auth.png"
                        alt="Auth Background"
                        fill
                        sizes="50vw"
                        className="object-cover opacity-30 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
                </div>

                <AuroraBackground className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-1">
                    {/* Aurora is strictly background */}
                </AuroraBackground>

                {/* Ripple Effect */}
                <Ripple mainCircleSize={210} numCircles={6} className="z-[1] opacity-30" />

                {/* Brand Overlay */}
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                            <div className="w-3 h-3 bg-black rounded-full animate-pulse" />
                        </div>
                        EKKO
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[0.9]"
                    >
                        Redefine<br />
                        <SparklesText className="text-5xl md:text-7xl" sparklesCount={8}>Your Sound.</SparklesText>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg text-neutral-400 leading-relaxed max-w-sm"
                    >
                        Experience music like never before with AI-driven curation and high-fidelity streaming.
                    </motion.p>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border border-black bg-neutral-800 flex items-center justify-center text-[10px] uppercase">
                                    A{i}
                                </div>
                            ))}
                        </div>
                        <p>Joined by <NumberTicker value={10000} className="text-neutral-400" />+ audiophiles</p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="relative flex flex-col justify-center items-center px-4 sm:px-12 lg:px-24 bg-neutral-950">
                {/* Back Button (Mobile/Desktop) */}
                <div className="absolute top-6 left-6 lg:top-12 lg:left-12">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white gap-2 pl-0 hover:bg-transparent">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                    </Link>
                </div>

                <div className="w-full max-w-sm space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                        <p className="mt-2 text-neutral-400">Enter your credentials to access your account.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-300">
                                    Email
                                </label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex h-11 w-full rounded-md border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm text-white shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:border-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                                    />
                                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-300">
                                        Password
                                    </label>
                                    <Link href="/forgot-password" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="flex h-11 w-full rounded-md border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm text-white shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 focus-visible:border-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 pl-10 pr-10"
                                    />
                                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-3.5 text-neutral-500 hover:text-white transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="relative group rounded-md overflow-hidden">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-white text-black hover:bg-neutral-200 transition-colors h-11 font-semibold"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                            <BorderBeam size={40} duration={4} delay={9} />
                        </div>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-neutral-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-neutral-950 px-2 text-neutral-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <SocialAuthButtons />

                    <p className="text-center text-sm text-neutral-400">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="font-medium text-white hover:underline underline-offset-4 decoration-indigo-500 decoration-2">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
