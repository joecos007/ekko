'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowLeft, Key, MessageSquare, CheckCircle2, Shield, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { AuroraBackground } from '@/components/auth/aurora-background';
import { EkkoLogo } from '@/components/brand/ekko-logo';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MagicCard } from '@/components/ui/magic-card';
import { RetroGrid } from '@/components/ui/retro-grid';
import { DotPattern } from '@/components/ui/dot-pattern';
import { SparklesText } from '@/components/ui/sparkles-text';
import { Ripple } from '@/components/ui/ripple';
import { NumberTicker } from '@/components/ui/number-ticker';
import { BorderBeam } from '@/components/ui/border-beam';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required').optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const supabase = createClient()
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Auth method state
    const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
    const [otpStep, setOtpStep] = useState<'send' | 'verify'>('send');
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const [userEmail, setUserEmail] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const watchedEmail = watch('email');

    // Cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const onSubmit = async (data: LoginForm) => {
        setLoading(true);

        if (loginMethod === 'password') {
            if (!data.password) {
                toast.error('Please enter your password');
                setLoading(false);
                return;
            }
            const { error } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password,
            });

            if (error) {
                toast.error(error.message);
            } else {
                toast.success('Successfully logged in!');
                router.push('/home');
            }
        } else {
            // OTP Send flow
            setUserEmail(data.email);
            const { error } = await supabase.auth.signInWithOtp({
                email: data.email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (error) {
                if (error.status === 429) {
                    toast.error('Email rate limit reached. Please wait an hour before trying again.');
                } else {
                    toast.error(error.message);
                }
            } else {
                setOtpStep('verify');
                setResendCooldown(60);
                toast.success('Verification code sent!', {
                    description: `Check your inbox at ${data.email}`,
                });
            }
        }
        setLoading(false);
    };

    const handleOtpChange = useCallback((index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newValues = [...otpValues];
        newValues[index] = value.slice(-1);
        setOtpValues(newValues);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }, [otpValues]);

    const handleOtpKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }, [otpValues]);

    const handleOtpPaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            const newValues = pasted.split('');
            setOtpValues(newValues);
            inputRefs.current[5]?.focus();
        }
    }, []);

    const verifyOtp = async () => {
        const code = otpValues.join('');
        if (code.length !== 6) {
            toast.error('Please enter the full 6-digit code');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.verifyOtp({
            email: userEmail,
            token: code,
            type: 'email',
        });

        if (error) {
            toast.error(error.message || 'Invalid code. Please try again.');
            setOtpValues(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } else {
            toast.success('Successfully logged in!');
            router.push('/home');
        }
        setLoading(false);
    };

    const resendCode = async () => {
        if (resendCooldown > 0) return;
        setResendCooldown(60);

        const { error } = await supabase.auth.signInWithOtp({
            email: userEmail,
        });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success('New code sent!');
        }
    };

    // Auto-submit OTP
    useEffect(() => {
        if (otpValues.every(v => v !== '') && otpStep === 'verify') {
            verifyOtp();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otpValues, otpStep]);

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-black text-white font-sans selection:bg-ekko-500/30">
            {/* Left Panel - Immersive Visual */}
            <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-neutral-900">
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

                <AuroraBackground className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-1" />
                <Ripple mainCircleSize={210} numCircles={6} className="z-[1] opacity-30" />

                <div className="relative z-10">
                    <EkkoLogo size="md" />
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
                <div className="absolute top-6 left-6 lg:top-12 lg:left-12 flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white gap-2 pl-0 hover:bg-transparent">
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>
                    </Link>
                </div>

                <MagicCard
                    className="w-full max-w-md p-8 md:p-10 border-white/5 bg-neutral-900/50 backdrop-blur-xl shadow-2xl shadow-black/40"
                    gradientColor="#262626"
                    gradientFrom="#6366f1"
                    gradientTo="#14F195"
                    gradientSize={300}
                    gradientOpacity={0.2}
                >
                    <AnimatePresence mode="wait">
                        {otpStep === 'send' ? (
                            <motion.div
                                key="login-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8 relative z-10"
                            >
                                <div className="text-center lg:text-left">
                                    <h2 className="text-3xl font-bold tracking-tight text-white">
                                        {loginMethod === 'password' ? 'Welcome back' : 'Sign in with Code'}
                                    </h2>
                                    <p className="mt-2 text-neutral-400">
                                        {loginMethod === 'password'
                                            ? 'Enter your credentials to access your account.'
                                            : 'We\'ll send a 6-digit code to your email.'}
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none text-neutral-300">
                                                Email
                                            </label>
                                            <div className="relative group">
                                                <input
                                                    type="email"
                                                    placeholder="name@example.com"
                                                    {...register('email')}
                                                    className={`flex h-11 w-full rounded-none border bg-neutral-900/80 px-3 py-2 text-sm text-white shadow-sm transition-colors placeholder:text-neutral-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ekko-500 focus-visible:border-ekko-500/50 disabled:cursor-not-allowed disabled:opacity-50 pl-10 ${errors.email ? 'border-red-500/50' : 'border-neutral-800'}`}
                                                />
                                                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500 group-focus-within:text-ekko-400 transition-colors" />
                                            </div>
                                            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
                                        </div>

                                        {loginMethod === 'password' && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm font-medium leading-none text-neutral-300">
                                                        Password
                                                    </label>
                                                    <Link href="/forgot-password" className="text-sm text-ekko-400 hover:text-ekko-300 transition-colors">
                                                        Forgot password?
                                                    </Link>
                                                </div>
                                                <div className="relative group">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        placeholder="••••••••"
                                                        {...register('password')}
                                                        className={`flex h-11 w-full rounded-none border bg-neutral-900/80 px-3 py-2 text-sm text-white shadow-sm transition-colors placeholder:text-neutral-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ekko-500 focus-visible:border-ekko-500/50 disabled:cursor-not-allowed disabled:opacity-50 pl-10 pr-10 ${errors.password ? 'border-red-500/50' : 'border-neutral-800'}`}
                                                    />
                                                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500 group-focus-within:text-ekko-400 transition-colors" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-3.5 text-neutral-500 hover:text-white transition-colors focus:outline-none"
                                                    >
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative group rounded-none overflow-hidden">
                                        <RetroGrid className="z-0 opacity-50" />
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-white text-black hover:bg-neutral-200 transition-colors h-11 font-semibold"
                                        >
                                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            {loginMethod === 'password' ? 'Sign In' : 'Send Code'}
                                        </Button>
                                        <BorderBeam size={40} duration={4} delay={9} />
                                    </div>

                                    <div className="text-center">
                                        <button
                                            type="button"
                                            onClick={() => setLoginMethod(loginMethod === 'password' ? 'otp' : 'password')}
                                            className="text-sm text-neutral-400 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
                                        >
                                            {loginMethod === 'password' ? (
                                                <><Key className="w-4 h-4" /> Sign in with code</>
                                            ) : (
                                                <><Lock className="w-4 h-4" /> Use password instead</>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                <p className="text-center text-sm text-neutral-400 pt-2">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/signup" className="font-medium text-white hover:underline underline-offset-4 decoration-ekko-500 decoration-2 transition-all">
                                        Sign up
                                    </Link>
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="otp-verify"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8 relative z-10"
                            >
                                <div className="text-center">
                                    <div className="mx-auto w-14 h-14 rounded-none bg-ekko-500/10 border border-ekko-500/20 flex items-center justify-center mb-4">
                                        <Mail className="w-6 h-6 text-ekko-400" />
                                    </div>
                                    <h2 className="text-3xl font-bold tracking-tight text-white">Verify Code</h2>
                                    <p className="mt-2 text-neutral-400">
                                        Sent to <span className="text-white font-medium">{userEmail}</span>
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-center gap-2">
                                        {otpValues.map((value, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => { inputRefs.current[index] = el; }}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={value}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                onPaste={index === 0 ? handleOtpPaste : undefined}
                                                className="w-11 h-13 text-center text-xl font-bold bg-white/5 border border-white/10 rounded-none text-white focus:outline-none focus:border-ekko-500 focus:ring-2 focus:ring-ekko-500/20 transition-all placeholder:text-neutral-700"
                                                placeholder="·"
                                                autoFocus={index === 0}
                                            />
                                        ))}
                                    </div>

                                    <div className="relative overflow-hidden rounded-none">
                                        <Button
                                            onClick={verifyOtp}
                                            disabled={loading || otpValues.some(v => !v)}
                                            className="w-full h-11 bg-white text-black hover:bg-neutral-200 font-bold transition-all duration-300"
                                        >
                                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                            Verify &amp; Sign In
                                        </Button>
                                        <BorderBeam size={40} duration={4} delay={9} />
                                    </div>

                                    <div className="text-center space-y-4">
                                        <p className="text-xs text-neutral-500">
                                            {resendCooldown > 0 ? (
                                                `Resend in ${resendCooldown}s`
                                            ) : (
                                                <button onClick={resendCode} className="text-ekko-400 hover:text-ekko-300 transition-colors">
                                                    Resend code
                                                </button>
                                            )}
                                        </p>
                                        <button
                                            onClick={() => setOtpStep('send')}
                                            className="text-xs text-neutral-500 hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto"
                                        >
                                            <ArrowLeft className="w-3 h-3" /> Use a different email
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </MagicCard>
            </div>
        </div>
    );
}
