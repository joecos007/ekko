export const ARTIST_SLUGS: Record<string, string> = {
    'Team Ekko': 'team-ekko',
    'Chele': 'chele',
    'Jai': 'jai',
    'Tiaong Sound': 'tiaong-sound',
    'Isla Beats': 'isla-beats',
    'Pagsikat': 'pagsikat',
    'Uwian': 'uwian',
    'Poblacion': 'poblacion'
}

export const SLUG_TO_NAME: Record<string, string> = Object.fromEntries(
    Object.entries(ARTIST_SLUGS).map(([name, slug]) => [slug, name])
)

export function getArtistLink(name: string) {
    const slug = ARTIST_SLUGS[name]
    return slug ? `/artist/${slug}` : `/artist/${encodeURIComponent(name)}`
}
