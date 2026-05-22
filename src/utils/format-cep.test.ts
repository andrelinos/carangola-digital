import { describe, expect, it } from 'vitest'
import { formatCep } from '@/utils/format-cep'

describe('formatCep', () => {
  describe('entradas inválidas', () => {
    it('retorna vazio para string vazia', () => {
      expect(formatCep('')).toBe('')
    })

    it('retorna vazio para null', () => {
      // @ts-expect-error testando null propositalmente
      expect(formatCep(null)).toBe('')
    })

    it('retorna vazio para undefined', () => {
      // @ts-expect-error testando undefined propositalmente
      expect(formatCep(undefined)).toBe('')
    })
  })

  describe('formatação dinâmica (máscara)', () => {
    it('5 dígitos: retorna apenas os dígitos', () => {
      expect(formatCep('36801')).toBe('36801')
    })

    it('6 dígitos: formata com hífen', () => {
      expect(formatCep('368010')).toBe('36801-0')
    })

    it('8 dígitos completo: 36801-000', () => {
      expect(formatCep('36801000')).toBe('36801-000')
    })

    it('CEP já formatado: 36801-000 → 36801-000', () => {
      expect(formatCep('36801-000')).toBe('36801-000')
    })

    it('trunca excesso: mais de 8 dígitos', () => {
      expect(formatCep('368010001111')).toBe('36801-000')
    })

    it('remove caracteres não numéricos antes de formatar', () => {
      expect(formatCep('36.801-000')).toBe('36801-000')
    })
  })
})
