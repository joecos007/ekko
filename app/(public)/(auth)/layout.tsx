import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen px-4">
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
