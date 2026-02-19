'use client'

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/utils/supabase/client"
import { usePlayer } from "@/store/player-store"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Play, Star, Coffee, Flower2, Headphones, Zap, Music, Pause, Heart, Radio, RotateCw, Sparkles, User } from "lucide-react"
import { useEffect, useState } from "react"
import { MediaItemActionMenu } from "@/components/media/media-item-action-menu"
import { getCoverArt, PLAYLIST_COVERS } from "@/lib/cover-art"
import { TurntableLoader } from "@/components/ui/turntable-loader"
import { FloatingParticles } from "@/components/ui/floating-particles"
import { STATIC_SONGS } from "@/lib/static-music"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

// Magic UI Components
import { MagicCard } from "@/components/ui/magic-card"
import { TextAnimate } from "@/components/ui/text-animate"
import { HyperText } from "@/components/ui/hyper-text"
import { SongGridSkeleton } from "@/components/ui/skeleton"
import { SongContextMenu } from "@/components/media/song-context-menu"
import { Marquee } from "@/components/ui/marquee"

const TeamStoryDialog = dynamic(
  () => import("@/components/layout/team-story-dialog").then((mod) => mod.TeamStoryDialog),
  { ssr: false }
)

// Legacy Components to Keep/Refactor
import { TrendingSection } from "@/components/home/trending-section"
import { RecentlyPlayed } from "@/components/home/recently-played"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { HeroBanner } from '@/components/home/hero-banner'
import { CategoryPills } from "@/components/home/category-pills"
import { SongRow } from "@/components/home/song-row"

// Artist Data (Moved from ArtistPills)
const FEATURED_ARTISTS = [
  { id: 'a1', name: 'Team Ekko', avatarUrl: '/song-cover/mga-isla-sa-gitna-natin.png', gradient: 'from-ekko-400 to-ekko-600' },
  { id: 'a2', name: 'Chele', avatarUrl: '/song-cover/groove-ni-chele.png', gradient: 'from-ekko-300 to-ekko-500' },
  { id: 'a3', name: 'Jai', avatarUrl: '/song-cover/si-jai.png', gradient: 'from-ekko-500 to-ekko-700' },
  { id: 'a4', name: 'Tiaong Sound', avatarUrl: '/song-cover/dito-sa-tiaong.png', gradient: 'from-ekko-300 to-ekko-600' },
  { id: 'a5', name: 'Isla Beats', avatarUrl: '/song-cover/sarap-ng-buhay.png', gradient: 'from-ekko-400 to-ekko-500' },
  { id: 'a6', name: 'Pagsikat', avatarUrl: '/song-cover/sa-muling-pagsikat.png', gradient: 'from-ekko-500 to-ekko-800' },
  { id: 'a7', name: 'Uwian', avatarUrl: '/song-cover/uwian-na.png', gradient: 'from-ekko-400 to-ekko-700' },
  { id: 'a8', name: 'Poblacion', avatarUrl: '/song-cover/poblacion-3-groove.jpeg', gradient: 'from-ekko-300 to-ekko-600' },
]

const HERO_SLIDES = [
  {
    id: 'slide-1',
    title: 'Team Ekko',
    description: 'The heartbeat of Philippine AI music. Innovative, soulful, and uniquely Filipino.',
    image: '/song-cover/mga-isla-sa-gitna-natin.png',
    stats: '12 Albums • 164 Tracks',
    gradient: 'from-ekko-600 via-ekko-700 to-ekko-900'
  },
  {
    id: 'slide-2',
    title: 'Chele',
    description: 'Groovy rhythms and smooth melodies from the island. Experience the sound of paradise.',
    image: '/song-cover/groove-ni-chele.png',
    stats: '5 Albums • 42 Tracks',
    gradient: 'from-ekko-400 via-ekko-500 to-ekko-700'
  },
  {
    id: 'slide-3',
    title: 'Jai',
    description: 'Modern beats meeting traditional roots. Jai defines the new era of P-Pop.',
    image: '/song-cover/si-jai.png',
    stats: '8 Albums • 56 Tracks',
    gradient: 'from-ekko-700 via-ekko-800 to-ekko-950'
  },
  {
    id: 'slide-4',
    title: 'Tiaong Sound',
    description: 'Authentic local vibes reimagined. The soul of Quezon province in every beat.',
    image: '/song-cover/dito-sa-tiaong.png',
    stats: '3 Albums • 28 Tracks',
    gradient: 'from-ekko-300 via-ekko-400 to-ekko-500'
  }
]

export default function Home() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const { isPlaying, queue, currentIndex, togglePlay, setQueue } = usePlayer()
  const currentSong = queue[currentIndex]

  const [selectedCategory, setSelectedCategory] = useState("All")

  // Fetch ALL songs (DB + Local)
  const { data: dbSongs, isLoading: isLoadingReleases } = useQuery({
    queryKey: ['all-songs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map((song: any) => {
        let audioUrl = song.audio_path
        if (song.audio_path?.startsWith('http') || song.audio_path?.startsWith('/')) {
          audioUrl = song.audio_path
        } else {
          audioUrl = supabase.storage.from('songs').getPublicUrl(song.audio_path).data.publicUrl
        }

        let coverUrl = song.cover_url || getCoverArt({ title: song.title })

        if (song.image_path) {
          if (song.image_path.startsWith('http') || song.image_path.startsWith('/')) {
            coverUrl = song.image_path
          }
        }

        return {
          id: song.id,
          title: song.title,
          artist: song.artist || (song.title.includes("Mga Isla") ? "Team Ekko (Special)" : "Team Ekko"),
          isSpecial: song.title.includes("Mga Isla"),
          duration: song.duration,
          audio_path: song.audio_path,
          audioUrl: audioUrl,
          coverUrl: coverUrl,
          source: 'db'
        }
      })
    }
  })

  const [allSongs, setAllSongs] = useState<any[]>([])

  useEffect(() => {
    if (dbSongs) {
      // Merge Static Songs
      const formattedStatic = STATIC_SONGS.map(s => ({
        ...s,
        coverUrl: s.coverUrl || getCoverArt({ title: s.title })
      }))

      // Merge Local Songs from localStorage
      let localSongs: any[] = []
      try {
        const localSongsRaw = localStorage.getItem('ekko_local_songs')
        if (localSongsRaw) {
          const parsed = JSON.parse(localSongsRaw)
          localSongs = parsed.map((s: any) => ({
            ...s,
            source: 'local',
            isSpecial: false,
            coverUrl: s.coverUrl || getCoverArt({ title: s.title })
          }))
        }
      } catch (_e) {
        console.error("Failed to load local songs", _e)
      }

      // Priority order: DB songs first, then static, then local
      const merged = [...dbSongs, ...formattedStatic, ...localSongs]

      // De-duplicate by Normalized Title
      const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '')
      const seen = new Set<string>()
      const unique = merged.filter(s => {
        const key = normalize(s.title)
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })

      setTimeout(() => setAllSongs(unique), 0)
    }
  }, [dbSongs])

  const recommendedSongs = allSongs.slice(0, 6)
  const newReleases = allSongs.slice(0, 8)
  const recentSongs = allSongs.slice(8, 14)

  return (
    <div className="p-8 pt-6 font-geist-sans relative min-h-full pb-24">
      <FloatingParticles count={25} />

      {/* ═══════════════════════════════════════════════════ */}
      {/* 🎯 HERO SECTION — 3D Cover Flow                     */}
      {/* ═══════════════════════════════════════════════════ */}
      {/* HERO SECTION — Muizes Style Banner */}
      <section className="mb-12 relative z-10">
        <HeroBanner items={HERO_SLIDES} />
      </section>

      {/* Categories & Content */}
      <div className="space-y-12 relative z-10">
        <CategoryPills
          categories={["All", "Relax", "Sad", "Party", "Romance", "Energize"]}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <SongRow title="Recommended for You" songs={recommendedSongs} />
        <SongRow title="New Releases" songs={newReleases} />
        <SongRow title="Jump Back In" songs={recentSongs} />
        <SongRow title="Team Ekko Hits" songs={allSongs.filter(s => s.artist.includes("Ekko"))} />
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 🏃 MARQUEE ARTISTS                                  */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="mb-16 relative z-10 overflow-hidden">
        <h2 className="text-2xl md:text-3xl font-black mb-8 tracking-tight text-white/90 flex items-center gap-3">
          <span className="bg-ekko-500 w-1.5 h-6 rounded-full" />
          Popular Artists
        </h2>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

          <Marquee pauseOnHover className="[--duration:40s]">
            {FEATURED_ARTISTS.map((artist) => (
              <div
                key={artist.id}
                className="mx-4 flex flex-col items-center gap-4 cursor-pointer group"
              >
                <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-gradient-to-br ${artist.gradient} group-hover:scale-105 transition-all duration-500 shadow-xl`}>
                  <div className="w-full h-full rounded-full overflow-hidden bg-neutral-900 border-4 border-black relative">
                    <Image
                      src={artist.avatarUrl}
                      alt={artist.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      unoptimized
                    />
                  </div>
                </div>
                <span className="text-sm md:text-base font-bold text-white/80 group-hover:text-white transition-colors tracking-wide uppercase">
                  {artist.name}
                </span>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 🎵 LATEST DROPS (Grid)                              */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="mb-12 relative z-10">
        <h2 className="text-3xl font-black mb-8 tracking-tight text-white/90 drop-shadow-md">
          Latest Drops
        </h2>

        {isLoadingReleases ? (
          <SongGridSkeleton count={10} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {allSongs?.map((song: any, i: number) => {
              const CardContent = (
                <div
                  role="button"
                  tabIndex={0}
                  className={`glass-card p-4 rounded-none group cursor-pointer h-full transition-all duration-500 hover:scale-[1.02] hover:bg-white/5 border border-white/5 hover:border-white/10`}
                  onClick={() => setQueue(allSongs, i)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setQueue(allSongs, i) } }}
                >
                  <div className="relative aspect-square w-full mb-4 bg-neutral-900 shadow-2xl overflow-hidden rounded-none">
                    <Image
                      src={song.coverUrl}
                      alt={song.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      unoptimized
                    />

                    {song.isSpecial && (
                      <div className="absolute top-0 right-0 bg-ekko-500 text-white text-[10px] uppercase font-black px-3 py-1.5 z-20 rounded-none shadow-lg">
                        Special
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

                    <div className="absolute bottom-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
                      <Button size="icon" className={`rounded-full text-white shadow-xl h-12 w-12 border-none ${song.isSpecial ? 'bg-ekko-400 hover:bg-ekko-300' : 'bg-ekko-500 hover:bg-ekko-400'}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (isPlaying && currentSong?.id === song.id) {
                            togglePlay()
                          } else {
                            setQueue(allSongs, i)
                          }
                        }}
                      >
                        {isPlaying && currentSong?.id === song.id ? (
                          <Pause className="fill-white w-5 h-5" />
                        ) : (
                          <Play className="fill-white w-5 h-5 ml-1" />
                        )}
                      </Button>
                    </div>

                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20" onClick={(e) => e.stopPropagation()}>
                      <MediaItemActionMenu
                        songId={song.id}
                        songTitle={song.title}
                        className="h-8 w-8 hover:bg-black/50 text-white rounded-full transition-colors"
                      />
                    </div>
                  </div>
                  <h3 className={`font-bold truncate text-base tracking-tight ${song.isSpecial ? 'text-ekko-400' : 'text-white/90'}`}>{song.title}</h3>
                  <p className="text-xs text-neutral-400 truncate mt-1 font-medium group-hover:text-neutral-300 transition-colors">{song.artist}</p>
                </div>
              )

              return (
                <SongContextMenu key={song.id} songId={song.id} songTitle={song.title} songIndex={i} songs={allSongs}>
                  <div className="h-full">{CardContent}</div>
                </SongContextMenu>
              )
            })}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 📈 Curated Genres (Using MagicCard)                 */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="mb-24 relative z-10">
        <h2 className="text-2xl font-black mb-6 tracking-tight text-white/90 flex items-center gap-3">
          <span className="bg-ekko-500 w-1.5 h-6 rounded-full" />
          Curated Genres
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: "Pop", gradient: "from-ekko-400 to-ekko-600", icon: Star },
            { name: "Chill", gradient: "from-ekko-500 to-ekko-700", icon: Coffee },
            { name: "Indie", gradient: "from-ekko-300 to-ekko-500", icon: Flower2 },
            { name: "Lo-Fi", gradient: "from-ekko-600 to-ekko-800", icon: Headphones },
            { name: "Future", gradient: "from-ekko-700 to-ekko-950", icon: Zap },
            { name: "Jazz", gradient: "from-slate-700 to-slate-900", icon: Music }
          ].map((genre) => (
            <MagicCard
              key={genre.name}
              gradientColor="#6366F1"
              className="h-32 rounded-none cursor-pointer border-white/5"
            >
              <div
                className={`relative h-full overflow-hidden group`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${genre.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                <genre.icon className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 -rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-all duration-700" />
                <div className="relative z-10 p-4 h-full flex items-end">
                  <h3 className="text-lg font-bold text-white tracking-tight">{genre.name}</h3>
                </div>
              </div>
            </MagicCard>
          ))}
        </div>
      </section>
    </div>
  )
}
