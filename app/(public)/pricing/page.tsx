import { AuroraBackground } from "@/components/auth/aurora-background";
import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 md:px-12 font-geist-sans selection:bg-ekko-500/30 selection:text-white">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <AuroraBackground className="opacity-20" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="text-center mb-24">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                        INVEST IN YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-ekko-400 to-ekko-600">SOUND</span>
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                        Simple, transparent pricing. Join the revolution at the level that suits your journey.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                    {/* Free Tier */}
                    <div className="p-8 rounded-none border border-white/10 bg-neutral-900/50 backdrop-blur-md">
                        <h3 className="text-2xl font-bold mb-2 text-neutral-400">Listener</h3>
                        <div className="text-4xl font-black mb-6 flex items-baseline gap-1">
                            ₱100<span className="text-sm text-neutral-500 font-normal">/mo</span>
                        </div>
                        <p className="text-neutral-500 text-sm mb-8">For casual listeners and explorers.</p>

                        <div className="space-y-4 mb-8">
                            {["Unlimited Streaming", "Basic Discovery Features", "Public Playlists", "Ad-supported", "Standard Audio Quality"].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                                    <Check className="w-4 h-4 text-neutral-500" />
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <Link href="/signup">
                            <Button variant="outline" className="w-full h-12 rounded-full border-white/10 hover:bg-white/5">Start Free</Button>
                        </Link>
                    </div>

                    {/* Pro Tier */}
                    <div className="p-10 rounded-none border border-white/20 bg-gradient-to-b from-neutral-800 to-black relative shadow-2xl scale-105 z-10">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                            Most Popular
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-white">Creator</h3>
                        <div className="text-5xl font-black mb-6 flex items-baseline gap-1">
                            ₱200<span className="text-sm text-neutral-500 font-normal">/mo</span>
                        </div>
                        <p className="text-neutral-400 text-sm mb-8">For serious artists and audiophiles.</p>

                        <div className="space-y-4 mb-8">
                            {["Everything in Free", "Hi-Fi Lossless Audio", "Download Offline", "Create & Remix Tracks", "Commercial License for Created Tracks", "No Ads"].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-white">
                                    <div className="w-5 h-5 rounded-full bg-ekko-500 flex items-center justify-center shrink-0">
                                        <Check className="w-3 h-3 text-white" />
                                    </div>
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <Link href="/signup">
                            <Button className="w-full h-14 rounded-full bg-white text-black hover:bg-neutral-200 font-bold text-lg shadow-glow-white">Get Creator</Button>
                        </Link>
                    </div>

                    {/* Studio Tier */}
                    <div className="p-8 rounded-none border border-white/10 bg-neutral-900/50 backdrop-blur-md">
                        <h3 className="text-2xl font-bold mb-2 text-ekko-300">Studio</h3>
                        <div className="text-4xl font-black mb-6 flex items-baseline gap-1">
                            ₱300<span className="text-sm text-neutral-500 font-normal">/mo</span>
                        </div>
                        <p className="text-neutral-500 text-sm mb-8">For professional production houses.</p>

                        <div className="space-y-4 mb-8">
                            {["Everything in Creator", "API Access", "Stem Export", "Priority Rendering", "Dedicated Support"].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                                    <Check className="w-4 h-4 text-ekko-400" />
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <Link href="/contact">
                            <Button variant="outline" className="w-full h-12 rounded-full border-white/10 hover:bg-white/5">Contact Sales</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
