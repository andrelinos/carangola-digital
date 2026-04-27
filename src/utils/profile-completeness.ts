import type { ProfileDataProps } from '@/_types/profile-data'

export interface CompletenessItem {
  label: string
  score: number
  isComplete: boolean
  actionUrl?: string
}

export interface CompletenessResult {
  totalScore: number
  items: CompletenessItem[]
}

export function calculateProfileCompleteness(profile: ProfileDataProps): CompletenessResult {
  const items: CompletenessItem[] = [
    {
      label: 'Descrição da empresa',
      score: 20,
      isComplete: !!profile.businessDescription && profile.businessDescription.length > 20,
    },
    {
      label: 'Categoria',
      score: 10,
      isComplete: !!profile.category || (!!profile.categories && profile.categories.length > 0),
    },
    {
      label: 'Logo da empresa',
      score: 15,
      isComplete: !!profile.logoImagePath || !!profile.logoImageUrl,
    },
    {
      label: 'Imagem de capa',
      score: 15,
      isComplete: !!profile.coverImagePath || !!profile.coverImageUrl,
    },
    {
      label: 'Telefones de contato',
      score: 10,
      isComplete: !!profile.businessPhones && profile.businessPhones.length > 0,
    },
    {
      label: 'Endereços',
      score: 10,
      isComplete: !!profile.businessAddresses && profile.businessAddresses.length > 0,
    },
    {
      label: 'Redes sociais',
      score: 5,
      isComplete: !!profile.socialMedias && Object.values(profile.socialMedias).some(v => !!v),
    },
    {
      label: 'Horário de funcionamento',
      score: 15,
      isComplete: !!profile.openingHours && Object.keys(profile.openingHours).length > 0,
    },
  ]

  const totalScore = items.reduce((acc, item) => (item.isComplete ? acc + item.score : acc), 0)

  return {
    totalScore,
    items,
  }
}
