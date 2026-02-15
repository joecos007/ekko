import Link from "next/link";
import { Disc } from "lucide-react";
import { DotPattern } from "@/components/ui/dot-pattern";
import { cn } from "@/lib/utils";

export function PublicFooter() {
    return (
        <footer className="relative pt-12 pb-12 px-6 border-t border-white/10 overflow-hidden bg-black text-white">
            <div className="absolute inset-0 z-0 bg-black">
                <DotPattern
                    width={20}
                    height={20}
                    cx={1}
                    cy={1}
                    cr={1}
                    className={cn("[mask-image:linear-gradient(to_bottom,transparent,white,transparent)] opacity-50")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Disc className="w-4 h-4 text-white animate-spin-slow" />
                        </div>
                        <span className="font-bold tracking-tighter text-2xl text-white">EKKO</span>
                    </div>
                    <p className="max-w-xs text-neutral-400 text-sm leading-relaxed">
                        Redefining the future of audio streaming through AI-driven curation and community connection.
                    </p>
                </div>

                <div className="flex gap-12 md:gap-24">
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-6">Platform</h4>
                        <ul className="space-y-4 text-sm text-neutral-300">
                            <li><Link href="/platform" className="hover:text-white transition-colors">Discover</Link></li>
                            <li><Link href="/live-radio" className="hover:text-white transition-colors">Live Radio</Link></li>
                            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-neutral-300">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="/brand" className="hover:text-white transition-colors">Brand</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-6">Legal</h4>
                        <ul className="space-y-4 text-sm text-neutral-300">
                            <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                            <li><Link href="/legal/terms" className="hover:text-white transition-colors">Terms</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500 font-mono">
                <p>© 2026 EKKO SYSTEMS INC. ALL RIGHTS RESERVED.</p>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <span>SYSTEM STATUS: <span className="text-green-500">OPERATIONAL</span></span>
                    <span>V2.0.4-BETA</span>
                </div>
            </div>
        </footer>
    );
}
