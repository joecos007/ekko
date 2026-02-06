import Link from "next/link";
// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Music, Headphones, Users, Radio, Zap, Heart, Sparkles, Star, Play, Volume2 } from "lucide-react";

const features = [
    {
        icon: Headphones,
        title: "HD Audio Quality",
        description: "Crystal-clear sound with lossless audio streaming up to 24-bit/192kHz.",
        color: "from-purple-500 to-pink-500"
    },
    {
        icon: Users,
        title: "Social Listening",
        description: "Share sessions with friends and discover music together in real-time.",
        color: "from-blue-500 to-cyan-500"
    },
    {
        icon: Radio,
        title: "Smart Radio",
        description: "AI-powered playlists that learn your taste and mood preferences.",
        color: "from-orange-500 to-red-500"
    },
    {
        icon: Zap,
        title: "Instant Sync",
        description: "Seamless playback across all your devices with zero latency.",
        color: "from-green-500 to-emerald-500"
    },
];

const testimonials = [
    {
        name: "Sarah Chen",
        role: "Music Producer",
        avatar: "SC",
        quote: "EKKO has completely transformed how I discover new music. The audio quality is unmatched.",
        rating: 5
    },
    {
        name: "Marcus Johnson",
        role: "DJ & Artist",
        avatar: "MJ",
        quote: "The collaborative playlists feature is a game-changer for my creative process.",
        rating: 5
    },
    {
        name: "Elena Rodriguez",
        role: "Music Enthusiast",
        avatar: "ER",
        quote: "Finally, a platform that treats audio quality as a priority. Love the community features!",
        rating: 5
    },
];

const steps = [
    {
        number: "01",
        title: "Create Your Account",
        description: "Sign up in seconds with email or social login. No credit card required.",
        icon: Sparkles
    },
    {
        number: "02",
        title: "Discover Your Sound",
        description: "Explore millions of tracks, curated playlists, and personalized recommendations.",
        icon: Music
    },
    {
        number: "03",
        title: "Connect & Enjoy",
        description: "Stream anywhere, share with friends, and immerse yourself in pure audio bliss.",
        icon: Heart
    },
];

export default function LandingPage() {
    return (
        <div className="relative isolate min-h-screen flex flex-col font-geist-sans bg-black overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDelay: "3s" }} />
            </div>

            {/* Hero Content */}
            <section className="relative z-10 flex flex-col items-center justify-center min-h-[100vh] px-4 text-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/hero-main.png"
                        alt="Valley of Harmony"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
                </div>

                {/* Sound wave decoration - Simplified */}
                <div className="absolute bottom-0 left-0 right-0 h-24 flex items-end justify-center gap-1 opacity-10">
                    {Array.from({ length: 40 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-1 bg-primary/50 rounded-full animate-pulse"
                            style={{
                                height: `${Math.sin(i * 0.3) * 40 + 50}%`,
                                animationDelay: `${i * 0.05}s`,
                                animationDuration: `${2 + Math.random()}s`
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                    <Badge className="px-4 py-1.5 text-xs bg-primary/10 text-primary border-primary/20 backdrop-blur-md animate-float">
                        🎵 v1.0 Public Beta is Live
                    </Badge>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
                        <span className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent drop-shadow-2xl">
                            Music for the{" "}
                        </span>
                        <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent glow-text animate-gradient">
                            Soul
                        </span>
                        <span className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-300 max-w-xl mx-auto drop-shadow-md leading-relaxed">
                        Experience audio reimagined. A world of sound, community, and harmony awaits you.
                    </p>

                    {/* Stats - Simplified */}
                    <div className="flex flex-wrap items-center justify-center gap-8 pt-2 text-neutral-400 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-white font-bold">10K+</span> Songs
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-white font-bold">5K+</span> Artists
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-white font-bold">100 Pesos</span> per month
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                        <Link href="/signup">
                            <Button size="lg" className="h-12 px-8 text-base bg-primary hover:bg-primary/90 text-black font-bold rounded-full shadow-[0_0_20px_rgba(20,241,149,0.3)] hover:shadow-[0_0_30px_rgba(20,241,149,0.5)] hover:scale-105 transition-all group">
                                <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                Start Listening Free
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white hover:border-white/50 backdrop-blur-sm transition-all">
                                <Volume2 className="w-4 h-4 mr-2" />
                                Login
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                    <span className="text-xs text-neutral-500 uppercase tracking-widest">Scroll</span>
                    <div className="w-5 h-8 rounded-full border-2 border-neutral-700 flex items-start justify-center p-1">
                        <div className="w-1 h-2 bg-neutral-500 rounded-full animate-pulse" />
                    </div>
                </div>
            </section>

            {/* Feature Highlights with Community Image */}
            <section className="py-24 md:py-32 px-4 bg-neutral-950 relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 group order-2 md:order-1">
                        <Image
                            src="/community-connect.png"
                            alt="Community Connect"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30">
                                <Play className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-white font-medium">Live Session</p>
                                <p className="text-neutral-400 text-sm">234 listening now</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-8 order-1 md:order-2">
                        <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">Community</Badge>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">Connect Through Sound</h2>
                        <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
                            Join a village of listeners. Share playlists, discover hidden gems, and experience music together in our virtual town square.
                        </p>
                        <ul className="space-y-4">
                            {[
                                'Real-time immersive listening sessions',
                                'Collaborative playlists tailored to your mood',
                                'Artist community events and live streams'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-lg text-neutral-300">
                                    <div className="h-3 w-3 rounded-full bg-gradient-to-r from-primary to-purple-500 shadow-[0_0_10px_rgba(20,241,149,0.5)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 md:py-32 px-4 relative">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">Features</Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Everything You Need</h2>
                        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                            Packed with premium features designed to elevate your listening experience.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="group p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-neutral-400 text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 md:py-32 px-4 bg-gradient-to-b from-neutral-950 to-black relative">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-pink-500/10 text-pink-400 border-pink-500/20">Getting Started</Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
                        <p className="text-neutral-400 text-lg">Start your musical journey in three simple steps.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, i) => (
                            <div key={i} className="relative text-center group">
                                <div className="relative inline-flex mb-6">
                                    <span className="absolute -top-2 -right-2 text-6xl font-black text-neutral-900 group-hover:text-neutral-800 transition-colors">
                                        {step.number}
                                    </span>
                                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                                        <step.icon className="w-8 h-8 text-primary" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                                <p className="text-neutral-400">{step.description}</p>
                                {i < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-neutral-800 to-transparent" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 md:py-32 px-4 relative">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <Badge className="mb-4 bg-orange-500/10 text-orange-400 border-orange-500/20">Testimonials</Badge>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Loved by Music Lovers</h2>
                        <p className="text-neutral-400 text-lg">See what our community has to say about EKKO.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm hover:border-neutral-700 transition-all"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-black font-bold">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{testimonial.name}</h4>
                                        <p className="text-neutral-500 text-sm">{testimonial.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-3">
                                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                                        <Star key={j} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                    ))}
                                </div>
                                <p className="text-neutral-300 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 md:py-32 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10" />
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[150px]" />
                </div>
                <div className="relative max-w-3xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Ready to <span className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">Transform</span> Your Listening?
                    </h2>
                    <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-xl mx-auto">
                        Join thousands of music lovers who&apos;ve already made the switch. Start streaming for free today.
                    </p>
                    <Link href="/signup">
                        <Button size="lg" className="h-16 px-12 text-xl bg-white hover:bg-neutral-100 text-black font-bold rounded-full shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 transition-all">
                            Get Started — It&apos;s Free
                        </Button>
                    </Link>
                    <p className="mt-4 text-neutral-500 text-sm">No credit card required • Cancel anytime</p>
                </div>
            </section>
        </div>
    );
}
