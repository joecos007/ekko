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
            <div className="flex min-h-screen bg-mesh relative overflow-hidden">
                {/* Decorative Background Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-float" />
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/10 blur-[100px] rounded-full animate-float stagger-3" />

                <Sidebar />
                <main className="flex-1 pb-48 md:pb-24 border-l border-white/5 overflow-y-auto h-screen relative z-10 transition-colors">
                    <Header />
                    <div className="relative z-10">
                        {children}
                    </div>
                </main>
            </div>
            <MobileNav />
        </>
    );
}
