import { describe, expect, it } from 'vitest'
import { plansBusinessConfig } from '@/configs/plans-business'

describe('plansBusinessConfig', () => {
  const plans = ['free', 'basic', 'pro', 'master'] as const

  describe('estrutura dos planos', () => {
    it.each(plans)('plano "%s" possui as propriedades obrigatórias', (plan) => {
      const config = plansBusinessConfig[plan]
      expect(config).toHaveProperty('title')
      expect(config).toHaveProperty('price')
      expect(config).toHaveProperty('imageGallery')
      expect(config).toHaveProperty('premiumFeatures')
      expect(config).toHaveProperty('socialMedias')
      expect(config).toHaveProperty('businessPhones')
      expect(config).toHaveProperty('addresses')
    })

    it.each(plans)('plano "%s" tem title como string não-vazia', (plan) => {
      expect(typeof plansBusinessConfig[plan].title).toBe('string')
      expect(plansBusinessConfig[plan].title.length).toBeGreaterThan(0)
    })
  })

  describe('plano free', () => {
    it('tem price 0', () => {
      expect(plansBusinessConfig.free.price).toBe(0)
    })

    it('não possui galeria de imagens habilitada', () => {
      expect(plansBusinessConfig.free.imageGallery.enabled).toBe(false)
      expect(plansBusinessConfig.free.imageGallery.limit).toBe(0)
    })

    it('não possui recursos premium', () => {
      const { premiumFeatures } = plansBusinessConfig.free
      expect(premiumFeatures.stickyCta).toBe(false)
      expect(premiumFeatures.prioritySearch).toBe(false)
      expect(premiumFeatures.verifiedBadge).toBe(false)
    })

    it('permite no máximo 2 telefones', () => {
      expect(plansBusinessConfig.free.businessPhones.quantity).toBe(2)
    })
  })

  describe('plano basic', () => {
    it('tem galeria de imagens habilitada', () => {
      expect(plansBusinessConfig.basic.imageGallery.enabled).toBe(true)
    })

    it('permite até 10 imagens na galeria', () => {
      expect(plansBusinessConfig.basic.imageGallery.limit).toBe(10)
    })

    it('não possui prioritySearch nem verifiedBadge', () => {
      expect(plansBusinessConfig.basic.premiumFeatures.prioritySearch).toBe(false)
      expect(plansBusinessConfig.basic.premiumFeatures.verifiedBadge).toBe(false)
    })

    it('permite whatsapp nas redes sociais', () => {
      expect(plansBusinessConfig.basic.socialMedias.whatsapp).toBe(true)
    })
  })

  describe('plano pro', () => {
    it('tem todos os recursos premium habilitados', () => {
      const { premiumFeatures } = plansBusinessConfig.pro
      expect(premiumFeatures.prioritySearch).toBe(true)
      expect(premiumFeatures.verifiedBadge).toBe(true)
      expect(premiumFeatures.hideCompetitors).toBe(true)
      expect(premiumFeatures.stickyCta).toBe(true)
      expect(premiumFeatures.analytics).toBe(true)
    })

    it('tem galeria habilitada com limite 10', () => {
      expect(plansBusinessConfig.pro.imageGallery.enabled).toBe(true)
      expect(plansBusinessConfig.pro.imageGallery.limit).toBe(10)
    })
  })

  describe('plano master', () => {
    it('tem galeria com limite de 20 imagens', () => {
      expect(plansBusinessConfig.master.imageGallery.limit).toBe(20)
    })

    it('permite endereços ilimitados (-1)', () => {
      expect(plansBusinessConfig.master.addresses.quantity).toBe(-1)
    })

    it('permite telefones ilimitados (-1)', () => {
      expect(plansBusinessConfig.master.businessPhones.quantity).toBe(-1)
    })

    it('tem todos os recursos premium habilitados', () => {
      const { premiumFeatures } = plansBusinessConfig.master
      expect(premiumFeatures.analytics).toBe(true)
      expect(premiumFeatures.prioritySearch).toBe(true)
    })
  })

  describe('hierarquia de planos', () => {
    it('preço cresce conforme a hierarquia dos planos', () => {
      expect(plansBusinessConfig.free.price).toBeLessThan(plansBusinessConfig.basic.price)
      expect(plansBusinessConfig.basic.price).toBeLessThan(plansBusinessConfig.pro.price)
      expect(plansBusinessConfig.pro.price).toBeLessThan(plansBusinessConfig.master.price)
    })
  })
})
