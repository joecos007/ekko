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
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>

            {/* Overlay Menu */}
            <div className={cn(
                "fixed inset-0 bg-black/98 z-[99] flex flex-col items-center justify-center gap-8 transition-all duration-300 ease-in-out",
                isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}>
                <nav className="flex flex-col items-center gap-6 w-full px-8">
                    <span className="text-sm font-medium text-neutral-500 uppercase tracking-widest mb-4">Menu</span>

                    <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                        <Button
                            variant="ghost"
                            className="w-full text-2xl h-14 font-bold text-neutral-300 hover:text-white"
                        >
                            Login
                        </Button>
                    </Link>

                    <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full">
                        <Button
                            className="w-full text-xl h-16 rounded-full font-bold bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
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
