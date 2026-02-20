import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ekko.app'

    return [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/discover`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/platform`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/team`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/legal/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/legal/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    ]
}
