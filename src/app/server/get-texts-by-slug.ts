import 'server-only'

export const socialMedias = [
  'instagram',
  'linkedin',
  'x',
  'facebook',
  'youtube',
]

export async function getTextsBySlug(slug: string) {
  for (const socialMedia of socialMedias) {
    const mediaSlug = `link-na-bio-para-${socialMedia}`
    if (slug === mediaSlug) {
      const capitalizeSocialMedia =
        socialMedia.charAt(0).toUpperCase() + socialMedia.slice(1)

      return {
        name: `Link na bio para ${capitalizeSocialMedia}`,
        description: `Divulgue seu negócio para todos no ${capitalizeSocialMedia}`,
        imagePath: '/images/og-image.png',
        totalVisits: 12356,
      }
    }
  }

  return undefined
}
