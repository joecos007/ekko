"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface BackButtonProps {
    className?: string
    variant?: "default" | "glass"
}

export function BackButton({ className, variant = "glass" }: BackButtonProps) {
    const router = useRouter()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className={cn(
                "group relative h-10 w-10 rounded-full transition-all duration-300 active:scale-95",
                variant === "glass" && "bg-black/20 backdrop-blur-md border border-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-105",
                className
            )}
            title="Go back"
        >
            <ChevronLeft className="w-6 h-6 text-white/70 group-hover:text-white transition-colors" />

            {/* Soft Glow */}
            {variant === "glass" && (
                <div className="absolute inset-0 rounded-full bg-white/5 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
        </Button>
    )
}
