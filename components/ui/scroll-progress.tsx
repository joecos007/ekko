"use client"

import { motion, MotionProps, useScroll } from "motion/react"
import React from "react"

import { cn } from "@/lib/utils"

interface ScrollProgressProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  keyof MotionProps
> {
  container?: React.RefObject<HTMLElement | null>
}

export const ScrollProgress = React.forwardRef<HTMLDivElement, ScrollProgressProps>(
  ({ className, container, ...props }, ref) => {
    const { scrollYProgress } = useScroll({ container: container as React.RefObject<HTMLElement> })

    return (
      <motion.div
        ref={ref}
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-px origin-left bg-gradient-to-r from-ekko-300 via-ekko-500 to-ekko-700",
          className
        )}
        style={{
          scaleX: scrollYProgress,
        }}
        {...props}
      />
    )
  }
)

ScrollProgress.displayName = "ScrollProgress"
