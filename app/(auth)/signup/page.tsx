'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, Mail, Lock, User, Eye, EyeOff, Shield, Clock, LayoutTemplate, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { EkkoLogo } from '@/components/brand/ekko-logo';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MagicCard } from '@/components/ui/magic-card';
import { RetroGrid } from '@/components/ui/retro-grid';
import { DotPattern } from '@/components/ui/dot-pattern';
import { BorderBeam } from '@/components/ui/border-beam';
import { motion, AnimatePresence } from 'framer-motion';

const signupSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    acceptTerms: z.boolean().refine((val) => val === true, { message: 'You must accept the terms' }),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const supabase = createClient()
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // OTP verification state
    const [step, setStep] = useState<'form' | 'verify'>('form');
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
        defaultValues: { acceptTerms: false as any },
    });

    // Cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const onSubmit = async (data: SignupForm) => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
                data: { full_name: data.fullName },
            },
        });

        if (error) {
            if (error.status === 429) {
                toast.error('Email rate limit reached. Please wait an hour before trying again.');
            } else {
                toast.error(error.message);
            }
        } else {
            setUserEmail(data.email);
            setStep('verify');
            setResendCooldown(60);
            toast.success('Verification code sent!', {
                description: `Check your inbox at ${data.email}`,
            });
        }
        setLoading(false);
    };

    const handleOtpChange = useCallback((index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newValues = [...otpValues];
        newValues[index] = value.slice(-1);
        setOtpValues(newValues);

        // Auto-advance to next input
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

        setVerifyingOtp(true);
        const { error } = await supabase.auth.verifyOtp({
            email: userEmail,
            token: code,
            type: 'signup',
        });

        if (error) {
            toast.error(error.message || 'Invalid code. Please try again.');
            setOtpValues(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } else {
            toast.success('Account verified! Welcome to EKKO.');
            router.push('/home');
        }
        setVerifyingOtp(false);
    };

    const resendCode = async () => {
        if (resendCooldown > 0) return;
        setResendCooldown(60);

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: userEmail,
        });

        if (error) {
            if (error.status === 429) {
                toast.error('Rate limit reached. Please wait before resending.');
            } else {
                toast.error(error.message);
            }
        } else {
            toast.success('New code sent!');
        }
    };

    // Auto-submit when all 6 digits are entered
    useEffect(() => {
        if (otpValues.every(v => v !== '') && step === 'verify') {
            verifyOtp();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otpValues, step]);

    return (
        <div className="min-h-[100dvh] bg-black text-white antialiased selection:bg-white/20 selection:text-white flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
            {/* Background with gradients */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-ekko-500/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-ekko-700/20 rounded-full blur-[150px]" />
            </div>

            {/* Main Card */}
            <MagicCard
                className="relative z-10 w-full max-w-md md:max-w-2xl lg:max-w-[800px] xl:max-w-[900px] border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl shadow-black/40 p-0 overflow-hidden"
                gradientColor="#262626"
                gradientFrom="#6366f1"
                gradientTo="#14F195"
                gradientSize={300}
                gradientOpacity={0.2}
            >
                <div className="relative flex flex-col md:flex-row h-full">
                    {/* Left Side - Visual */}
                    <div className="relative w-full md:w-1/2 h-48 md:h-auto min-h-[200px] md:min-h-[400px] overflow-hidden bg-neutral-900/50">
                        <div className="absolute inset-0">
                            <Image
                                src="/auth.png"
                                alt="Music visualization"
                                width={800}
                                height={800}
                                className="object-cover w-full h-full opacity-80 hover:opacity-100 transition-opacity duration-700"
                                priority
                            />
                            <RetroGrid className="z-0 opacity-50" />
                            <DotPattern
                                width={32}
                                height={32}
                                cx={2}
                                cy={2}
                                cr={2}
                                className="absolute inset-0 h-full w-full opacity-20 z-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-none border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-md">
                            <div className="flex items-center gap-2 text-[10px] text-white/75 font-medium">
                                <LayoutTemplate className="h-3 w-3" />
                                <span>Early Access</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form / OTP */}
                    <div className="p-8 md:p-10 w-full md:w-1/2 bg-black/20">
                        <div className="mb-8 flex items-center justify-between">
                            <Link href="/">
                                <EkkoLogo size="sm" />
                            </Link>
                            {step === 'verify' && (
                                <button
                                    onClick={() => { setStep('form'); setOtpValues(['', '', '', '', '', '']); }}
                                    className="text-xs text-neutral-500 hover:text-white transition-colors flex items-center gap-1"
                                >
                                    <ArrowLeft className="w-3 h-3" /> Back
                                </button>
                            )}
                        </div>

                        <AnimatePresence mode="wait">
                            {step === 'form' ? (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="mb-6">
                                        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Create Account</h1>
                                        <p className="text-sm text-neutral-400">Start your immersive music journey.</p>
                                    </div>

                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                        {/* Full Name */}
                                        <div className="space-y-1.5">
                                            <label htmlFor="name" className="block text-xs font-medium text-neutral-400 ml-1">Full Name</label>
                                            <div className={`group relative flex items-center rounded-none border bg-white/5 transition-all duration-300 hover:border-white/20 focus-within:border-ekko-500/50 focus-within:bg-white/[0.07] focus-within:ring-2 focus-within:ring-ekko-500/20 ${errors.fullName ? 'border-red-500/50' : 'border-white/10'}`}>
                                                <User className="ml-3 h-4 w-4 text-neutral-500 transition-colors group-focus-within:text-ekko-400" />
                                                <input
                                                    id="name"
                                                    type="text"
                                                    placeholder="John Doe"
                                                    {...register('fullName')}
                                                    className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none"
                                                />
                                            </div>
                                            {errors.fullName && <p className="text-xs text-red-400 ml-1">{errors.fullName.message}</p>}
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-1.5">
                                            <label htmlFor="email" className="block text-xs font-medium text-neutral-400 ml-1">Email</label>
                                            <div className={`group relative flex items-center rounded-none border bg-white/5 transition-all duration-300 hover:border-white/20 focus-within:border-ekko-500/50 focus-within:bg-white/[0.07] focus-within:ring-2 focus-within:ring-ekko-500/20 ${errors.email ? 'border-red-500/50' : 'border-white/10'}`}>
                                                <Mail className="ml-3 h-4 w-4 text-neutral-500 transition-colors group-focus-within:text-ekko-400" />
                                                <input
                                                    id="email"
                                                    type="email"
                                                    placeholder="you@domain.com"
                                                    {...register('email')}
                                                    className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none"
                                                />
                                            </div>
                                            {errors.email && <p className="text-xs text-red-400 ml-1">{errors.email.message}</p>}
                                        </div>

                                        {/* Password */}
                                        <div className="space-y-1.5">
                                            <label htmlFor="password" className="block text-xs font-medium text-neutral-400 ml-1">Password</label>
                                            <div className={`group relative flex items-center rounded-none border bg-white/5 transition-all duration-300 hover:border-white/20 focus-within:border-ekko-500/50 focus-within:bg-white/[0.07] focus-within:ring-2 focus-within:ring-ekko-500/20 ${errors.password ? 'border-red-500/50' : 'border-white/10'}`}>
                                                <Lock className="ml-3 h-4 w-4 text-neutral-500 transition-colors group-focus-within:text-ekko-400" />
                                                <input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    {...register('password')}
                                                    className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="mr-3 text-neutral-500 hover:text-white transition-colors focus:outline-none"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            {errors.password && <p className="text-xs text-red-400 ml-1">{errors.password.message}</p>}
                                        </div>

                                        {/* Terms Checkbox */}
                                        <div className="flex items-start gap-3 pt-2">
                                            <div className="relative flex items-center">
                                                <input
                                                    id="terms"
                                                    type="checkbox"
                                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded-none border border-white/10 bg-white/5 checked:border-ekko-500 checked:bg-ekko-500 transition-all"
                                                    {...register('acceptTerms')}
                                                />
                                                <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>
                                            <div>
                                                <label htmlFor="terms" className="text-xs text-neutral-400 leading-tight">
                                                    I agree to the <Link href="/legal/terms" className="text-white hover:text-ekko-400 transition-colors">Terms of Service</Link> and <Link href="/legal/privacy" className="text-white hover:text-ekko-400 transition-colors">Privacy Policy</Link>
                                                </label>
                                                {errors.acceptTerms && <p className="text-xs text-red-400 mt-0.5">{errors.acceptTerms.message}</p>}
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="grid gap-4 pt-2 group relative overflow-hidden rounded-none">
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                                className="relative w-full h-11 bg-gradient-to-r from-ekko-500 to-ekko-300 hover:from-ekko-400 hover:to-ekko-200 text-black font-bold shadow-[0_0_20px_-5px_rgba(99,102,241,0.35)] hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.5)] transition-all duration-300 hover:scale-[1.02]"
                                            >
                                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                Create Account
                                            </Button>
                                            <BorderBeam size={40} duration={4} delay={9} />
                                        </div>

                                        <p className="text-center text-xs text-neutral-500">
                                            Already have an account? <Link href="/login" className="text-primary hover:text-ekko-400 transition-colors font-medium">Sign in</Link>
                                        </p>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="verify"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    {/* OTP Verification */}
                                    <div className="text-center space-y-2">
                                        <div className="mx-auto w-14 h-14 rounded-none bg-ekko-500/10 border border-ekko-500/20 flex items-center justify-center mb-4">
                                            <Mail className="w-6 h-6 text-ekko-400" />
                                        </div>
                                        <h1 className="text-2xl font-bold tracking-tight text-white">Verify your email</h1>
                                        <p className="text-sm text-neutral-400">
                                            We sent a 6-digit code to<br />
                                            <span className="text-white font-medium">{userEmail}</span>
                                        </p>
                                    </div>

                                    {/* OTP Input Fields */}
                                    <div className="flex justify-center gap-2 sm:gap-3">
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
                                                className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold bg-white/5 border border-white/10 rounded-none text-white focus:outline-none focus:border-ekko-500 focus:ring-2 focus:ring-ekko-500/20 transition-all placeholder:text-neutral-700"
                                                placeholder="·"
                                                autoFocus={index === 0}
                                            />
                                        ))}
                                    </div>

                                    {/* Verify Button */}
                                    <div className="relative overflow-hidden rounded-none">
                                        <Button
                                            onClick={verifyOtp}
                                            disabled={verifyingOtp || otpValues.some(v => !v)}
                                            className="w-full h-11 bg-gradient-to-r from-ekko-500 to-ekko-300 hover:from-ekko-400 hover:to-ekko-200 text-black font-bold transition-all duration-300"
                                        >
                                            {verifyingOtp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
                                            Verify &amp; Continue
                                        </Button>
                                        <BorderBeam size={40} duration={4} delay={9} />
                                    </div>

                                    {/* Resend */}
                                    <div className="text-center">
                                        <p className="text-xs text-neutral-500">
                                            Didn&apos;t receive the code?{' '}
                                            {resendCooldown > 0 ? (
                                                <span className="text-neutral-600">Resend in {resendCooldown}s</span>
                                            ) : (
                                                <button
                                                    onClick={resendCode}
                                                    className="text-ekko-400 hover:text-ekko-300 transition-colors font-medium"
                                                >
                                                    Resend code
                                                </button>
                                            )}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Bottom Footer Area */}
                <div className="flex items-center justify-between border-t border-white/5 bg-black/20 px-6 py-3 text-[10px] text-white/30 uppercase tracking-wider font-medium">
                    <div className="flex items-center gap-2">
                        <Shield className="h-3 w-3" />
                        <span>Secure Registration</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        <span>Instant Access</span>
                    </div>
                </div>
            </MagicCard>
        </div>
    );
}
