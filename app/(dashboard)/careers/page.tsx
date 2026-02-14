import { Rocket, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CareersPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in duration-500">
            <div className="p-6 bg-orange-500/10 rounded-full mb-8 relative group">
                <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full group-hover:bg-orange-500/30 transition-all duration-700" />
                <Rocket className="w-16 h-16 text-orange-500 relative z-10" />
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Join the Revolution</h1>
            <p className="text-xl text-neutral-400 max-w-2xl mb-12 leading-relaxed">
                We're always looking for visionaries who want to build the future of audio.
                If you're passionate about AI, music, and breaking boundaries, we want to hear from you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button
                    disabled
                    className="px-8 py-4 h-auto bg-white/5 text-neutral-400 font-bold rounded-full border border-white/5 cursor-not-allowed flex items-center gap-2"
                >
                    Roles Opening Soon <Rocket className="w-4 h-4 opacity-50" />
                </Button>
                <Link
                    href="/"
                    className="px-8 py-4 bg-white/5 text-white font-bold rounded-full hover:bg-white/10 transition-colors border border-white/10"
                >
                    Return Home
                </Link>
            </div>
        </div>
    )
}
