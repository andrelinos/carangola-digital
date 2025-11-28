import type { MetadataRoute } from 'next'

import { forbiddenPaths } from '@/configs/forbidden-paths'
import { forbiddenProfiles } from '@/configs/forbidden-profiles'
import { pathsSitemap } from '@/configs/paths-to-sitemap'

import { forbiddenProperties } from '@/configs/forbidden-properties'
import { getAllProfileData } from './server/get-all-profile-data'
import { getAllPropertiesData } from './server/get-all-properties-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://carangoladigital.com.br'
  const lastModified = new Date().toISOString()

  const profiles = await getAllProfileData()
  const properties = await getAllPropertiesData()

  const allowedProfiles = profiles?.filter(profile => {
    const profileIdNormalized = profile.slug
    return !forbiddenProfiles.includes(profileIdNormalized)
  })

  const dynamicProfilesEntries: MetadataRoute.Sitemap[number][] =
    allowedProfiles?.map(profile => ({
      url: `${siteUrl}/business/${profile.slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    })) || []

  const allowedProperties = properties?.filter(property => {
    return !forbiddenProperties.includes(property.slug)
  })

  const dynamicPropertiesEntries: MetadataRoute.Sitemap[number][] =
    allowedProperties?.map(property => ({
      url: `${siteUrl}/imoveis/${property.slug}`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    })) || []

  const allowedPaths = pathsSitemap.filter(path => {
    return !forbiddenPaths.includes(path)
  })

  const staticEntries: MetadataRoute.Sitemap[number][] = allowedPaths.map(
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
