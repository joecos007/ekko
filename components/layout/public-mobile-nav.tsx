"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function PublicMobileNav() {
    const [isOpen, setIsOpen] = useState(false)

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }
        return () => {
            document.body.style.overflow = "auto"
        }
    }, [isOpen])

    return (
        <div className="md:hidden">
            <Button
                variant="ghost"
                size="icon"
                className="relative z-[100] text-white hover:bg-white/10"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isOpen}
                aria-controls="public-mobile-menu"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>

            {/* Overlay Menu */}
            <div
                id="public-mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className={cn(
                    "fixed inset-0 bg-black/98 z-[99] flex flex-col items-center justify-center gap-8 transition-all duration-300 ease-in-out",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}>
                <nav className="flex flex-col items-center gap-4 w-full px-10">
                    <Link href="/" onClick={() => setIsOpen(false)} className="w-full">
                        <Button
                            variant="ghost"
                            className="w-full text-lg h-12 font-bold text-neutral-400 hover:text-white transition-all active:scale-95"
                        >
                            Home
                        </Button>
                    </Link>
                    <Link href="/team" onClick={() => setIsOpen(false)} className="w-full">
                        <Button
                            variant="ghost"
                            className="w-full text-lg h-12 font-bold text-neutral-400 hover:text-white transition-all active:scale-95"
                        >
                            Our Team
                        </Button>
                    </Link>

                    <div className="flex flex-col items-center my-4 w-full">
                        <span className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.4em]">Membership</span>
                        <div className="h-[1px] w-8 bg-neutral-800 mt-2" />
                    </div>

                    <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                        <Button
                            variant="outline"
                            className="w-full text-lg h-12 rounded-none font-semibold tracking-wide uppercase text-white border-white/20 hover:bg-white/5 transition-all active:scale-95"
                        >
                            Login
                        </Button>
                    </Link>

                    <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full">
                        <Button
                            className="w-full text-lg h-14 rounded-none font-semibold tracking-wide uppercase bg-white text-black hover:bg-neutral-200 shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95 transition-all"
                        >
                            Get Started
                        </Button>
                    </Link>
                </nav>

                <div className="absolute bottom-10 text-neutral-600 text-xs">
                    © EKKO Audio
                </div>
            </div>
        </div>
    )
}
