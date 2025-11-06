import type { PlanConfigProps } from '@/configs/plans-real-estate'

export type ListingType = 'Venda' | 'Aluguel'

export type PropertyImage = {
  path: string
  url: string
}

export type AdminsProfileProps = {
  userId: string
  email: string
  name: string
}

export type characteristicsProps = {
  area: number
  bedrooms: number
  bathrooms: number
  garageSpots: number
}

export type PropertyProps = {
  id: string
  userId: string
  ownerId: string
  docPath: string
  slug: string
  planConfig: PlanConfigProps
  title: string
  thumbnail?: string
  description: string
  type: string
  listingType: ListingType
  status: string
  price: number
  admins: AdminsProfileProps[]

  address: string
  neighborhood: string
  cep: string
  latitude: number
  longitude: number
  city: string
  state: string

  characteristics: characteristicsProps

  yearBuilt?: number | null | undefined

  images: PropertyImage[]
  features: string[]

  isPublished: boolean
  totalVisits: number
  keywords: string[]
  titleLower: string
  actionTitle?: string
  actionDescription?: string
  actionButtonTitle?: string
  actionContactPhone?: string
  actionContactWhatsApp?: string
  actionContactSocial?: string
  actionContactEmail?: string
  createdAt: number
  updatedAt: number
}
