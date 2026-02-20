'use client';

import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Lock, Eye, EyeOff, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { EkkoLogo } from '@/components/brand/ekko-logo';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MagicCard } from '@/components/ui/magic-card';
import { BorderBeam } from '@/components/ui/border-beam';
import { motion, AnimatePresence } from 'motion/react';

const resetSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetForm = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
    const supabase = createClient()
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);

    // Ensure session is available (Supabase sets it from the code exchange)
    useEffect(() => {
        const checkSession = async () => {
            try {
                const supabaseClient = createClient();
                const { data: { session } } = await supabaseClient.auth.getSession();

                // Check if we have a session and if it's a recovery session
                const isRecovery = session?.user?.amr?.some((m: any) => m.method === 'recovery' || m === 'recovery');

                if (!session || !isRecovery) {
                    toast.error('Please use the password reset link sent to your email.');
                    router.push('/forgot-password');
                }
            } catch (err: unknown) {
                if (err instanceof Error && err.name === 'AbortError') return;
                router.push('/forgot-password');
            }
        };
        checkSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { register, handleSubmit, formState: { errors } } = useForm<ResetForm>({
        resolver: zodResolver(resetSchema),
    });

    const onSubmit = async (data: ResetForm) => {
        setLoading(true);
        const { error } = await supabase.auth.updateUser({
            password: data.password,
        });

        if (error) {
            toast.error(error.message);
        } else {
            setSuccess(true);
            toast.success('Password updated successfully!');
            setTimeout(() => router.push('/home'), 3000);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[100dvh] bg-black text-white antialiased selection:bg-white/20 selection:text-white flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-ekko-500/15 rounded-none blur-[150px]" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-ekko-700/15 rounded-none blur-[150px]" />
            </div>

            <MagicCard
                className="relative z-10 w-full max-w-md border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl shadow-black/40 p-0 overflow-hidden"
                gradientColor="#262626"
                gradientFrom="#6366f1"
                gradientTo="#14F195"
                gradientSize={300}
                gradientOpacity={0.2}
            >
                <div className="p-8 md:p-10">
                    <div className="mb-8 flex justify-center">
                        <Link href="/">
                            <EkkoLogo size="sm" />
                        </Link>
                    </div>

                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6 py-4"
                            >
                                <div className="mx-auto w-16 h-16 rounded-none bg-ekko-500/10 border border-ekko-500/20 flex items-center justify-center">
                                    <CheckCircle2 className="w-8 h-8 text-ekko-400" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white mb-2">Password Reset</h1>
                                    <p className="text-sm text-neutral-400">
                                        Your password has been changed successfully.<br />
                                        Redirecting you to home...
                                    </p>
                                </div>
                                <Button
                                    asChild
                                    className="bg-white text-black hover:bg-neutral-200"
                                >
                                    <Link href="/home">Go to Dashboard</Link>
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Create New Password</h1>
                                    <p className="text-sm text-neutral-400">Please choose a strong password you haven&apos;t used before.</p>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    {/* Password */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="password" className="block text-xs font-medium text-neutral-400 ml-1">New Password</label>
                                        <div className={`group relative flex items-center rounded-none border bg-white/5 transition-all duration-300 hover:border-white/20 focus-within:border-ekko-500/50 focus-within:bg-white/[0.07] ${errors.password ? 'border-red-500/50' : 'border-white/10'}`}>
                                            <Lock className="ml-3 h-4 w-4 text-neutral-500 group-focus-within:text-ekko-400" />
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

                                    {/* Confirm Password */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="confirmPassword" className="block text-xs font-medium text-neutral-400 ml-1">Confirm Password</label>
                                        <div className={`group relative flex items-center rounded-none border bg-white/5 transition-all duration-300 hover:border-white/20 focus-within:border-ekko-500/50 focus-within:bg-white/[0.07] ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'}`}>
                                            <Lock className="ml-3 h-4 w-4 text-neutral-500 group-focus-within:text-ekko-400" />
                                            <input
                                                id="confirmPassword"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                {...register('confirmPassword')}
                                                className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none"
                                            />
                                        </div>
                                        {errors.confirmPassword && <p className="text-xs text-red-400 ml-1">{errors.confirmPassword.message}</p>}
                                    </div>

                                    <div className="relative overflow-hidden pt-2">
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-11 bg-gradient-to-r from-ekko-500 to-ekko-300 hover:from-ekko-400 hover:to-ekko-200 text-black font-bold transition-all duration-300"
                                        >
                                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                                            Update Password
                                        </Button>
                                        <BorderBeam size={40} duration={4} />
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="border-t border-white/5 bg-black/20 px-6 py-3 text-[10px] text-white/30 uppercase tracking-wider font-medium flex items-center gap-2">
                    <Shield className="h-3 w-3" />
                    <span>Encrypted Connection Secure</span>
                </div>
            </MagicCard>
        </div>
    );
}
