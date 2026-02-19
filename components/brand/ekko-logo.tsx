import { cn } from "@/lib/utils"

interface EkkoLogoProps {
    className?: string
    size?: "sm" | "md" | "lg"
    showText?: boolean
    animated?: boolean
}

const sizes = {
    sm: { icon: "w-6 h-6", text: "text-lg", ring: "w-8 h-8" },
    md: { icon: "w-7 h-7", text: "text-2xl", ring: "w-9 h-9" },
    lg: { icon: "w-10 h-10", text: "text-3xl", ring: "w-12 h-12" },
}

export function EkkoLogo({ className, size = "md", showText = true, animated = true }: EkkoLogoProps) {
    const s = sizes[size]

    return (
        <div className={cn("flex items-center gap-2 group", className)}>
            <div className={cn("relative flex items-center justify-center", s.ring)}>
                <div className="absolute inset-0 bg-ekko-500/20 blur-md rounded-full group-hover:bg-ekko-500/40 transition-all" />
                <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={cn(s.icon, "relative z-10", animated && "animate-spin-slow")}
                >
                    {/* Outer ring */}
                    <circle cx="16" cy="16" r="14" stroke="url(#ekko-gradient)" strokeWidth="2" opacity="0.6" />
                    {/* Inner ring */}
                    <circle cx="16" cy="16" r="9" stroke="url(#ekko-gradient)" strokeWidth="1.5" opacity="0.4" />
                    {/* Center dot */}
                    <circle cx="16" cy="16" r="4" fill="url(#ekko-gradient)" />
                    {/* Soundwave arcs - left */}
                    <path d="M7 11C5.5 13 5.5 19 7 21" stroke="url(#ekko-gradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                    <path d="M4 8.5C1.5 12 1.5 20 4 23.5" stroke="url(#ekko-gradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                    {/* Soundwave arcs - right */}
                    <path d="M25 11C26.5 13 26.5 19 25 21" stroke="url(#ekko-gradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                    <path d="M28 8.5C30.5 12 30.5 20 28 23.5" stroke="url(#ekko-gradient)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                    <defs>
                        <linearGradient id="ekko-gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#818CF8" />
                            <stop offset="0.5" stopColor="#6366F1" />
                            <stop offset="1" stopColor="#4F46E5" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            {showText && (
                <span className={cn(
                    s.text,
                    "font-black tracking-tighter bg-gradient-to-r from-ekko-300 via-ekko-400 to-ekko-500 bg-clip-text text-transparent"
                )}>
                    EKKO
                </span>
            )}
        </div>
    )
}
