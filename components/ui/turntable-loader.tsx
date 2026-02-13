'use client'

import Lottie from 'lottie-react'
import turntableAnimation from '@/public/lottie/Turntable.json'

interface TurntableLoaderProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
    showText?: boolean
}

const sizeMap = {
    sm: 'w-24 h-12',
    md: 'w-48 h-24',
    lg: 'w-72 h-36'
}

export function TurntableLoader({
    size = 'md',
    className = '',
    showText = false
}: TurntableLoaderProps) {
    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            <Lottie
                animationData={turntableAnimation}
                loop
                autoplay
                className={sizeMap[size]}
            />
            {showText && (
                <p className="text-neutral-400 text-sm mt-2 animate-pulse">
                    Loading tracks...
                </p>
            )}
        </div>
    )
}
