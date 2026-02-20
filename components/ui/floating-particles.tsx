"use client"

import { useEffect, useState } from "react"

interface Particle {
    id: number
    x: number
    size: number
    duration: number
    delay: number
    type: "note" | "orb"
}

export function FloatingParticles({ count = 8 }: { count?: number }) {
    const [particles, setParticles] = useState<Particle[]>([])

    useEffect(() => {
        // Respect reduced motion preference
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return
        }
        const timer = setTimeout(() => {
            setParticles(Array.from({ length: count }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                size: Math.random() * 20 + 10,
                duration: Math.random() * 15 + 15,
                delay: Math.random() * 10,
                type: Math.random() > 0.5 ? "note" : "orb",
            })))
        }, 0)
        return () => clearTimeout(timer)
    }, [count])

    if (particles.length === 0) return null

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {
                particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="absolute opacity-20"
                        style={{
                            left: `${particle.x}%`,
                            bottom: "-50px",
                            willChange: "transform",
                            animation: `music-note-float ${particle.duration}s linear ${particle.delay}s infinite`,
                        }}
                    >
                        {particle.type === "note" ? (
                            <svg
                                width={particle.size}
                                height={particle.size}
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="text-primary"
                            >
                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                        ) : (
                            <div
                                className="rounded-full bg-gradient-to-br from-primary/50 to-ekko-500/50 blur-sm"
                                style={{
                                    width: particle.size,
                                    height: particle.size,
                                }}
                            />
                        )}
                    </div>
                ))
            }
        </div>
    )
}
