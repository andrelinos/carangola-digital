export const plansConfig = {
  free: {
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
    },
    businessPhones: {
      quantity: 1,
    },
    addresses: {
      quantity: 1,
    },
  },
  basic: {
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
    },
    businessPhones: {
      quantity: 5,
    },
    addresses: {
      quantity: 3,
    },
  },
  pro: {
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
    },

    businessPhones: {
      quantity: 10,
    },
    addresses: {
      quantity: 10,
    },
  },
  master: {
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
    },

    businessPhones: {
      quantity: -1,
    },
    addresses: {
      quantity: -1,
    },
  },
} as const

export type PlanTypeProps = keyof typeof plansConfig
export type PlanConfigProps = (typeof plansConfig)[PlanTypeProps]
