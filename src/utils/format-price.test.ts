import { describe, expect, it } from 'vitest'
import { formatPrice } from '@/utils/format-price'

describe('formatPrice', () => {
  describe('entradas inválidas', () => {
    it('retorna vazio para null', () => {
      expect(formatPrice(null)).toBe('')
    })

    it('retorna vazio para undefined', () => {
      expect(formatPrice(undefined)).toBe('')
    })

    it('retorna vazio para string não numérica', () => {
      expect(formatPrice('abc')).toBe('')
    })

    it('retorna defaultOnInvalid customizado para null', () => {
      expect(formatPrice(null, { defaultOnInvalid: 'Grátis' })).toBe('Grátis')
    })

    it('retorna defaultOnInvalid customizado para NaN string', () => {
      expect(formatPrice('xyz', { defaultOnInvalid: '-' })).toBe('-')
    })
  })

  describe('valores numéricos em centavos', () => {
    it('converte 0 → R$ 0,00', () => {
      expect(formatPrice(0)).toBe('R$\u00a00,00')
    })

    it('converte 100 (1 real) → R$ 1,00', () => {
      expect(formatPrice(100)).toBe('R$\u00a01,00')
    })

    it('converte 2990 → R$ 29,90', () => {
      expect(formatPrice(2990)).toBe('R$\u00a029,90')
    })

    it('converte 5990 → R$ 59,90', () => {
      expect(formatPrice(5990)).toBe('R$\u00a059,90')
    })

    it('converte 9990 → R$ 99,90', () => {
      expect(formatPrice(9990)).toBe('R$\u00a099,90')
    })

    it('converte 100000 → R$ 1.000,00', () => {
      expect(formatPrice(100000)).toBe('R$\u00a01.000,00')
    })
  })

  describe('valores em string numérica', () => {
    it('converte string "5990" → R$ 59,90', () => {
      expect(formatPrice('5990')).toBe('R$\u00a059,90')
    })

    it('converte string "0" → R$ 0,00', () => {
      expect(formatPrice('0')).toBe('R$\u00a00,00')
    })
  })
})
