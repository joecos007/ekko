'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Play, Heart, ListPlus, Upload, Music2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from '@/lib/format-time'

interface ActivityItem {
    id: string
    type: 'play' | 'like' | 'playlist_add' | 'upload'
    userName: string
    songTitle?: string
    playlistTitle?: string
    createdAt: string
}

const ACTIVITY_ICONS = {
    play: Play,
    like: Heart,
    playlist_add: ListPlus,
    upload: Upload,
}

const ACTIVITY_COLORS = {
    play: 'text-ekko-400 bg-ekko-500/10',
    like: 'text-ekko-300 bg-ekko-500/10',
    playlist_add: 'text-ekko-200 bg-ekko-500/10',
    upload: 'text-ekko-500 bg-ekko-500/10',
}

function getActivityText(item: ActivityItem): string {
    switch (item.type) {
        case 'play': return `played "${item.songTitle}"`
        case 'like': return `liked "${item.songTitle}"`
        case 'playlist_add': return `added a song to "${item.playlistTitle}"`
        case 'upload': return `uploaded "${item.songTitle}"`
        default: return 'did something'
    }
}

export function ActivityFeed({ className }: { className?: string }) {
    const [activities, setActivities] = useState<ActivityItem[]>([])
    const [supabase] = useState(() => createClient())

    useEffect(() => {
        // Fetch recent activity from liked_songs and songs tables
        async function fetchActivity() {
            const [likesResult, songsResult] = await Promise.all([
                supabase
                    .from('liked_songs')
                    .select('id, created_at, song_id, user_id, songs(title)')
                    .order('created_at', { ascending: false })
                    .limit(10),
                supabase
                    .from('songs')
                    .select('id, title, artist, created_at')
                    .order('created_at', { ascending: false })
                    .limit(5),
            ])

            const items: ActivityItem[] = []

            if (likesResult.data) {
                likesResult.data.forEach((like: any) => {
                    items.push({
                        id: `like-${like.id}`,
                        type: 'like',
                        userName: 'A listener',
                        songTitle: like.songs?.title || 'Unknown',
                        createdAt: like.created_at,
                    })
                })
            }

            if (songsResult.data) {
                songsResult.data.forEach((song: any) => {
                    items.push({
                        id: `upload-${song.id}`,
                        type: 'upload',
                        userName: song.artist || 'An artist',
                        songTitle: song.title,
                        createdAt: song.created_at,
                    })
                })
            }

            // Sort by date
            items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            setActivities(items.slice(0, 15))
        }

        fetchActivity()

        // Subscribe to realtime changes
        const channel = supabase
            .channel('activity-feed')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'liked_songs' }, (payload: any) => {
                setActivities(prev => [{
                    id: `like-${payload.new.id}`,
                    type: 'like' as const,
                    userName: 'A listener',
                    songTitle: 'a track',
                    createdAt: payload.new.created_at || new Date().toISOString(),
                }, ...prev].slice(0, 15))
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'songs' }, (payload: any) => {
                setActivities(prev => [{
                    id: `upload-${payload.new.id}`,
                    type: 'upload' as const,
                    userName: payload.new.artist || 'An artist',
                    songTitle: payload.new.title || 'a new track',
                    createdAt: payload.new.created_at || new Date().toISOString(),
                }, ...prev].slice(0, 15))
            })
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [supabase])

    if (activities.length === 0) {
        return (
            <div className={cn("flex flex-col items-center justify-center py-8 text-neutral-600", className)}>
                <Music2 className="w-8 h-8 mb-2" />
                <p className="text-sm">No recent activity</p>
            </div>
        )
    }

    return (
        <div className={cn("space-y-1", className)}>
            {activities.map((item, i) => {
                const Icon = ACTIVITY_ICONS[item.type]
                const colors = ACTIVITY_COLORS[item.type]

                return (
                    <div
                        key={item.id}
                        className="flex items-start gap-3 px-3 py-2.5 rounded-none hover:bg-white/5 transition-colors group"
                        style={{ animationDelay: `${i * 50}ms` }}
                    >
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5", colors)}>
                            <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-white/80 leading-snug">
                                <span className="font-semibold text-white">{item.userName}</span>{' '}
                                {getActivityText(item)}
                            </p>
                            <p className="text-[10px] text-neutral-600 font-mono mt-0.5">
                                {formatDistanceToNow(item.createdAt)}
                            </p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
