'use client'

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/utils/supabase/client"
import { usePlayer } from "@/store/player-store"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Play, Star, Coffee, Flower2, Headphones, Zap, Music, Pause } from "lucide-react"
import { useEffect, useState } from "react"
import { MediaItemActionMenu } from "@/components/media/media-item-action-menu"
import { getCoverArt, PLAYLIST_COVERS } from "@/lib/cover-art"

import { TurntableLoader } from "@/components/ui/turntable-loader"
import { ElectricBorder } from "@/components/ui/electric-border"
import { FloatingParticles } from "@/components/ui/floating-particles"
import { STATIC_SONGS } from "@/lib/static-music"
import { useRouter } from "next/navigation"

// Magic UI Components
import { MagicCard } from "@/components/ui/magic-card"
import { TextAnimate } from "@/components/ui/text-animate"
import { HyperText } from "@/components/ui/hyper-text"
import { WordRotate } from "@/components/ui/word-rotate"

// New Enhanced Components
import { FeaturedCarousel } from "@/components/home/featured-carousel"
import { ArtistPills } from "@/components/home/artist-pills"
import { TrendingSection } from "@/components/home/trending-section"
import { RecentlyPlayed } from "@/components/home/recently-played"

export default function Home() {
  const router = useRouter()
  const supabase = createClient()
  const { isPlaying, queue, currentIndex, togglePlay, setQueue } = usePlayer()
  const currentSong = queue[currentIndex]

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
      let merged = [...dbSongs]

      // Merge Local Songs
      try {
        const localSongsRaw = localStorage.getItem('ekko_local_songs')
        if (localSongsRaw) {
          const parsed = JSON.parse(localSongsRaw)
          const formattedLocal = parsed.map((s: any) => ({
            ...s,
            source: 'local',
            isSpecial: false,
            coverUrl: s.coverUrl || getCoverArt({ title: s.title })
          }))
          merged = [...formattedLocal, ...merged]
        }
      } catch (_e) {
        console.error("Failed to load local songs", _e)
      }

      // Merge Static Songs
      const formattedStatic = STATIC_SONGS.map(s => ({
        ...s,
        coverUrl: s.coverUrl || getCoverArt({ title: s.title })
      }))

      merged = [...dbSongs || [], ...formattedStatic, ...merged.filter(s => s.source === 'local')]

      // De-duplicate by Normalized Title
      const seen = new Set()
      const unique = merged.filter(s => {
        const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '')
        const key = normalize(s.title)
        const duplicate = seen.has(key)
        seen.add(key)
        return !duplicate
      })

      setTimeout(() => setAllSongs(unique), 0)
    }
  }, [dbSongs])

  return (
    <div className="p-8 pt-6 font-geist-sans relative min-h-full">
      <FloatingParticles count={25} />

      {/* ═══════════════════════════════════════════════════ */}
      {/* 🎯 FEATURED CAROUSEL — Auto-rotating hero section */}
      {/* ═══════════════════════════════════════════════════ */}
      <FeaturedCarousel allSongs={allSongs} />

      {/* ═══════════════════════════════════════════════════ */}
      {/* Quick Access Row                                    */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="mb-8 relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Liked Songs", href: "/liked", icon: "♥", color: "bg-gradient-to-br from-purple-700 to-blue-600" },
          { label: "Daily Mix", href: "/mix/daily", icon: "♫", color: "bg-gradient-to-br from-emerald-600 to-teal-500" },
          { label: "On Repeat", href: "/playlist/repeat", icon: "↺", color: "bg-gradient-to-br from-orange-500 to-red-500" },
          { label: "Radio", href: "/radio", icon: "📻", color: "bg-gradient-to-br from-blue-600 to-indigo-600" }
        ].map((item) => (
          <MagicCard
            key={item.label}
            gradientColor={item.label === 'Liked Songs' ? '#7c3aed' : item.label === 'Daily Mix' ? '#059669' : item.label === 'On Repeat' ? '#ea580c' : '#4f46e5'}
            className="cursor-pointer"
          >
            <div
              onClick={() => router.push(item.href)}
              className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.02]"
            >
              <div className={`h-16 w-16 flex items-center justify-center text-xl font-bold text-white shadow-lg ${item.color}`}>
                {item.icon}
              </div>
              <span className="font-bold text-white/90 text-sm">{item.label}</span>
            </div>
          </MagicCard>

        ))}
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 🎤 POPULAR ARTISTS — Horizontal scroll pills        */}
      {/* ═══════════════════════════════════════════════════ */}
      <ArtistPills />

      {/* ═══════════════════════════════════════════════════ */}
      {/* 🔥 TRENDING NOW — Ranked list with engagement       */}
      {/* ═══════════════════════════════════════════════════ */}
      {allSongs.length > 0 && <TrendingSection songs={allSongs} />}

      {/* ═══════════════════════════════════════════════════ */}
      {/* 🕒 RECENTLY PLAYED — Grid with quick actions        */}
      {/* ═══════════════════════════════════════════════════ */}
      {allSongs.length > 0 && <RecentlyPlayed songs={[...allSongs].reverse()} />}

      {/* ═══════════════════════════════════════════════════ */}
      {/* 🎵 LATEST DROPS — Full song grid                    */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="mb-12 relative z-10">
        <TextAnimate animation="blurInUp" by="word" as="h2" className="text-3xl font-black mb-8 tracking-tight text-white/90 drop-shadow-md">
          Latest Drops
        </TextAnimate>

        {isLoadingReleases ? (
          <div className="flex flex-col items-center justify-center py-12">
            <WordRotate className="text-lg font-bold text-neutral-400" words={["Loading Beats...", "Syncing Vibes...", "Tuning In..."]} />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
            {allSongs?.map((song: any, i: number) => {
              const CardContent = (
                <div
                  className={`glass-card p-4 md:p-5 rounded-2xl group cursor-pointer h-full transition-all duration-500 hover:scale-[1.03] hover:shadow-glow-blue ${!song.isSpecial ? 'hover:bg-white/10' : ''}`}
                  onClick={() => setQueue(allSongs, i)}
                >
                  <div className="relative aspect-square w-full mb-5 bg-neutral-900 shadow-2xl overflow-hidden rounded-xl border border-white/5">
                    <Image
                      src={song.coverUrl}
                      alt={song.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      unoptimized
                    />

                    {song.isSpecial && (
                      <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] uppercase font-black px-3 py-1.5 z-20 rounded-bl-xl shadow-lg">
                        Special
                      </div>
                    )}

                    {song.source === 'local' && (
                      <div className="absolute top-0 left-0 bg-emerald-600/80 backdrop-blur-md text-white text-[9px] uppercase font-black px-2 py-1 z-20 rounded-br-lg shadow-lg">
                        Local
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
                      <Button size="icon" className={`rounded-full text-white shadow-glow-blue h-14 w-14 border-none ${song.isSpecial ? 'bg-blue-500 hover:bg-blue-400' : 'bg-blue-600 hover:bg-blue-500'}`}
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
                          <Pause className="fill-white w-7 h-7" />
                        ) : (
                          <Play className="fill-white w-7 h-7 ml-1" />
                        )}
                      </Button>
                    </div>

                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20" onClick={(e) => e.stopPropagation()}>
                      <MediaItemActionMenu
                        songId={song.id}
                        songTitle={song.title}
                        artistName={song.artist}
                        className="h-9 w-9 hover:bg-white/10 text-white rounded-full transition-colors"
                      />
                    </div>
                  </div>
                  <h3 className={`font-bold truncate text-lg tracking-tight ${song.isSpecial ? 'text-blue-400 glow-text-blue' : 'text-white/90'}`}>{song.title}</h3>
                  <p className="text-sm text-blue-200/50 truncate mt-1 font-medium group-hover:text-blue-200/70 transition-colors">{song.artist}</p>
                </div>
              )

              // if (song.isSpecial) {
              //   return (
              //     <ElectricBorder key={song.id} color="#60A5FA" speed={2} chaos={0.3} className="h-full rounded-2xl">
              //       {CardContent}
              //     </ElectricBorder>
              //   )
              // }

              return <div key={song.id} className="h-full">{CardContent}</div>
            })}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* Made For You                                        */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="mb-12 relative z-10">
        <h2 className="text-2xl font-black mb-6 tracking-tight text-white/90 flex items-center gap-3">
          <span className="bg-purple-600 w-1.5 h-6 rounded-full" />
          Made For You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Daily Mix Card */}
          <div
            className="relative overflow-hidden glass-card rounded-2xl h-64 flex flex-col justify-end group cursor-pointer hover:scale-[1.02] transition-all duration-500 shadow-2xl"
            onClick={() => router.push('/mix/daily')}
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={PLAYLIST_COVERS.dailyMix}
                alt="Daily Mix"
                fill
                className="object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none z-0">
              <TurntableLoader size="md" />
            </div>

            <div className="relative z-10 p-6 mb-2">
              <h3 className="text-4xl font-black tracking-tighter text-white">Daily Mix 1</h3>
              <p className="text-blue-200/60 font-medium text-sm mt-1 line-clamp-2">New releases mixed just for you.</p>
            </div>
            <div className="absolute bottom-6 right-6 z-20 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <Button size="icon" className="rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-glow-blue h-14 w-14 border-none"
                onClick={(e) => {
                  e.stopPropagation()
                  if (allSongs.length > 0) {
                    const shuffled = [...allSongs].sort(() => 0.5 - Math.random())
                    setQueue(shuffled)
                  }
                }}
              >
                <Play className="fill-white w-7 h-7 ml-1" />
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden glass-card rounded-2xl h-64 flex flex-col justify-end group cursor-pointer hover:scale-[1.02] transition-all duration-500 shadow-2xl opacity-90 hover:opacity-100">
            <div className="absolute inset-0 z-0">
              <Image
                src={PLAYLIST_COVERS.discover}
                alt="Discover Weekly"
                fill
                className="object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            <div className="relative z-10 p-6 mb-2">
              <h3 className="text-4xl font-black tracking-tighter text-white">Discover</h3>
              <p className="text-blue-200/60 font-medium text-sm mt-1">New music update every Monday.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* Live Session Banner                                 */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="mb-12 relative z-10">
        <div className="relative overflow-hidden glass-card rounded-3xl h-56 md:h-72 flex items-center group cursor-pointer hover:scale-[1.01] transition-all duration-500 overflow-hidden border-white/5">
          <div className="absolute inset-0 z-0">
            <Image
              src="/digital-village.png"
              alt="Community"
              fill
              className="object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-700"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[120px] rounded-full animate-pulse-glow" />
          </div>

          <div className="relative z-10 p-10 flex flex-col md:flex-row items-center justify-between w-full">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-glow-destructive" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400/80">Live Session</span>
              </div>
              <HyperText className="text-5xl font-black tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]" animateOnHover startOnView>EKKO_SESSION_01</HyperText>
              <div className="flex items-center gap-4 text-blue-200/40 text-sm mt-1 font-medium">
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-2 mr-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
                        <Image
                          src={`https://i.pravatar.cc/100?u=10`}
                          alt="Profile"
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                  <span className="font-bold text-white/80">1,204 Listeners</span>
                  <span className="mx-2 opacity-50">•</span>
                  <span className="tracking-wide">Global Feed</span>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="mt-8 md:mt-0 rounded-full bg-white text-black hover:bg-blue-50 px-10 font-bold h-14 shadow-[0_0_30px_rgba(255,255,255,0.15)] group-hover:scale-105 transition-all duration-300 active:scale-95"
              onClick={(e) => {
                e.stopPropagation()
                const { isRadio, toggleRadio } = usePlayer.getState()
                if (!isRadio) toggleRadio()
              }}
            >
              Join the Groove
            </Button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════ */}
      {/* 🎹 Curated Genres                                   */}
      {/* ═══════════════════════════════════════════════════ */}
      <section className="mb-12 relative z-10">
        <h2 className="text-2xl font-black mb-6 tracking-tight text-white/90 flex items-center gap-3">
          <span className="bg-emerald-500 w-1.5 h-6 rounded-full" />
          Curated Genres
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {[
            { name: "Pop", gradient: "from-blue-500 to-indigo-600", icon: Star },
            { name: "Chill", gradient: "from-indigo-500 to-purple-600", icon: Coffee },
            { name: "Indie", gradient: "from-blue-400 to-blue-600", icon: Flower2 },
            { name: "Lo-Fi", gradient: "from-cyan-500 to-blue-500", icon: Headphones },
            { name: "Future", gradient: "from-indigo-600 to-blue-700", icon: Zap },
            { name: "Jazz", gradient: "from-slate-700 to-slate-900", icon: Music }
          ].map((genre) => (
            <MagicCard
              key={genre.name}
              gradientColor={genre.name === 'Pop' ? '#3b82f6' : genre.name === 'Chill' ? '#6366f1' : genre.name === 'Indie' ? '#60a5fa' : genre.name === 'Lo-Fi' ? '#06b6d4' : genre.name === 'Future' ? '#4f46e5' : '#334155'}
              className="h-36 rounded-2xl cursor-pointer"
            >
              <div
                className={`relative h-full rounded-2xl overflow-hidden hover:scale-[1.08] transition-all duration-500 shadow-xl group border border-white/5`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${genre.gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
                <genre.icon className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 -rotate-12 group-hover:scale-110 group-hover:rotate-0 transition-all duration-700" />
                <div className="relative z-10 p-5 h-full flex items-start justify-start">
                  <h3 className="text-xl font-black text-white tracking-tighter drop-shadow-md">{genre.name}</h3>
                </div>
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl transform group-hover:scale-150 transition-transform duration-700" />
              </div>
            </MagicCard>
          ))}
        </div>
      </section>
    </div>
  )
}
