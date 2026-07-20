import { describe, expect, it } from 'vitest'
import type { ProfileDataProps } from '@/_types/profile-data'
import { calculateProfileCompleteness } from '@/utils/profile-completeness'

// Perfil base mínimo (vazio - para testar completude zero)
const emptyProfile: Partial<ProfileDataProps> = {
  id: 'test-id',
  name: 'Negócio Teste',
  slug: 'negocio-teste',
}

// Perfil completo (para testar score máximo)
const fullProfile: Partial<ProfileDataProps> = {
  id: 'test-id',
  name: 'Padaria São João',
  slug: 'padaria-sao-joao',
  businessDescription:
    'Uma padaria artesanal com mais de 30 anos de tradição em Carangola.',
  category: 'Alimentação',
  categories: ['Alimentação', 'Padaria'],
  logoImageUrl: 'https://cdn.exemplo.com/logo.png',
  coverImageUrl: 'https://cdn.exemplo.com/capa.png',
  businessPhones: [
    {
      phone: '32988887777',
      title: 'WhatsApp',
      nameContact: 'Test',
      isWhatsapp: true,
      isOnlyWhatsapp: false,
    },
  ],
  businessAddresses: [
    {
      street: 'Rua das Flores',
      number: '100',
      city: 'Carangola',
      state: 'MG',
      zipCode: '36801-000',
      neighborhood: 'Centro',
    },
  ],
  socialMedias: { instagram: 'padaria_sj', facebook: '', whatsapp: '' },
  openingHours: { monday: { open: '08:00', close: '18:00', isOpen: true } },
} as any

describe('calculateProfileCompleteness', () => {
  describe('perfil vazio', () => {
    it('retorna totalScore 0 para perfil sem dados', () => {
      const { totalScore } = calculateProfileCompleteness(
        emptyProfile as ProfileDataProps
      )
      expect(totalScore).toBe(0)
    })

    it('retorna todos os items como incompletos', () => {
      const { items } = calculateProfileCompleteness(
        emptyProfile as ProfileDataProps
      )
      const allIncomplete = items.every(item => !item.isComplete)
      expect(allIncomplete).toBe(true)
    })

    it('retorna 8 itens de checklist', () => {
      const { items } = calculateProfileCompleteness(
        emptyProfile as ProfileDataProps
      )
      expect(items).toHaveLength(8)
    })
  })

  describe('perfil completo', () => {
    it('retorna totalScore 100 para perfil 100% preenchido', () => {
      const { totalScore } = calculateProfileCompleteness(
        fullProfile as ProfileDataProps
      )
      expect(totalScore).toBe(100)
    })

    it('retorna todos os items como completos', () => {
      const { items } = calculateProfileCompleteness(
        fullProfile as ProfileDataProps
      )
      const allComplete = items.every(item => item.isComplete)
      expect(allComplete).toBe(true)
    })
  })

  describe('checagem individual de itens', () => {
    it('marca "description" completo quando tem mais de 20 chars', () => {
      const profile = {
        ...emptyProfile,
        businessDescription: 'Descrição com mais de vinte caracteres aqui.',
      }
      const { items } = calculateProfileCompleteness(
        profile as ProfileDataProps
      )
      const item = items.find(i => i.id === 'description')
      expect(item?.isComplete).toBe(true)
    })

    it('marca "description" incompleto quando tem menos de 20 chars', () => {
      const profile = { ...emptyProfile, businessDescription: 'Curta' }
      const { items } = calculateProfileCompleteness(
        profile as ProfileDataProps
      )
      const item = items.find(i => i.id === 'description')
      expect(item?.isComplete).toBe(false)
    })

    it('marca "logo" completo quando há logoImageUrl', () => {
      const profile = {
        ...emptyProfile,
        logoImageUrl: 'https://cdn.exemplo.com/logo.png',
      }
      const { items } = calculateProfileCompleteness(
        profile as ProfileDataProps
      )
      const item = items.find(i => i.id === 'logo')
      expect(item?.isComplete).toBe(true)
    })

    it('marca "logo" completo quando há logoImagePath', () => {
      const profile = { ...emptyProfile, logoImagePath: 'uploads/logo.png' }
      const { items } = calculateProfileCompleteness(
        profile as ProfileDataProps
      )
      const item = items.find(i => i.id === 'logo')
      expect(item?.isComplete).toBe(true)
    })

    it('marca "phones" completo quando há pelo menos 1 telefone', () => {
      const profile = {
        ...emptyProfile,
        businessPhones: [
          {
            phone: '32988887777',
            title: 'Fixo',
            nameContact: 'Test',
            isWhatsapp: false,
            isOnlyWhatsapp: false,
          },
        ],
      }
      const { items } = calculateProfileCompleteness(
        profile as ProfileDataProps
      )
      const item = items.find(i => i.id === 'phones')
      expect(item?.isComplete).toBe(true)
    })

    it('marca "social" completo quando há pelo menos 1 rede social preenchida', () => {
      const profile = {
        ...emptyProfile,
        socialMedias: { instagram: 'minha_loja' },
      }
      const { items } = calculateProfileCompleteness(
        profile as ProfileDataProps
      )
      const item = items.find(i => i.id === 'social')
      expect(item?.isComplete).toBe(true)
    })

    it('marca "social" incompleto quando todas as redes são vazias', () => {
      const profile = {
        ...emptyProfile,
        socialMedias: { instagram: '', facebook: '' },
      }
      const { items } = calculateProfileCompleteness(
        profile as ProfileDataProps
      )
      const item = items.find(i => i.id === 'social')
      expect(item?.isComplete).toBe(false)
    })

    it('soma corretamente os scores dos itens completos', () => {
      // description(20) + logo(15) = 35
      const profile = {
        ...emptyProfile,
        businessDescription: 'Descrição com mais de vinte caracteres.',
        logoImageUrl: 'https://cdn.exemplo.com/logo.png',
      }
      const { totalScore } = calculateProfileCompleteness(
        profile as ProfileDataProps
      )
      expect(totalScore).toBe(35)
    })
  })
})
