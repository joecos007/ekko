import { AuroraBackground } from "@/components/auth/aurora-background";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 md:px-12 font-geist-sans selection:bg-ekko-500/30 selection:text-white">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <AuroraBackground className="opacity-20" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-12">
                    OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-ekko-400 to-ekko-600">STORY</span>
                </h1>

                <div className="space-y-12 text-lg md:text-xl text-neutral-300 leading-relaxed font-light">
                    <p>
                        We are a team of music lovers, MNC employees, engineers, and dreamers based in Manila, Philippines. We grew up inside the city’s chaotic harmony—the jeepney basslines, karaoke nights that spill past midnight, and the soft percussion of relentless rain. Those textures taught us something algorithms often miss: rhythm is human.
                    </p>
                    <p>
                        As AI got smarter, it also got colder. It could replicate sound, but it couldn’t replicate <em>soul</em>. <span className="text-white font-bold">EKKO</span> is our answer to that gap: where intelligence meets intuition, and technology amplifies emotion instead of flattening it.
                    </p>
                    <p>
                        We built the <span className="text-ekko-400">Likha Engine</span> not to replace artists, but to give everyone an instrument. It listens, learns, and collaborates—helping you turn fragments of memory, voice notes, and late–night ideas into songs that feel unmistakably yours.
                    </p>
                    <p>
                        Today, EKKO is more than a platform. It’s a digital barangay where stories become melodies, where creators and listeners meet, and where Manila’s pulse—messy, bright, alive—finds new form in the hands of a global community.
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
