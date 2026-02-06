export function getCoverArt(song: { title: string; coverUrl?: string; artist?: string }) {
    if (!song) return "/images/music-placeholder.png"

    const titleLower = song.title.toLowerCase()

    // Map specific songs to their local covers
    if (titleLower.includes("mga isla")) return "/cover-mga-isla.png"
    if (titleLower.includes("si jai")) return "/cover-si-jai.png"
    if (titleLower.includes("sumasayaw")) return "/cover-sumasayaw.png"
    if (titleLower.includes("dito sa tiaong")) return "/cover-dito-sa-tiaong.png"
    if (titleLower.includes("groove ni chele")) return "/cover-groove-ni-chele.png"

    // Fallback to existing coverUrl if available
    if (song.coverUrl && song.coverUrl.length > 0) return song.coverUrl

    // Default fallback
    return "/images/music-placeholder.png"
}

export const PLAYLIST_COVERS = {
    dailyMix: "/playlist-daily-mix.png",
    discover: "/playlist-discover.png",
    liked: "/playlist-liked.png",
}
