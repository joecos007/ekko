import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Disc } from "lucide-react";
import { PublicMobileNav } from "@/components/layout/public-mobile-nav";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-geist-sans">
            <header className="fixed top-0 w-full z-50 px-6 md:px-12 py-4 flex items-center justify-between transition-all duration-300 bg-black/50 backdrop-blur-md border-b border-white/5 supports-[backdrop-filter]:bg-black/20">
                <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-md rounded-full group-hover:bg-primary/40 transition-all" />
                        <Disc className="w-8 h-8 text-primary relative z-10 animate-spin-slow" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-sm">EKKO</span>
                </Link>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/login">
                            <Button variant="ghost" className="text-base font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                                Login
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button className="bg-white text-black hover:bg-neutral-200 rounded-full px-8 text-base font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all transform hover:scale-105">
                                Get Started
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Navigation */}
                    <PublicMobileNav />
                </div>
            </header>
            <main className="flex-1">
                {children}
            </main>
            <footer className="py-8 text-center text-neutral-500 text-sm border-t border-neutral-900">
                <p>© {new Date().getFullYear()} EKKO. Built for the future of audio.</p>
            </footer>
        </div>
    );
}
