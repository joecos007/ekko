"use client";

import { useRef } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ClientOnly } from "@/components/ui/client-only";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { PageTransition } from "@/components/layout/page-transition";
import { DotPattern } from "@/components/ui/dot-pattern";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const mainRef = useRef<HTMLElement>(null);
    useKeyboardShortcuts();

    return (
        <>
            <ClientOnly>
                <ScrollProgress className="top-0" container={mainRef} />
            </ClientOnly>
            <div className="flex min-h-screen bg-mesh relative overflow-hidden">
                {/* Subtle background accent — static, no blur for perf */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-ekko-600/5 rounded-full" />
                <DotPattern
                    className="hidden md:block opacity-[0.15] [mask-image:radial-gradient(circle_at_top,white,transparent_70%)]"
                />

                <Sidebar />
                <main
                    ref={mainRef}
                    className="flex-1 pb-[var(--floating-chat-offset)] md:pb-[calc(var(--player-bar-height)+1.5rem)] border-l border-white/5 overflow-y-auto h-screen relative z-10 transition-colors"
                >
                    <Header />
                    <div className="relative z-10">
                        <PageTransition>
                            {children}
                        </PageTransition>
                    </div>
                </main>
            </div>
            <MobileNav />
        </>
    );
}
