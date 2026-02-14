"use client";

import React, { useRef } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame,
    wrap,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface VelocityScrollProps {
    children: React.ReactNode;
    defaultVelocity?: number;
    className?: string;
    skew?: boolean;
}

export function VelocityScroll({
    children,
    defaultVelocity = 5,
    className,
    skew = false,
}: VelocityScrollProps) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400,
    });

    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false,
    });

    // Skew effect based on velocity
    const skewX = useTransform(smoothVelocity, [-1000, 1000], [-10, 10]);

    /**
     * This is a magic wrapping for the length of the text - you
     * have to replace for wrapping that works for you or dynamically
     * calculate
     */
    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

    const directionFactor = useRef<number>(1);

    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * defaultVelocity * (delta / 1000);

        // Apply scroll velocity to movement
        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div className={cn("overflow-hidden whitespace-nowrap flex flex-nowrap", className)}>
            <motion.div
                className="flex flex-nowrap items-center gap-8"
                style={{ x, skewX: skew ? skewX : 0, willChange: "transform" }}
            >
                {/* Render children multiple times to ensure seamless loop */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <React.Fragment key={i}>
                        {children}
                    </React.Fragment>
                ))}
            </motion.div>
        </div>
    );
}

// Helper to create the content block
export const MarqueeItem = ({ text, icon: Icon, color }: { text: string, icon?: any, color?: string }) => (
    <div className="flex items-center gap-8">
        <span className="text-sm font-bold uppercase tracking-widest">{text}</span>
        {Icon && <Icon className={`w-4 h-4 animate-spin-slow ${color}`} />}
    </div>
);
