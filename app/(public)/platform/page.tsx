import { AuroraBackground } from "@/components/auth/aurora-background";
import { Mic2, Zap, Globe, Cpu } from "lucide-react";

export default function PlatformPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 md:px-12 font-geist-sans selection:bg-ekko-500/30 selection:text-white">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <AuroraBackground className="opacity-20" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-24">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-transparent">
                        THE EKKO ENGINE
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                        Under the hood of the world&apos;s most advanced AI music platform. A symphony of neural networks, real-time streaming, and community intelligence.
                    </p>
                </div>

                {/* Architecture Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-32">
                    <div className="p-8 rounded-none border border-white/10 bg-neutral-900/50 backdrop-blur-md hover:border-ekko-500/30 transition-all group">
                        <div className="w-12 h-12 bg-ekko-500/10 rounded-full flex items-center justify-center mb-6 border border-ekko-500/20 group-hover:bg-ekko-500/20 transition-all">
                            <Cpu className="w-6 h-6 text-ekko-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Neural Audio Synthesis</h3>
                        <p className="text-neutral-400 leading-relaxed">
                            Our proprietary &quot;Likha&quot; model analyzes over 500 audio dimensions to generate high-fidelity music stem-by-stem. It doesn&apos;t just copy styles; it understands musical theory, emotion, and &quot;hugot&quot; (deep emotion).
                        </p>
                    </div>

                    <div className="p-8 rounded-none border border-white/10 bg-neutral-900/50 backdrop-blur-md hover:border-ekko-500/30 transition-all group">
                        <div className="w-12 h-12 bg-ekko-500/10 rounded-full flex items-center justify-center mb-6 border border-ekko-500/20 group-hover:bg-ekko-500/20 transition-all">
                            <Zap className="w-6 h-6 text-ekko-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Agos Streaming Protocol</h3>
                        <p className="text-neutral-400 leading-relaxed">
                            Zero-latency audio delivery. Our adaptive bitrate streaming ensures that whether you&apos;re in Manila on 5G or a remote province on 3G, the music flows uninterrupted like water through the rice terraces.
                        </p>
                    </div>

                    <div className="p-8 rounded-none border border-white/10 bg-neutral-900/50 backdrop-blur-md hover:border-ekko-500/30 transition-all group">
                        <div className="w-12 h-12 bg-ekko-500/10 rounded-full flex items-center justify-center mb-6 border border-ekko-500/20 group-hover:bg-ekko-500/20 transition-all">
                            <Globe className="w-6 h-6 text-ekko-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Bayanihan Graph</h3>
                        <p className="text-neutral-400 leading-relaxed">
                            A collaborative filtering engine that connects not just listeners to songs, but creators to collaborators. It maps the subtle relationships between genres, moods, and cultural contexts to find your perfect tribe.
                        </p>
                    </div>

                    <div className="p-8 rounded-none border border-white/10 bg-neutral-900/50 backdrop-blur-md hover:border-ekko-500/30 transition-all group">
                        <div className="w-12 h-12 bg-ekko-500/10 rounded-full flex items-center justify-center mb-6 border border-ekko-500/20 group-hover:bg-ekko-500/20 transition-all">
                            <Mic2 className="w-6 h-6 text-ekko-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Studio-Grade Tools</h3>
                        <p className="text-neutral-400 leading-relaxed">
                            From browser-based stem separation to AI mastering. We provide a full suite of creation tools accessible from any device, democratizing music production for everyone.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
