"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface GlassButtonProps {
    children: React.ReactNode
    href?: string
    onClick?: () => void
    className?: string
}

export function GlassButton({
    children,
    href,
    onClick,
    className
}: GlassButtonProps) {
    const ButtonContent = (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "group relative inline-flex items-center justify-center",
                "px-8 py-3 h-12 rounded-none min-w-[200px]",
                "bg-white/5 backdrop-blur-md",
                "border-2 border-transparent",
                "bg-clip-padding",
                "text-white font-semibold tracking-wide text-sm lg:text-base",
                "transition-all duration-300",
                "overflow-hidden",
                // Gradient border effect
                "before:absolute before:inset-0 before:rounded-none before:p-[2px]",
                "before:bg-gradient-to-r before:from-ekko-500 before:via-ekko-400 before:to-ekko-500",
                "before:-z-10",
                "hover:bg-white/10",
                className
            )}
        >
            {/* Gradient border */}
            <div className="absolute inset-0 rounded-none bg-gradient-to-r from-ekko-500/50 via-ekko-400/50 to-ekko-500/50 opacity-50 group-hover:opacity-100 transition-opacity -z-10" style={{ padding: '2px' }}>
                <div className="w-full h-full rounded-none bg-black" />
            </div>

            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            {/* Gradient text on hover */}
            <span className="relative z-10 group-hover:bg-gradient-to-r group-hover:from-ekko-200 group-hover:via-ekko-100 group-hover:to-white group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                {children}
            </span>
        </motion.button>
    )

    if (href) {
        return (
            <Link href={href} className="inline-block">
                {ButtonContent}
            </Link>
        )
    }

    return ButtonContent
}
