import { AuroraBackground } from "@/components/auth/aurora-background";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 md:px-12 font-geist-sans selection:bg-orange-500 selection:text-white">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <AuroraBackground className="opacity-20" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-12">
                    OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">STORY</span>
                </h1>

                <div className="space-y-12 text-lg md:text-xl text-neutral-300 leading-relaxed font-light">
                    <p>
                        <span className="text-white font-bold">EKKO</span> was born from a simple question asked late one night in a Quezon City garage: <em>&quot;What if an algorithm could feel?&quot;</em>
                    </p>
                    <p>
                        We are a team of musicians, engineers, and dreamers based in Manila, Philippines. We grew up surrounded by the chaotic harmony of the city—the jeepney bass, the karaoke nights, the relentless rain. We noticed that while AI was getting smarter, it was getting colder. It could replicate sound, but it couldn&apos;t replicate <em>soul</em>.
                    </p>
                    <p>
                        So we built the <span className="text-orange-400">Likha Engine</span>. Not to replace the artist, but to give everyone an instrument. We believe that creativity is a human right, and technology should be the bridge, not the barrier.
                    </p>
                    <p>
                        Today, Ekko is more than just a streaming platform. It is a digital barangay—a place where sounds from every corner of the globe converge, collide, and create something entirely new.
                    </p>
                    <hr className="border-white/10 my-12" />
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                            <p className="text-sm">To democratize music creation and build a self-sustaining ecosystem where every story finds its song.</p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                            <p className="text-sm">A world where the barrier between listener and creator no longer exists.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
