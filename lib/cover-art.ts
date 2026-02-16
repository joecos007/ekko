export function getCoverArt(song: { title: string; coverUrl?: string; artist?: string }) {
    if (!song) return "/globe.svg"

    const titleLower = song.title.toLowerCase()

    // Map specific songs to their local covers
    // Map specific songs to their local covers
    if (titleLower.includes("mga isla")) return "/song-cover/mga-isla-sa-gitna-natin.png"
    if (titleLower.includes("si jai")) return "/song-cover/si-jai.png"
    if (titleLower.includes("sumasayaw")) return "/song-cover/sumasayaw-siya-sa-lahat.png"
    if (titleLower.includes("dito sa tiaong")) return "/song-cover/dito-sa-tiaong.png"
    if (titleLower.includes("poblacion") || titleLower.includes("pablacion")) return "/song-cover/poblacion-3-groove.jpeg"
    if (titleLower.includes("groove ni chele")) return "/song-cover/groove-ni-chele.png"
    if (titleLower.includes("kapag muli")) return "/song-cover/kapag-muli-kang-nahanap-ng-araw.png"
    if (titleLower.includes("sa muling pagsikat")) return "/song-cover/sa-muling-pagsikat.png"
    if (titleLower.includes("sarap ng buhay")) return "/song-cover/sarap-ng-buhay.png"
    if (titleLower.includes("uwian na")) return "/song-cover/uwian-na.png"

    // Fallback to existing coverUrl if available
    if (song.coverUrl && song.coverUrl.length > 0) return song.coverUrl

    // Default fallback
    return "/globe.svg"
}

export const PLAYLIST_COVERS = {
    dailyMix: "/playlist-daily-mix.png",
    discover: "/playlist-discover.png",
    liked: "/playlist-liked.png",
}
