export const plansBusinessConfig = {
  free: {
    title: 'GRÁTIS',
    popular: false,
    price: 0,
    frequency: 'undefined',
    socialMedias: {
      linkedin: false,
      kwai: false,
      tiktok: false,
      threads: false,
      site: true,
      facebook: true,
      instagram: true,
      twitter: false,
      youtube: false,
      whatsapp: false,
      telegram: false,
      pinterest: false,
      snapchat: false,
      reddit: false,
      behance: false,
      twitch: false,
      tumblr: false,
      discord: false,
      email: true,
    },
    businessPhones: {
      quantity: 2,
    },
    addresses: {
      quantity: 2,
    },
  },
  basic: {
    title: 'BÁSICO',
    popular: true,
    price: 2990,
    frequency: 'annual',
    socialMedias: {
      linkedin: true,
      kwai: false,
      tiktok: false,
      threads: true,
      site: true,
      facebook: false,
      instagram: true,
      twitter: true,
      youtube: false,
      whatsapp: false,
      telegram: false,
      pinterest: false,
      snapchat: false,
      reddit: false,
      behance: false,
      twitch: false,
      tumblr: false,
      discord: false,
      email: true,
    },
    businessPhones: {
      quantity: 15,
    },
    addresses: {
      quantity: 5,
    },
  },
  pro: {
    title: 'PRO',
    popular: false,
    price: 5990,
    frequency: 'annual',
    socialMedias: {
      linkedin: true,
      kwai: true,
      tiktok: true,
      threads: true,
      site: true,
      facebook: true,
      instagram: true,
      twitter: true,
      youtube: true,
      whatsapp: true,
      telegram: true,
      pinterest: true,
      snapchat: true,
      reddit: true,
      behance: true,
      twitch: true,
      tumblr: true,
      discord: true,
      email: true,
    },

    businessPhones: {
      quantity: 30,
    },
    addresses: {
      quantity: 10,
    },
  },
  master: {
    title: 'MASTER',
    popular: false,
    price: 9990,
    frequency: 'annual',
    socialMedias: {
      linkedin: true,
      kwai: true,
      tiktok: true,
      threads: true,
      site: true,
      facebook: true,
      instagram: true,
      twitter: true,
      youtube: true,
      whatsapp: true,
      telegram: true,
      pinterest: true,
      snapchat: true,
      reddit: true,
      behance: true,
      twitch: true,
      tumblr: true,
      discord: true,
      email: true,
    },

    businessPhones: {
      quantity: -1,
    },
    addresses: {
      quantity: -1,
    },
  },
} as const

export type PlanTypeProps = keyof typeof plansBusinessConfig
export type PlanConfigProps = (typeof plansBusinessConfig)[PlanTypeProps]

export type PlanItemProps = PlanConfigProps & {
  name: Exclude<PlanTypeProps, 'master'>
  activeSocialMedias: number
}

export type PlansProps = PlanItemProps[]
