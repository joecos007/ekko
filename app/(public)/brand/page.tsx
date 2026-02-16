import { AuroraBackground } from "@/components/auth/aurora-background";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BrandPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 md:px-12 font-geist-sans selection:bg-pink-500 selection:text-white">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <AuroraBackground className="opacity-20" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto">
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-12">
                    BRAND <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-600">ASSETS</span>
                </h1>

                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <div>
                        <h3 className="text-2xl font-bold mb-6">Logo</h3>
                        <div className="p-12 bg-neutral-900 rounded-3xl border border-white/10 flex items-center justify-center mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-full bg-black animate-pulse" />
                                </div>
                                <span className="text-4xl font-black tracking-tighter">EKKO</span>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full h-12 rounded-full border-white/10 hover:bg-white/5">
                            <Download className="w-4 h-4 mr-2" /> Download Logo Kit
                        </Button>
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold mb-6">Typography</h3>
                        <div className="p-12 bg-white text-black rounded-3xl border border-white/10 flex flex-col justify-center mb-6 h-[200px]">
                            <div className="text-4xl font-black tracking-tighter mb-2">Geist Sans</div>
                            <div className="text-xl opacity-70">Aa Bb Cc Dd 123</div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-2xl font-bold mb-6">Color Palette</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="h-32 rounded-2xl bg-black border border-white/10 p-4 flex items-end font-mono text-xs">#000000</div>
                        <div className="h-32 rounded-2xl bg-white text-black p-4 flex items-end font-mono text-xs">#FFFFFF</div>
                        <div className="h-32 rounded-2xl bg-blue-500 p-4 flex items-end font-mono text-xs">#3B82F6</div>
                        <div className="h-32 rounded-2xl bg-purple-500 p-4 flex items-end font-mono text-xs">#A855F7</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
