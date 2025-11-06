export const plansRealEstateConfig = {
  free: {
    imagesGallery: 1,
    expiresIn: 365, // dias
    descriptionCharacters: 300,
    features: 4,
    details: 3,
    externalSearch: false,
    ads: 2,
  },
  basic: {
    imagesGallery: 5,
    expiresIn: 365, // dias
    descriptionCharacters: 500,
    features: 12,
    details: 5,
    externalSearch: true,
    ads: 10,
  },
  pro: {
    imagesGallery: 12,
    expiresIn: 365, // dias
    descriptionCharacters: 1000,
    features: 0,
    details: 0,
    externalSearch: true,
    ads: 20,
  },
  master: {
    imagesGallery: 12,
    expiresIn: 0, // dias
    descriptionCharacters: 1000,
    features: 0,
    details: 0,
    ads: 50,
    externalSearch: true,
  },
} as const

export type PlanTypeProps = keyof typeof plansRealEstateConfig
export type PlanConfigProps = (typeof plansRealEstateConfig)[PlanTypeProps]
