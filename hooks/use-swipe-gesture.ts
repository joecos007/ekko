'use client'

import { useCallback, useRef } from 'react'

interface SwipeConfig {
    onSwipeUp?: () => void
    onSwipeDown?: () => void
    onSwipeLeft?: () => void
    onSwipeRight?: () => void
    threshold?: number // Minimum distance to trigger swipe (default: 50px)
}

/**
 * Hook to detect touch swipe gestures.
 * Returns handlers to attach to the swipeable element.
 */
export function useSwipeGesture({
    onSwipeUp,
    onSwipeDown,
    onSwipeLeft,
    onSwipeRight,
    threshold = 50
}: SwipeConfig) {
    const touchStartRef = useRef<{ x: number; y: number } | null>(null)

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0]
        touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    }, [])

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (!touchStartRef.current) return

        const touch = e.changedTouches[0]
        const deltaX = touch.clientX - touchStartRef.current.x
        const deltaY = touch.clientY - touchStartRef.current.y

        const absDeltaX = Math.abs(deltaX)
        const absDeltaY = Math.abs(deltaY)

        // Determine if swipe is primarily horizontal or vertical
        if (absDeltaY > absDeltaX && absDeltaY > threshold) {
            // Vertical swipe
            if (deltaY < 0 && onSwipeUp) {
                onSwipeUp()
            } else if (deltaY > 0 && onSwipeDown) {
                onSwipeDown()
            }
        } else if (absDeltaX > absDeltaY && absDeltaX > threshold) {
            // Horizontal swipe
            if (deltaX < 0 && onSwipeLeft) {
                onSwipeLeft()
            } else if (deltaX > 0 && onSwipeRight) {
                onSwipeRight()
            }
        }

        touchStartRef.current = null
    }, [onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight, threshold])

    return {
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd
    }
}
