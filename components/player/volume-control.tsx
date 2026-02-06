'use client'

import { usePlayer } from '@/store/player-store'
import { Slider } from '@/components/ui/slider'
import { Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function VolumeControl() {
    const { volume, setVolume } = usePlayer()

    return (
        <div className="hidden md:flex items-center gap-2 w-full max-w-[120px] justify-end">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setVolume(volume === 0 ? 1 : 0)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
                {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>

            <Slider
                value={[volume]}
                max={1}
                step={0.01}
                className="w-20 cursor-pointer"
                onValueChange={(val) => setVolume(val[0])}
            />
        </div>
    )
}
