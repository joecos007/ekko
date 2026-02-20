import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EkkoLogo } from "@/components/brand/ekko-logo";
import { PublicMobileNav } from "@/components/layout/public-mobile-nav";
import { PublicFooter } from "@/components/layout/public-footer";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-[100dvh] bg-background text-foreground flex flex-col font-geist-sans">
            <header className="fixed top-0 w-full z-50 px-6 md:px-16 lg:px-24 py-4 flex items-center justify-between transition-all duration-300 bg-black/50 backdrop-blur-md border-b border-white/5 supports-[backdrop-filter]:bg-black/20">
                <Link href="/" className="cursor-pointer">
                    <EkkoLogo size="md" />
                </Link>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/login">
                            <Button variant="ghost" className="text-base font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
                                Login
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button className="bg-white text-black hover:bg-neutral-200 rounded-none px-8 h-10 text-sm font-semibold tracking-wide uppercase shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all">
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
            <PublicFooter />
        </div>
    );
}
