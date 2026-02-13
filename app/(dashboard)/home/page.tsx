'use client'

import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { usePlayer } from "@/store/player-store"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { useEffect, useState } from "react"
import { MediaItemActionMenu } from "@/components/media/media-item-action-menu"
import { getCoverArt, PLAYLIST_COVERS } from "@/lib/cover-art"

import { TurntableLoader } from "@/components/ui/turntable-loader"

function GreetingComponent() {
  const [greeting, setGreeting] = useState("")
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const updateGreeting = async () => {
      const hour = new Date().getHours()
      let g = "Welcome"
      if (hour >= 5 && hour < 12) g = "Good morning"
      else if (hour >= 12 && hour < 17) g = "Good afternoon"
      else if (hour >= 17 && hour < 21) g = "Good evening"
      else g = "Good night"
      setGreeting(g)

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()

        const name = profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0]
        if (name) setUserName(name)
      }
    }

    updateGreeting()
  }, [])

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {greeting}{userName ? `, ${userName}` : ""}
      </h1>
      <p className="text-neutral-400 text-sm mt-1 font-geist-mono">Ready for some music?</p>
    </div>
  )
}

export default function Home() {
  const { setQueue } = usePlayer()

  // Fetch some "New Releases" (latest songs)
  const { data: newReleases, isLoading: isLoadingReleases } = useQuery({
    queryKey: ['new-releases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) throw error

      // Signed URLs batch or local paths & uploaded paths
       

      const fetchedSongs = await Promise.all(data.map(async (song: any) => {
        let audioUrl = ""
        // If it's a full URL (uploaded song), use it directly
        if (song.audio_path?.startsWith('http')) {
          audioUrl = song.audio_path
        }
        // If it's a local path (seed data), use it directly 
        else if (song.audio_path?.startsWith('/')) {
          audioUrl = song.audio_path
        } else {
          // Fallback legacy behavior: if it's a path in storage but not full URL
          const { data } = await supabase.storage.from('songs').createSignedUrl(song.audio_path, 3600)
          audioUrl = data?.signedUrl || ""
        }

        return {
          id: song.id,
          title: song.title,
          artist: song.artist || (song.title.includes("Mga Isla") ? "Team Ekko (Special)" : "Team Ekko"),
          isSpecial: song.title.includes("Mga Isla"),
          duration: song.duration,
          audio_path: song.audio_path,
          audioUrl: audioUrl,
          coverUrl: song.image_path?.startsWith('http') ? song.image_path : getCoverArt({ title: song.title, coverUrl: song.cover_url })
        }
      }))

      // Define all local songs to guarantee presence
      // Filenames based on verified public/music directory listing
      const LOCAL_SONGS = [
        {
          title: "Mga Isla Sa Gitna Natin",
          file: "Mga Isla Sa Gitna Natin.mp3",
          artist: "Team Ekko (Special)",
          special: true,
          cover: "/cover-mga-isla.png"
        },
        {
          title: "Poblacion 3 Groove",
          file: "Poblacion 3 Groove.mp3",
          artist: "Team Ekko",
          special: false,
          cover: "/cover-pablacion-3-groove.png"
        },
        {
          title: "Si Jai sa Store",
          file: "Si Jai sa Store.mp3",
          artist: "Team Ekko",
          special: false,
          cover: "/cover-si-jai.png"
        },
        {
          title: "Sumasayaw Siya Sa Lahat",
          file: "Sumasayaw Siya Sa Lahat (She Dances Through It All).mp3",
          artist: "Team Ekko",
          special: false,
          cover: "/cover-sumasayaw.png"
        },
        {
          title: "Dito sa Tiaong",
          file: "Dito sa Tiaong.mp3",
          artist: "Team Ekko",
          special: false,
          cover: "/cover-dito-sa-tiaong.png"
        },
        {
          title: "Groove ni Chele",
          file: "Groove ni Chele.mp3",
          artist: "Team Ekko",
          special: false,
          cover: "/cover-groove-ni-chele.png"

        },
        {
          title: "Kapag Muli Kang Nahanap ng Araw",
          file: "Kapag Muli Kang Nahanap ng Araw.mp3",
          artist: "Team Ekko",
          special: false,
          cover: "/cover-kapag-muli-kang-nahanap-ng-araw.png"
        }
      ]

      // Merge: For each local song, if not already in fetchedSongs (by title or audio path), add it.
      const specialTitle = "Mga Isla Sa Gitna Natin"
      const finalSongs = [...fetchedSongs]

      for (const local of LOCAL_SONGS) {
        // Exact title match (case-insensitive) or file path match
        const normalizedLocalTitle = local.title.toLowerCase().trim()
        const exists = finalSongs.some(s =>
          s.title.toLowerCase().trim() === normalizedLocalTitle ||
          s.audio_path?.endsWith(local.file)
        )

        if (!exists) {
          finalSongs.unshift({
            id: `local-${local.file}`,
            title: local.title,
            artist: local.artist,
            isSpecial: local.title.includes(specialTitle), // Ensure logic holds
            duration: 180, // Default duration if local
            audio_path: `/music/${local.file}`,
            audioUrl: `/music/${local.file}`,
            coverUrl: (local as any).cover || getCoverArt({ title: local.title })
          })
        }
      }

      // Ensure "Mga Isla" is marked special if it came from DB
      return finalSongs.map(s => ({
        ...s,
        isSpecial: s.title.includes("Mga Isla")
      }))
    }
  })

  return (
    <div className="p-8 pt-4 font-geist-mono">
      <GreetingComponent />

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">New Releases</h2>
        {isLoadingReleases ? (
          <div className="flex justify-center py-12">
            <TurntableLoader size="lg" showText />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {newReleases?.map((song: any, i: number) => (
              <div
                key={song.id}
                className={`glass-card p-4 rounded-md group cursor-pointer hover:scale-[1.02] transition-all ${song.isSpecial ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'glow-teal'}`}
                onClick={() => setQueue(newReleases, i)} // Correct: uses array reference
              >
                <div className="relative aspect-square w-full mb-4 bg-neutral-900 shadow-md overflow-hidden rounded-sm">
                  {/* Cover Art */}
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110"
                  />

                  {/* Special Overlay */}
                  {song.isSpecial && (
                    <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] uppercase font-bold px-2 py-0.5 z-20">
                      Special Feature
                    </div>
                  )}

                  {/* Hover Play Button */}
                  <div className="absolute bottom-2 right-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all z-10">
                    <Button size="icon" className={`rounded-full text-black shadow-lg h-10 w-10 ${song.isSpecial ? 'bg-yellow-500 hover:bg-yellow-400' : 'bg-green-500 hover:bg-green-400'}`}>
                      <Play className="fill-black w-5 h-5 ml-0.5" />
                    </Button>
                  </div>

                  {/* Action Menu */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20" onClick={(e) => e.stopPropagation()}>
                    <MediaItemActionMenu
                      songId={song.id}
                      songTitle={song.title}
                      artistName={song.artist}
                      className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm"
                    />
                  </div>
                </div>
                <h3 className={`font-bold truncate ${song.isSpecial ? 'text-yellow-400' : ''}`}>{song.title}</h3>
                <p className="text-sm text-neutral-400 truncate mt-1">{song.artist}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Made For You</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Daily Mix Card */}
          <div
            className="relative overflow-hidden border border-white/5 bg-neutral-900 rounded-md h-64 flex flex-col justify-end group cursor-pointer hover:scale-[1.02] transition-all shadow-lg glow-teal"
            onClick={() => window.location.href = '/mix/daily'}
          >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={PLAYLIST_COVERS.dailyMix}
                alt="Daily Mix"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            {/* Turntable Animation Accent */}
            <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none z-0">
              <TurntableLoader size="md" />
            </div>

            <div className="relative z-10 p-4 mb-2">
              <h3 className="text-3xl font-bold tracking-tighter">Daily Mix 1</h3>
              <p className="text-emerald-100 font-medium line-clamp-2">New releases mixed just for you.</p>
            </div>
            <div className="absolute bottom-4 right-4 z-20 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-visible duration-300">
              <Button size="icon" className="rounded-full bg-neon-teal hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(20,241,149,0.6)] h-12 w-12 border-none"
                onClick={(e) => {
                  e.stopPropagation()
                  if (newReleases) {
                    const shuffled = [...newReleases].sort(() => 0.5 - Math.random())
                    setQueue(shuffled)
                  }
                }}
              >
                <Play className="fill-black w-6 h-6 ml-1" />
              </Button>
            </div>
          </div>


          <div className="relative overflow-hidden border border-white/5 bg-neutral-900 rounded-md h-64 flex flex-col justify-end group cursor-pointer hover:scale-[1.02] transition-all shadow-lg glow-purple opacity-90 hover:opacity-100">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={PLAYLIST_COVERS.discover}
                alt="Discover Weekly"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            <div className="relative z-10 p-4 mb-2">
              <h3 className="text-3xl font-bold tracking-tighter">Discover Weekly</h3>
              <p className="text-indigo-100 font-medium">New music update every Monday.</p>
            </div>
          </div>
        </div>
      </section >

      <section className="mb-8">
        <div className="relative overflow-hidden glass-card rounded-xl h-48 md:h-64 flex items-center group cursor-pointer hover:scale-[1.01] transition-all border-none bg-neutral-900">
          {/* Illustration Background */}
          <div className="absolute inset-0 z-0">
            <img
              src="/digital-village.png"
              alt="Community"
              className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          </div>

          <div className="relative z-10 p-8 flex flex-col md:flex-row items-center justify-between w-full">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">Live Now</span>
              </div>
              <h3 className="text-4xl font-extrabold tracking-tighter text-white glow-text text-shadow-glow">EKKO_LIVE_RADIO</h3>
              <div className="flex items-center gap-4 text-neutral-400 text-sm">
                <div className="flex items-center gap-1">
                  <div className="flex -space-x-2 mr-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <span className="font-bold text-white">1,204 Listeners</span>
                  <span className="mx-1">•</span>
                  <span>Active section</span>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="mt-6 md:mt-0 rounded-full bg-white text-black hover:bg-neutral-200 px-8 font-bold h-12 shadow-[0_0_20px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform"
              onClick={(e) => {
                e.stopPropagation()
                const { isRadio, toggleRadio } = usePlayer.getState()
                if (!isRadio) toggleRadio()
              }}
            >
              Join Session
            </Button>
          </div>

          {/* Decorative element */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Browse Genres</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: "Pop", gradient: "from-pink-500 to-rose-500" },
            { name: "Hip-Hop", gradient: "from-orange-500 to-red-500" },
            { name: "Indie", gradient: "from-yellow-400 to-orange-500" },
            { name: "Electronic", gradient: "from-green-400 to-emerald-600" },
            { name: "R&B", gradient: "from-blue-400 to-indigo-500" },
            { name: "Rock", gradient: "from-red-600 to-pink-600" },
            { name: "K-Pop", gradient: "from-purple-400 to-pink-400" },
            { name: "Jazz", gradient: "from-indigo-400 to-blue-600" }
          ].map((genre) => (
            <div
              key={genre.name}
              className={`relative h-32 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform shadow-lg group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${genre.gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />
              <div className="relative z-10 p-4 h-full flex items-start justify-start">
                <h3 className="text-xl font-bold text-white tracking-tight">{genre.name}</h3>
              </div>
              {/* Decorative Circle */}
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/20 rounded-full blur-xl transform group-hover:scale-150 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Your Playlists</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="glass-card hover:bg-white/5 transition-colors p-4 rounded-md h-20 flex items-center justify-center font-bold text-neutral-500 border-dashed border-neutral-700">
            Create more playlists in your library
          </div>
        </div>
      </section>
    </div>
  )
}
