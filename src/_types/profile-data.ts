import type { PlanTypeProps } from '@/configs/plans-business'

export type WeekDayProps =
  | 'Segunda-feira'
  | 'Terça-feira'
  | 'Quarta-feira'
  | 'Quinta-feira'
  | 'Sexta-feira'
  | 'Sábado'
  | 'Domingo'

export type ScheduleInterval = {
  opening: string
  closing: string
}

export interface HolidayException {
  date: string // YYYY-MM-DD
  description: string
  closed: boolean
  isAppointmentOnly: boolean
  intervals: ScheduleInterval[]
}

export type ScheduleDay = {
  isAppointmentOnly: boolean
  closed: boolean
  intervals: ScheduleInterval[]
}

export type Schedule = {
  Monday: ScheduleDay
  Tuesday: ScheduleDay
  Wednesday: ScheduleDay
  Thursday: ScheduleDay
  Friday: ScheduleDay
  Saturday: ScheduleDay
  Sunday: ScheduleDay
  [key: string]: ScheduleDay
}

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
  email?: string
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
  id?: string
  userId: string
  slug: string
  totalVisits: number
  hasOwner?: boolean
  createdAt: number
  name: string
  admins: AdminsProfileProps[]
  category: string
  coverImageUrl?: string
  coverImagePath?: string
  logoImagePath?: string
  logoImageUrl?: string
  categories?: string[]
  imagePath?: string
  planActive: {
    type: PlanTypeProps
    expiresAt: number
  }
  holidayExceptions: HolidayException[]
  planType: string
  rating: string
  isActive: boolean
  isPremium: boolean
  isVerified: boolean
  reviewCount: number

  favorites: BusinessFavoritesProps[]
  openingHours: Schedule
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
