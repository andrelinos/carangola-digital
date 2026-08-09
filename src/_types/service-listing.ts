export type ServicePriceType = 'fixed' | 'from' | 'on-request'
export type ServiceArea = 'local' | 'citywide' | 'home-service'

export interface ServiceListing {
  id: string
  businessProfileId?: string // optional — links to /business profile if exists
  userId: string // listing owner (required)
  slug: string // generated from title + nanoid(6)
  title: string
  description: string
  category: string
  tags: string[]

  // Pricing
  priceType: ServicePriceType
  price?: number // in cents when fixed/from

  // Media
  images: { path: string; url: string }[]
  thumbnailUrl?: string

  // Service area
  serviceArea: ServiceArea
  neighborhood?: string

  // Contact
  contactWhatsApp?: string
  contactPhone?: string
  contactEmail?: string

  // Control
  isActive: boolean
  isHighlighted: boolean // paid highlight — appears at top

  // Metrics
  rating?: number
  reviewCount: number
  totalVisits: number

  createdAt: number // timestamp millis
  updatedAt: number
}

export type ServiceListingCardData = Pick<
  ServiceListing,
  | 'id'
  | 'slug'
  | 'title'
  | 'category'
  | 'priceType'
  | 'price'
  | 'thumbnailUrl'
  | 'serviceArea'
  | 'contactWhatsApp'
  | 'isHighlighted'
  | 'rating'
  | 'reviewCount'
>
