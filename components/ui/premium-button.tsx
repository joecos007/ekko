"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"

interface PremiumButtonProps {
    children: React.ReactNode
    href?: string
    onClick?: () => void
    icon?: React.ReactNode
    className?: string
}

export function PremiumButton({
    children,
    href,
    onClick,
    icon,
    className
}: PremiumButtonProps) {
    const ButtonContent = (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "group relative inline-flex items-center justify-center gap-2",
                "px-8 py-3 h-12 rounded-none min-w-[200px]",
                "bg-gradient-to-r from-ekko-600 via-ekko-500 to-ekko-400",
                "text-white font-bold tracking-wide text-sm lg:text-base",
                "shadow-[0_0_40px_rgba(99,102,241,0.55)]",
                "hover:shadow-[0_0_60px_rgba(99,102,241,0.75)]",
                "transition-all duration-300",
                "overflow-hidden",
                "before:absolute before:inset-0",
                "before:bg-gradient-to-r before:from-ekko-500 before:via-ekko-400 before:to-ekko-300",
                "before:opacity-0 hover:before:opacity-100",
                "before:transition-opacity before:duration-300",
                className
            )}
        >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-ekko-400 via-ekko-300 to-ekko-200 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

            {/* Pulsing glow */}
            <div className="absolute inset-0 rounded-none bg-ekko-500/20 blur-2xl animate-pulse" />

            {/* Content */}
            <span className="relative z-10 flex items-center gap-2">
                {icon && <span className="group-hover:rotate-12 transition-transform duration-300">{icon}</span>}
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
