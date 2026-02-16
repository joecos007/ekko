"use client"

import { useEffect, useRef } from "react"
import { usePlayer } from "@/store/player-store"

interface AudioVisualizerProps {
    className?: string
    barCount?: number
    barWidth?: number
    gap?: number
    color?: string
}

export function AudioVisualizer({
    className,
    barCount = 64,
    barWidth = 4,
    gap = 2,
    color = "#a855f7" // purple-500
}: AudioVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { isPlaying } = usePlayer()
    const requestRef = useRef<number>(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let analyser: AnalyserNode | null = null
        // buffer length for frequency data (usually fftSize / 2)
        const dataBuffer = new Uint8Array(256)

        const render = () => {
            const width = canvas.width
            const height = canvas.height

            ctx.clearRect(0, 0, width, height)

            // Try to get analyser from global scope (exposed by AudioProvider)
            if (!analyser && typeof window !== 'undefined' && (window as any).audioAnalyser) {
                try {
                    analyser = (window as any).audioAnalyser
                } catch {
                    // ignore
                }
            }

            if (analyser) {
                // Get real frequency data
                try {
                    analyser.getByteFrequencyData(dataBuffer)
                } catch {
                    // If node is disconnected or error, fallback
                }
            } else if (isPlaying) {
                // Simulated fallback
                const time = Date.now() / 1000
                for (let i = 0; i < dataBuffer.length; i++) {
                    const value = Math.sin(i * 0.1 + time * 5) * 50 + 100
                    dataBuffer[i] = value
                }
            } else {
                dataBuffer.fill(0)
            }

            // Draw bars
            const totalBarWidth = barWidth + gap
            // Center the visualization
            const startX = (width - (barCount * totalBarWidth)) / 2

            ctx.fillStyle = color

            // We want to distribute the spectrum across the bars.
            // The first few bins of FFT are bass, higher are treble.
            // We'll sample the buffer.
            const step = Math.floor(dataBuffer.length / barCount) || 1

            for (let i = 0; i < barCount; i++) {
                // Get average of the step range to smooth it out
                let sum = 0
                for (let j = 0; j < step; j++) {
                    sum += dataBuffer[(i * step) + j] || 0
                }
                const avg = sum / step

                // Scale value
                let value = (avg / 255) * height * 0.8 // Scale to 80% height max
                if (value < 4) value = 4 // Min height

                const x = startX + i * totalBarWidth
                const y = height - value - (height * 0.1) // Lift slightly from bottom

                // Rounded top bars
                ctx.beginPath()
                // Use standard rect if roundRect is not available in all envs
                if (ctx.roundRect) {
                    ctx.roundRect(x, y, barWidth, value, [4, 4, 0, 0])
                } else {
                    ctx.rect(x, y, barWidth, value)
                }
                ctx.fill()

                // Reflection / Glow
                ctx.globalAlpha = 0.2
                if (ctx.roundRect) {
                    ctx.roundRect(x, height - (height * 0.08), barWidth, value * 0.4, [0, 0, 4, 4])
                } else {
                    ctx.rect(x, height - (height * 0.08), barWidth, value * 0.4)
                }
                ctx.fill()
                ctx.globalAlpha = 1.0
            }

            requestRef.current = requestAnimationFrame(render)
        }

        render()

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current)
        }
    }, [isPlaying, barCount, barWidth, gap, color])

    return (
        <canvas
            ref={canvasRef}
            className={className}
            width={800}
            height={300}
        />
    )
}
