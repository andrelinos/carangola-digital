import 'server-only'

export const socialMedias = [
  'instagram',
  'linkedin',
  'x',
  'facebook',
  'youtube',
  'google',
  'tiktok',
  'pinterest',
  'whatsapp',
] as const

export type SocialMedia = (typeof socialMedias)[number]

export interface SocialMediaText {
  name: string
  description: string
  imagePath: string
  totalVisits: number
}

/**
 * Retorna os textos e dados associados a um slug específico.
 * Se o slug corresponder ao padrão "link-na-bio-para-{socialMedia}", retorna
 * as informações associadas a essa social media. Caso contrário, retorna undefined.
 *
 * @param slug - O slug a ser verificado.
 * @returns Um objeto SocialMediaText ou undefined.
 */
export async function getTextsBySlug(
  slug: string
): Promise<SocialMediaText | undefined> {
  // Encontra a mídia social que corresponde ao slug fornecido.
  const matchedMedia = socialMedias.find(
    socialMedia => slug === `link-na-bio-para-${socialMedia}`
  )

  // Se nenhum slug válido for encontrado, retorna undefined.
  if (!matchedMedia) {
    return undefined
  }

  // Capitaliza o nome da mídia social.
  const capitalizeSocialMedia =
    matchedMedia.charAt(0).toUpperCase() + matchedMedia.slice(1)

  return {
    name: `Link na bio para ${capitalizeSocialMedia}`,
    description: `Divulgue seu negócio para todos no ${capitalizeSocialMedia}`,
    imagePath: '/images/og-image.png',
    totalVisits: 12356, // Valor estático - ajuste se necessário.
  }
}
