import type { PlanTypeProps } from '@/configs/plans'

export type WeekDayProps =
  | 'Segunda-feira'
  | 'Terça-feira'
  | 'Quarta-feira'
  | 'Quinta-feira'
  | 'Sexta-feira'
  | 'Sábado'
  | 'Domingo'

export type TimeRangeProps = {
  start: string
  end: string
}

export type SocialMediasProps = {
  instagram?: string
  threads?: string
  facebook?: string
  linkedin?: string
  tiktok?: string
  kwai?: string
  site?: string
}

export type BusinessAddressProps = {
  title: string
  address: string
  neighborhood: string
  cep: string
  latitude: number
  longitude: number
}

export type BusinessPhoneProps = {
  title: string
  phone: string
  imageProfileWhatsApp?: string
  nameContact: string
  isWhatsapp: boolean
  isOnlyWhatsapp: boolean
}

export type BusinessFavoritesProps = {
  userId: string
  businessId: string
}

export type AdminsProfileProps = {
  userId: string
  email: string
  name: string
}

export type ProfileDataProps = {
  userId: string
  totalVisits: number
  createdAt: number
  name: string
  admins: AdminsProfileProps[]
  category: string
  imagePath: string
  planActive: {
    type: PlanTypeProps
    expiresAt: number
  }

  planType: string
  rating: string
  isActive: boolean
  isPremium: boolean
  isVerified: boolean
  reviewCount: number

  favorites: BusinessFavoritesProps[]
  openingHours: Record<WeekDayProps, TimeRangeProps[]>
  socialMedias: SocialMediasProps
  businessDescription: string
  businessAddresses: BusinessAddressProps[]
  businessPhones: BusinessPhoneProps[]
  updatedAt: number
}

export type ProfileDataResponseProps = {
  profileId: string
  name: string
  imagePath: string
  totalVisits: number
  businessAddresses: BusinessAddressProps[]
  businessPhones: BusinessPhoneProps[]
}
