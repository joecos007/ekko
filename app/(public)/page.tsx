import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Music, Headphones, Users, Radio, Zap, Heart, Sparkles, Star, Play, ArrowRight, Disc } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col font-geist-sans bg-[#050505] text-white overflow-x-hidden selection:bg-[#14F195] selection:text-black">

            {/* Navigation Bar - Minimalist */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#050505]/90 backdrop-blur-md h-16 flex items-center justify-between px-6 lg:px-12 bg-black">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#14F195]" />
                    <span className="font-bold tracking-widest text-lg">EKKO</span>
                </div>
                <div className="flex items-center gap-4 md:gap-8">
                    <Link href="/login" className="text-sm text-neutral-400 hover:text-white transition-colors uppercase tracking-widest text-[10px] hidden md:block">
                        Login
                    </Link>
                    <Link href="/signup">
                        <Button className="rounded-none bg-white hover:bg-neutral-200 text-black font-bold h-9 px-4 md:px-6 uppercase tracking-widest text-[10px] transition-all hover:translate-x-1 hover:-translate-y-1">
                            Get Access
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-16 min-h-screen flex flex-col lg:flex-row border-b border-white/10">
                {/* Left Content */}
                <div className="flex-1 flex flex-col justify-center px-6 lg:px-12 py-12 lg:py-20 relative border-r border-white/10 z-10 bg-[#050505]">
                    <div className="absolute top-0 left-0 p-4 border-b border-r border-white/10 hidden lg:block">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">System v1.0</span>
                    </div>

                    <div className="space-y-6 md:space-y-8 max-w-2xl relative">
                        <div className="inline-flex items-center gap-2 border border-[#14F195] px-3 py-1 text-[#14F195] text-[10px] uppercase tracking-widest mb-2 w-fit">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14F195] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14F195]"></span>
                            </span>
                            Live Beta Access
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9]">
                            FUTURE <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">AUDIO</span> <br />
                            STREAM.
                        </h1>

                        <p className="text-neutral-400 text-base md:text-lg max-w-md leading-relaxed">
                            High-fidelity AI-driven music streaming. Precision engineered for the audiophile of tomorrow.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 md:pt-8 w-full sm:w-auto">
                            <Link href="/signup" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto rounded-none h-12 md:h-14 px-8 text-base bg-[#14F195] hover:bg-[#10c479] text-black font-bold uppercase tracking-widest transition-all hover:translate-x-1 hover:-translate-y-1 border border-[#14F195]">
                                    Initialize ///
                                </Button>
                            </Link>
                            <Link href="/about" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto rounded-none h-12 md:h-14 px-8 text-base border-neutral-700 hover:bg-white hover:text-black hover:border-white text-white font-bold uppercase tracking-widest transition-all">
                                    Read Manifesto
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Visual - Image Fix */}
                <div className="h-[40vh] lg:h-auto lg:w-[45%] relative bg-neutral-900 border-l border-white/5 overflow-hidden group">
                    <Image
                        src="/hero-main.png"
                        alt="Hero"
                        fill
                        className="object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000"
                        priority
                    />
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent lg:bg-gradient-to-l" />

                    {/* Stats Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 border-t border-white/10 bg-black/80 backdrop-blur-sm grid grid-cols-2 gap-4">
                        <div>
                            <span className="block text-xl md:text-2xl font-bold text-white">24/192</span>
                            <span className="text-[10px] uppercase tracking-widest text-neutral-500">kHz Resolution</span>
                        </div>
                        <div className="text-right">
                            <span className="block text-xl md:text-2xl font-bold text-[#14F195]">0.01ms</span>
                            <span className="text-[10px] uppercase tracking-widest text-neutral-500">Latency</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Marquee Separator */}
            <div className="border-b border-white/10 py-3 overflow-hidden bg-white text-black">
                <div className="flex whitespace-nowrap animate-marquee gap-8 items-center cursor-default select-none">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-8">
                            <span className="text-sm font-bold uppercase tracking-widest">Next Gen Audio</span>
                            <Disc className="w-4 h-4 animate-spin-slow" />
                            <span className="text-sm font-bold uppercase tracking-widest">Community Driven</span>
                            <Disc className="w-4 h-4 animate-spin-slow" />
                            <span className="text-sm font-bold uppercase tracking-widest">AI Powered</span>
                            <Disc className="w-4 h-4 animate-spin-slow" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Grid - Strict Lines */}
            <section className="border-b border-white/10">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
                    {[
                        { icon: Headphones, title: "LOSSLESS KERNEL", desc: "Bit-perfect streaming engine." },
                        { icon: Users, title: "HIVE MIND", desc: "Real-time social synchronization." },
                        { icon: Radio, title: "NEURAL RADIO", desc: "Adaptive algorithmic curation." },
                        { icon: Zap, title: "ZERO LATENCY", desc: "Instantaneous network response." }
                    ].map((feature, i) => (
                        <div key={i} className="group p-8 lg:p-12 hover:bg-neutral-900/50 transition-colors relative overflow-hidden">
                            <div className="absolute top-4 right-4 text-[10px] text-neutral-700 font-mono">0{i + 1}</div>
                            <feature.icon className="w-8 h-8 text-[#14F195] mb-6 group-hover:scale-110 transition-transform duration-300" />
                            <h3 className="text-lg font-bold mb-2 uppercase tracking-wide">{feature.title}</h3>
                            <p className="text-sm text-neutral-400 font-mono leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Community Section - Cyberpunk / Manila Vibe */}
            <section className="flex flex-col lg:flex-row min-h-[80vh] border-b border-white/10 bg-[#050505]">
                {/* Image Side - Fixed size/fit */}
                <div className="relative w-full lg:w-1/2 min-h-[40vh] lg:min-h-full border-b lg:border-b-0 lg:border-r border-white/10 group overflow-hidden order-2 lg:order-1">
                    <Image
                        src="/digital-village.png"
                        alt="Community"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Overlay Widget */}
                    <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-black/90 border border-white/20 p-6 backdrop-blur-md max-w-[280px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-300">Live Session</span>
                        </div>
                        <div className="font-bold text-2xl text-white tracking-tighter">EKKO_LIVE_RADIO</div>
                        <div className="text-[11px] text-neutral-400 mt-2 font-medium">
                            <span className="text-white font-bold">1,204 Listeners</span> <span className="mx-1">•</span> Active section
                        </div>

                    </div>
                </div>

                {/* Content Side */}
                <div className="relative w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-24 bg-[#050505] order-1 lg:order-2">
                    <div className="absolute top-0 right-0 p-4 hidden lg:block">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 rotate-90 origin-top-right block translate-y-8">Connect</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-8 leading-none">
                        DIGITAL <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14F195] to-emerald-600">VILLAGE</span>
                    </h2>

                    <p className="text-base md:text-lg text-neutral-400 mb-8 md:mb-12 max-w-md leading-relaxed">
                        Join the global network. Share frequencies, discover hidden gems, and sync with the collective.
                    </p>

                    <div className="space-y-4">
                        {[
                            "IMMERSIVE AUDIO ROOMS",
                            "COLLABORATIVE SEQUENCING",
                            "VIRTUAL LISTENING PARTIES"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 border-b border-white/10 pb-4 group cursor-pointer hover:border-[#14F195] transition-colors">
                                <ArrowRight className="w-5 h-5 text-neutral-600 group-hover:text-[#14F195] -translate-x-2 group-hover:translate-x-0 transition-all" />
                                <span className="font-mono text-xs md:text-sm tracking-widest">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials - Terminal Style */}
            <section className="py-16 md:py-24 px-6 border-b border-white/10 bg-neutral-950/50">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-end justify-between mb-8 md:mb-12 border-b border-white/10 pb-4">
                        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight">User Logs</h2>
                        <span className="font-mono text-xs text-neutral-500 hidden md:inline">/var/logs/reviews.txt</span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                        {[
                            { name: "SARAH", role: "PRODUCER", text: "Latency is non-existent. The fidelity matches my studio monitors." },
                            { name: "MARCUS", role: "ARTIST", text: "The collaborative playlists are revolutionary. It's truly a hive mind." },
                            { name: "ELENA", role: "LISTENER", text: "Finally, a platform that respects the audio spectrum. Pure bliss." }
                        ].map((log, i) => (
                            <div key={i} className="border border-white/10 p-6 bg-black hover:border-[#14F195]/50 transition-colors shadow-2xl">
                                <div className="flex items-center justify-between mb-4 text-[10px] font-mono text-neutral-500">
                                    <span>UID: {log.name}</span>
                                    <span>ROLE: {log.role}</span>
                                </div>
                                <p className="text-neutral-300 font-mono text-sm leading-relaxed mb-4">
                                    &gt; "{log.text}"
                                </p>
                                <div className="flex gap-1">
                                    {Array.from({ length: 5 }).map((_, j) => (
                                        <div key={j} className="w-1 h-1 bg-[#14F195]" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* Footer - Minimal */}
            <footer className="py-12 px-6 lg:px-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#14F195]" />
                    <span className="font-bold tracking-widest text-lg">EKKO</span>
                </div>

                <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[10px] uppercase tracking-widest text-neutral-500">
                    <Link href="#" className="hover:text-white transition-colors">Privacy Protocol</Link>
                    <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    <Link href="#" className="hover:text-white transition-colors">System Status</Link>
                </div>

                <div className="font-mono text-[10px] text-neutral-600 text-center md:text-right">
                    © 2026 EKKO SYSTEMS. ALL RIGHTS RESERVED.
                </div>
            </footer>
        </div>
    );
}
