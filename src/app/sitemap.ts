import type { MetadataRoute } from 'next'

import { forbiddenProfiles } from '@/configs/forbidden-profiles'
import { pathsSitemap } from '@/configs/paths-to-sitemap'

import { getAllProfileData } from './server/get-all-profile-data'
import { getAllPropertiesData } from './server/get-all-properties-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://carangoladigital.com.br'
  const lastModified = new Date().toISOString()

  const profiles = await getAllProfileData()
  const properties = await getAllPropertiesData()

  const allowedProfiles = profiles?.filter(profile => {
    const profileIdNormalized = profile.profileId.toLowerCase()
    return !forbiddenProfiles.includes(profileIdNormalized)
  })

  const dynamicProfilesEntries: MetadataRoute.Sitemap[number][] =
    allowedProfiles?.map(profile => ({
      url: `${siteUrl}/business/${profile.profileId}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    })) || []

  const dynamicPropertiesEntries: MetadataRoute.Sitemap[number][] =
    properties?.map(property => ({
      url: `${siteUrl}/imoveis/${property.id}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    })) || []

  const staticEntries: MetadataRoute.Sitemap[number][] = pathsSitemap.map(
    path => ({
      url: `${siteUrl}${path}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    })
  )

  return [
    ...staticEntries,
    ...dynamicProfilesEntries,
    ...dynamicPropertiesEntries,
  ]
}
