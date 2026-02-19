import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ekko.app'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/home', '/library', '/profile', '/liked', '/vibes', '/playlist/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
