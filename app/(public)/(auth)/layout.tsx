import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen px-4 pt-20 overflow-hidden">
            {/* Animated background orbs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse-glow" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "3s" }} />
            </div>

            {/* Floating music notes */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute opacity-10 text-primary"
                        style={{
                            left: `${(i * 12.5) + 5}%`,
                            bottom: "-30px",
                            animation: `music-note-float ${20 + i * 3}s linear ${i * 2}s infinite`,
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                        </svg>
                    </div>
                ))}
            </div>

            <div className="absolute top-8 left-8 md:top-12 md:left-12 z-20">
                <Link href="/">
                    <Button variant="ghost" className="text-neutral-400 hover:text-white gap-2 pl-0 hover:bg-transparent group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Button>
                </Link>
            </div>

            <div className="w-full max-w-md space-y-8 relative z-10 transition-all animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Glow effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-neutral-800/20 rounded-full blur-[80px] -z-10" />

                {children}
            </div>
        </div>
    );
}
