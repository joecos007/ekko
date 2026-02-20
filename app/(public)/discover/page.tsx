import { AuroraBackground } from "@/components/auth/aurora-background";
import { Search, Compass, Disc } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DiscoverPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 md:px-12 font-geist-sans selection:bg-ekko-500/30 selection:text-white">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <AuroraBackground className="opacity-20" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 border border-ekko-500/30 bg-ekko-500/10 px-3 py-1 text-ekko-400 text-[10px] uppercase tracking-widest mb-6 rounded-full">
                        <Search className="w-3 h-3" />
                        Beta Access
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 text-white uppercase">
                        Find Your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-ekko-400 to-ekko-600">Frequency</span>
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                        Explore a universe of sound generated in real-time. No two listening sessions are ever the same.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    <div className="col-span-1 md:col-span-2 relative h-[400px] rounded-none overflow-hidden border border-white/10 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Disc className="w-32 h-32 text-neutral-800 animate-spin-slow duration-[10s]" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
                            <h3 className="text-2xl font-bold mb-2">Smart Discovery</h3>
                            <p className="text-neutral-400">Our AI learns your taste profile by analyzing not just what you like, but when and how you listen.</p>
                        </div>
                    </div>

                    <div className="col-span-1 relative h-[400px] rounded-none overflow-hidden border border-white/10 bg-neutral-900/50 backdrop-blur-md p-8 flex flex-col justify-between">
                        <Compass className="w-12 h-12 text-white/20 mb-4" />
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Mood Matching</h3>
                            <p className="text-neutral-400">Select a vibe—&quot;Rainy Manila&quot;, &quot;Jeepney Commute&quot;, &quot;Midnight Coding&quot;—and let Ekko generate the soundtrack.</p>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <Link href="/login">
                        <Button className="h-14 px-10 rounded-full bg-white text-black hover:bg-neutral-200 text-lg font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all transform hover:scale-105">
                            Start Exploring
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
