export const plansBusinessConfig = {
  free: {
    title: 'GRÁTIS',
    description: 'O começo de tudo. Seja visto na cidade.',
    popular: false,
    price: 0,
    frequency: 'vitalicio',
    durationMonths: 0, // 0 = sem expiração (plano permanente)
    premiumFeatures: {
      prioritySearch: false,
      verifiedBadge: false,
      hideCompetitors: false,
      stickyCta: false,
      analytics: false,
    },
    imageGallery: {
      enabled: false,
      limit: 0,
    },
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
    mapHighlights: {
      limit: 1, // Plano gratuito não pode destacar no mapa
    },
    propertyHighlights: {
      limit: 1, // Plano gratuito não destaca imóveis
    },
  },
  basic: {
    title: 'BÁSICO',
    description: 'Para quem quer crescer e se destacar.',
    popular: true,
    price: 2990,
    frequency: '/ano',
    durationMonths: 12,
    premiumFeatures: {
      prioritySearch: false, // Aparece no topo das buscas (Top Placement)
      verifiedBadge: false, // Selo de Empresa Verificada/Destaque
      hideCompetitors: false, // Remove anúncios/sugestões de concorrentes na página
      stickyCta: false, // Botão de WhatsApp/Contato fixo na tela (mobile)
      analytics: false, // Acesso ao painel de cliques e visualizações
    },
    imageGallery: {
      enabled: true,
      limit: 5, // Permite até 5 fotos (fachada, produtos, cardápio)
    },
    socialMedias: {
      linkedin: true,
      kwai: false,
      tiktok: false,
      threads: true,
      site: true,
      facebook: true, // corrigido: basic deve ter facebook (era false por engano)
      instagram: true,
      twitter: true,
      youtube: false,
      whatsapp: true,
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
      quantity: 8,
    },
    addresses: {
      quantity: 4,
    },
    mapHighlights: {
      limit: 1, // Pode destacar 1 endereço simultaneamente
    },
    propertyHighlights: {
      limit: 2, // Pode destacar 2 imóveis
    },
  },
  pro: {
    title: 'PRO',
    description: 'O topo da vitrine. Máxima visibilidade.',
    popular: false,
    price: 5990,
    frequency: '/ano',
    durationMonths: 12,
    tag: 'MAIS VANTAJOSO',
    premiumFeatures: {
      prioritySearch: true, // Aparece no topo das buscas (Top Placement)
      verifiedBadge: true, // Selo de Empresa Verificada/Destaque
      hideCompetitors: true, // Remove anúncios/sugestões de concorrentes na página
      stickyCta: true, // Botão de WhatsApp/Contato fixo na tela (mobile)
      analytics: true, // Acesso ao painel de cliques e visualizações
    },
    imageGallery: {
      enabled: true,
      limit: 15, // Permite até 15 fotos (fachada, produtos, cardápio)
    },
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
      quantity: 50,
    },
    addresses: {
      quantity: 10,
    },
    mapHighlights: {
      limit: 3, // Pode destacar até 3 endereços simultaneamente
    },
    propertyHighlights: {
      limit: 10, // Pode destacar até 10 imóveis
    },
  },
  master: {
    title: 'MASTER',
    description: 'Poder total. Sem limites, sem competição.',
    popular: false,
    price: 9990,
    frequency: '/ano',
    durationMonths: 12,
    premiumFeatures: {
      prioritySearch: true,
      verifiedBadge: true,
      hideCompetitors: true,
      stickyCta: true,
      analytics: true,
    },
    imageGallery: {
      enabled: true,
      limit: 20, // Permite até 20 fotos na galeria
    },
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
    mapHighlights: {
      limit: -1, // Ilimitado
    },
    propertyHighlights: {
      limit: -1, // Ilimitado
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
