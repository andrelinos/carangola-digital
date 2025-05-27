import type { MetadataRoute } from 'next'
import { socialMedias } from './server/get-texts-by-slug'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://carangoladigital.com.br'

  const socialMediaEntries: MetadataRoute.Sitemap = socialMedias.map(media => ({
    url: `${siteUrl}/recursos/link-na-bio-para-${media}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]

  return [...staticEntries, ...socialMediaEntries]
}
