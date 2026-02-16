"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { VelocityScroll } from "@/components/ui/velocity-scroll";
import { Users, Radio, Zap, Disc, Mic2, Globe, Sparkles, ArrowRight } from "lucide-react";
import { AuroraBackground } from "@/components/auth/aurora-background";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Magic UI Components

import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { BorderBeam } from "@/components/ui/border-beam";
import { Particles } from "@/components/ui/particles";
import { Marquee } from "@/components/ui/marquee";
import { PremiumButton } from "@/components/ui/premium-button";
import { GlassButton } from "@/components/ui/glass-button";

const aiKeywords = [
    "Generative Audio",
    "Neural Synthesis",
    "Sonic Intelligence",
    "Infinite Soundscapes",
    "Algorithmic Rhythm",
    "Deep Learning Beats",
    "Creative AI",
    "Future of Sound",
];

export default function LandingPage() {
    return (
        <div className="min-h-[100dvh] flex flex-col font-geist-sans bg-black text-white overflow-x-hidden selection:bg-purple-500 selection:text-white">

            {/* Hero Section - Immersive Aurora */}
            <AuroraBackground className="h-[100dvh] !fixed inset-0 z-0">
                {/* Hero Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/hero-main.png"
                        alt="Hero Background"
                        fill
                        sizes="100vw"
                        className="object-cover opacity-50 mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 md:px-8 h-full pt-40 md:pt-48">
                    <div className="z-10 flex items-center justify-center mb-8">
                        <Link href="/platform" className={cn("group rounded-full border border-black/5 bg-neutral-100/10 text-base transition-all ease-in hover:cursor-pointer hover:bg-neutral-200/10 dark:border-white/5 dark:bg-neutral-900/10 dark:hover:bg-neutral-900/20")}>
                            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                                <span className="text-xs uppercase tracking-[0.2em] font-medium">✨ Create. Share. Connect.</span>
                                <ArrowRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                            </AnimatedShinyText>
                        </Link>
                    </div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter leading-none mb-6 text-white text-transparent bg-clip-text bg-gradient-to-b from-neutral-200 to-neutral-600"
                    >
                        Every Story <br />
                        Deserves a Song.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-neutral-200 text-base md:text-xl max-w-xl leading-relaxed mb-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
                    >
                        Turn your life&apos;s moments into melodies. Create with AI, share your journey, and find your rhythm in a community of dreamers.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <PremiumButton
                            href="/login"
                            icon={<Sparkles className="w-5 h-5" />}
                        >
                            Start Creating
                        </PremiumButton>
                        <GlassButton href="/about">
                            Our Story
                        </GlassButton>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-16 flex flex-col items-center gap-2"
                    >
                        <span className="text-[10px] uppercase tracking-widest text-neutral-500">Discover</span>
                        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
                    </motion.div>
                </div>

                <Particles
                    className="absolute inset-0 z-0"
                    quantity={100}
                    ease={80}
                    color="#ffffff"
                    refresh
                />
            </AuroraBackground>

            {/* Spacer for Fixed Hero */}
            <div className="h-[100dvh]" />

            {/* Content Container - Z-Index above Hero */}
            <div className="relative z-10 bg-black border-t border-white/10 shadow-2xl">

                {/* Stats Bar */}
                <div className="border-b border-white/10 py-8 bg-black">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: 10000, label: "Stories Told", suffix: "+" },
                            { value: 50000, label: "Songs Created", suffix: "+" },
                            { value: 99, label: "Vibes Shared", suffix: "%" },
                            { value: 24, label: "Inspiration", suffix: "/7" }
                        ].map((stat, i) => (
                            <div key={i}>
                                <div className="text-3xl md:text-4xl font-bold text-white mb-1 tabular-nums tracking-tighter">
                                    <NumberTicker value={stat.value} />{stat.suffix}
                                </div>
                                <div className="text-xs uppercase tracking-widest text-neutral-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Marquee */}
                <div className="border-y border-white/10 py-6 overflow-hidden bg-black/50 backdrop-blur-md">
                    <VelocityScroll defaultVelocity={2} className="font-bold uppercase tracking-widest text-sm md:text-base text-neutral-400">
                        <div className="flex items-center gap-12 mr-12">
                            <span className="flex items-center gap-4 text-white">
                                CREATE YOUR SOUND <Disc className="w-5 h-5 animate-spin-slow text-blue-500" />
                            </span>
                            <span className="flex items-center gap-4 text-white">
                                SHARE THE VIBE <Users className="w-5 h-5 text-purple-500" />
                            </span>
                            <span className="flex items-center gap-4 text-white">
                                AI POWERED CURATION <Sparkles className="w-5 h-5 text-pink-500" />
                            </span>
                        </div>
                    </VelocityScroll>
                </div>

                {/* Features - Bento Grid */}
                {/* Features - Bento Grid - Filipino Ghibli Style */}
                <section className="py-24 px-6 md:px-12 lg:px-24 border-b border-white/10 bg-black relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" />
                    <div className="max-w-7xl mx-auto mb-16 text-center relative z-10">
                        <div className="inline-block relative">
                            <div className="absolute -inset-4 bg-orange-500/10 blur-xl rounded-full" />
                            <h2 className="relative text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-200 to-yellow-400 drop-shadow-[0_2px_10px_rgba(251,146,60,0.5)] glow-text-orange transform hover:scale-105 transition-transform duration-500 cursor-default">
                                OUR RHYTHM
                            </h2>
                        </div>
                        <p className="text-neutral-300 max-w-2xl mx-auto text-lg font-medium drop-shadow-md">
                            From the heart of the islands to the soul of the world. <br />
                            <span className="italic text-orange-200/80">&quot;Dito ang simula.&quot; (It starts here.)</span>
                        </p>
                    </div>

                    <BentoGrid className="max-w-6xl mx-auto relative z-10">
                        <BentoCard
                            title="Likha (Creation)"
                            description="Turn your 'hugot' into melodies. Analyze emotion, generate lyrics, and compose music that speaks your truth."
                            header={<div className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-orange-900/20 to-neutral-900 border border-white/5 relative overflow-hidden group">
                                <Image
                                    src="/likha-ghibli.png"
                                    alt="Likha Studio"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 h-12 flex items-end gap-1 z-10">
                                    {[40, 70, 30, 80, 50, 90, 60, 40].map((h, i) => (
                                        <div key={i} className="flex-1 bg-orange-500/50 rounded-t-sm transition-all duration-300 group-hover:bg-orange-400" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                                <BorderBeam size={250} duration={12} delay={9} />
                            </div>}
                            icon={<Mic2 className="h-4 w-4 text-orange-400" />}
                            className="md:col-span-2 border-white/5 bg-neutral-900/80 backdrop-blur-sm hover:border-orange-500/30 transition-all group shadow-glow-orange"
                            href="/platform"
                        />
                        <BentoCard
                            title="Tambayan (Community)"
                            description="A digital sari-sari store of sounds. Hang out, share tracks, and listen to what the barangay is creating."
                            header={<div className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-yellow-900/20 to-neutral-900 border border-white/5 flex items-center justify-center group relative overflow-hidden">
                                <Image
                                    src="/tambayan-ghibli.png"
                                    alt="Tambayan Jeepney"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500 transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-yellow-500/10 mix-blend-overlay" />
                                <Users className="w-12 h-12 text-yellow-500/80 group-hover:text-yellow-400 transition-colors group-hover:scale-110 duration-300 relative z-10 drop-shadow-xl" />
                                <BorderBeam size={250} duration={12} delay={9} />
                            </div>}
                            icon={<Users className="h-4 w-4 text-yellow-400" />}
                            className="md:col-span-1 border-white/5 bg-neutral-900/80 backdrop-blur-sm hover:border-yellow-500/30 transition-all group"
                            href="/discover"
                        />
                        <BentoCard
                            title="Bayanihan (Collaboration)"
                            description="Lift each other up. Remix, collaborate, and build on the community's collective rhythm."
                            header={<div className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-red-900/20 to-neutral-900 border border-white/5 flex items-center justify-center group overflow-hidden relative">
                                <Image
                                    src="/bayanihan-ghibli.png"
                                    alt="Bayanihan Spirit"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500 transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay" />
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <div className="w-32 h-32 border border-red-500/20 rounded-full animate-ping opacity-20" />
                                </div>
                                <div className="flex -space-x-4 relative z-10">
                                    <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500/50 backdrop-blur-md" />
                                    <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/50 backdrop-blur-md" />
                                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/50 backdrop-blur-md" />
                                </div>
                                <BorderBeam size={250} duration={12} delay={9} />
                            </div>}
                            icon={<Globe className="h-4 w-4 text-red-400" />}
                            className="md:col-span-1 border-white/5 bg-neutral-900/80 backdrop-blur-sm hover:border-red-500/30 transition-all group"
                            href="/platform"
                        />
                        <BentoCard
                            title="Agos (Flow)"
                            description="Seamless streaming, like water flowing through the rice terraces. No interruptions, just pure vibe."
                            header={<div className="flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-cyan-900/20 to-neutral-900 border border-white/5 relative overflow-hidden group">
                                <Image
                                    src="/agos-ghibli.png"
                                    alt="Agos Flow"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500 transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-10" />
                                <div className="absolute inset-0 flex items-center justify-center font-mono text-cyan-400 font-bold text-xl drop-shadow-lg z-10">~ Flow ~</div>
                                <BorderBeam size={250} duration={12} delay={9} />
                            </div>}
                            icon={<Zap className="h-4 w-4 text-cyan-400" />}
                            className="md:col-span-2 border-white/5 bg-neutral-900/80 backdrop-blur-sm hover:border-cyan-500/30 transition-all group"
                            href="/live-radio"
                        />
                    </BentoGrid>
                </section>

                {/* Community / Digital Village Section - FIX: Contained Layout */}
                {/* Community / Global Collective Section */}
                <section className="py-24 px-6 md:px-12 lg:px-24 border-b border-white/10 bg-black/95 relative overflow-hidden">
                    <div className="absolute inset-0 bg-purple-900/5 blur-[120px] pointer-events-none" />

                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                        {/* Text Side */}
                        <div className="flex flex-col justify-center order-2 lg:order-1">
                            <BlurFade delay={0.25} inView>
                                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 bg-gradient-to-r from-white to-neutral-500 bg-clip-text text-transparent">
                                    JOIN THE <br /> COLLECTIVE
                                </h2>
                                <p className="text-neutral-400 text-lg mb-8 max-w-md leading-relaxed">
                                    A home for creators, dreamers, and listeners. Share your journey, discover hidden gems, and find your tribe in a world of pure sound.
                                </p>

                                <div className="space-y-4 mb-8">
                                    {[
                                        { title: "Collaborative Sessions", icon: Users },
                                        { title: "Global Feedback Loop", icon: Globe },
                                        { title: "Live Song Premieres", icon: Radio }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 group cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                                            <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <item.icon className="w-5 h-5 text-neutral-400 group-hover:text-purple-400 transition-colors" />
                                            </div>
                                            <span className="text-base font-medium tracking-wide group-hover:text-white transition-colors">{item.title}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link href="/login">
                                    <Button className="w-fit rounded-full px-8 h-12 bg-white text-black hover:bg-neutral-200 font-bold">
                                        Start Your Journey
                                    </Button>
                                </Link>
                            </BlurFade>
                        </div>

                        {/* Image Side - Visual Representation of Connection */}
                        <div className="relative h-[400px] lg:h-[500px] w-full rounded-2xl overflow-hidden border border-white/10 group order-1 lg:order-2 shadow-2xl">
                            <Image
                                src="/community-ghibli.png"
                                alt="Community Collective"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-pink-900/40 mix-blend-overlay" />
                            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />

                            {/* Animated Orbs representing users */}
                            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
                            <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />

                            <div className="absolute inset-0 flex items-center justify-center">
                                <Globe className="w-32 h-32 text-white/5 group-hover:text-white/10 transition-colors duration-700" />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                            {/* Overlay Card */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="bg-black/60 border border-white/10 backdrop-blur-xl p-5 rounded-xl">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-white/80">Trending Now</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">Manila Twilight</h3>
                                            <p className="text-xs text-neutral-300">New single by @kundiman_lofi</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-mono text-neutral-400 bg-black/40 px-2 py-1 rounded">
                                            <Users className="w-3 h-3" />
                                            12.5k
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Scrolling AI Keywords Strip */}
                <section className="py-10 border-y border-white/10 bg-black overflow-hidden relative z-10 text-white">
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />
                    <Marquee pauseOnHover className="[--duration:60s] [--gap:6rem]" style={{ gap: "6rem" }}>
                        {aiKeywords.map((keyword, i) => (
                            <div key={i} className="flex items-center gap-8 md:gap-16 group cursor-default">
                                <span className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-neutral-800 via-neutral-600 to-neutral-800 group-hover:from-white group-hover:via-neutral-200 group-hover:to-neutral-400 transition-all duration-700 select-none whitespace-nowrap">
                                    {keyword}
                                </span>
                                <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-blue-500/20 group-hover:text-blue-400 opacity-50 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
                            </div>
                        ))}
                    </Marquee>
                </section>
            </div>
        </div>
    );
}

