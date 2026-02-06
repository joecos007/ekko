import { AudioProvider } from "@/components/player/audio-provider";
import { PlayerBar } from "@/components/player/player-bar";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 bg-background pb-24 border-l border-neutral-900 overflow-y-auto h-[calc(100vh-6rem)] relative">
                    <Header />
                    {children}
                </main>
            </div>
            <AudioProvider />
            <PlayerBar />
            <MobileNav />
        </>
    );
}
