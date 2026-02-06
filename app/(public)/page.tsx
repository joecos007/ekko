import Link from "next/link";
// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function LandingPage() {
    return (
        <div className="relative isolate min-h-screen flex flex-col font-geist-sans bg-black">
            {/* Hero Content */}
            <section className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4 text-center overflow-hidden">
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

                <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                    <Badge className="px-4 py-1.5 text-sm bg-primary/10 text-primary border-primary/20 backdrop-blur-md">
                        v1.0 Public Beta is Live
                    </Badge>
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent drop-shadow-2xl">
                        Music for the <span className="text-primary glow-text">Soul</span>.
                    </h1>
                    <p className="text-xl md:text-2xl text-neutral-300 max-w-2xl mx-auto drop-shadow-md">
                        Experience audio reimagined. A world of sound, community, and harmony awaits you.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                        <Link href="/signup">
                            <Button size="lg" className="h-14 px-10 text-lg bg-primary hover:bg-primary/90 text-black font-bold rounded-full shadow-[0_0_30px_rgba(20,241,149,0.4)] hover:shadow-[0_0_50px_rgba(20,241,149,0.6)] hover:scale-105 transition-all">
                                Start Listening Free
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white hover:border-white/50 backdrop-blur-sm transition-all">
                                Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Feature Highlights with Community Image */}
            <section className="py-32 px-4 bg-neutral-950 relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 group order-2 md:order-1">
                        <Image
                            src="/community-connect.png"
                            alt="Community Connect"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                    <div className="space-y-8 order-1 md:order-2">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">Connect Through Sound</h2>
                        <p className="text-xl text-neutral-400 leading-relaxed">
                            Join a village of listeners. Share playlists, discover hidden gems, and experience music together in our virtual town square.
                        </p>
                        <ul className="space-y-4">
                            {[
                                'Real-time immersive listening sessions',
                                'Collaborative playlists tailored to your mood',
                                'Artist community events and live streams'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 text-lg text-neutral-300">
                                    <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_10px_rgba(20,241,149,0.5)]" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
