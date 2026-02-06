'use client'

import { Controls } from './controls'
import { ProgressBar } from './progress-bar'
import { VolumeControl } from './volume-control'
import { TrackInfo } from './track-info'
import { NowPlayingView } from './now-playing-view'
import { usePlayer } from '@/store/player-store'

export function PlayerBar() {
    const { queue, currentIndex } = usePlayer()
    const song = queue[currentIndex]

    // If no song is loaded/playing, we might hide the bar or show disabled state?
    // Spotify shows empty state.

    return (
        <div className="fixed bottom-16 md:bottom-0 left-0 right-0 h-16 md:h-24 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border z-40 transition-all">
            <div className="h-full px-4 flex flex-col justify-center">
                <div className="flex items-center justify-between gap-2 h-full">
                    {/* Track Info - Left */}
                    <div className="flex-1 min-w-0">
                        <TrackInfo />
                    </div>

                    {/* Controls - Center */}
                    <div className="flex flex-col items-center gap-2 flex-shrink-0 z-50">
                        <Controls />
                        <div className="hidden md:block w-full min-w-[300px] max-w-xl">
                            <ProgressBar />
                        </div>
                    </div>

                    {/* Volume / Spacer - Right */}
                    <div className="flex-1 flex justify-end min-w-0">
                        <div className="hidden md:flex w-full justify-end">
                            <VolumeControl />
                        </div>
                        {/* Mobile Spacer to balance TrackInfo and center controls */}
                        <div className="md:hidden w-8" />
                    </div>
                </div>
            </div>
            <NowPlayingView />
        </div>
    )
}
