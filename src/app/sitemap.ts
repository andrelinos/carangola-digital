import { forbiddenProfiles } from '@/assets/data/forbidden-profiles'
import type { MetadataRoute } from 'next'
import { getAllProfileData } from './server/get-all-profile-data'
import { socialMedias } from './server/get-texts-by-slug'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://carangoladigital.com.br'
  const lastModified = new Date().toISOString()

  const profiles = await getAllProfileData()

  const socialMediasList: MetadataRoute.Sitemap = socialMedias.map(profile => ({
    url: `${siteUrl}/${profile}`,
    changeFrequency: 'monthly',
    priority: 0.5,
    lastModified,
  }))

  const allowedProfiles = profiles?.filter(profile => {
    const profileIdNormalized = profile.profileId.toLowerCase()
    return !forbiddenProfiles.includes(profileIdNormalized)
  })

  const dynamicEntries: MetadataRoute.Sitemap[number][] =
    allowedProfiles?.map(profile => ({
      url: `${siteUrl}/${profile.profileId}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    })) || []

  const staticEntries: MetadataRoute.Sitemap[number][] = [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]

  return [...staticEntries, ...socialMediasList, ...dynamicEntries]
}
