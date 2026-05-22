import { describe, expect, it } from 'vitest'
import {
  formatPhoneNumber,
  sanitizePhoneNumber,
} from '@/utils/format-phone-number'

describe('formatPhoneNumber', () => {
  describe('entradas inválidas', () => {
    it('retorna vazio para null', () => {
      expect(formatPhoneNumber(null)).toBe('')
    })

    it('retorna vazio para undefined', () => {
      expect(formatPhoneNumber(undefined)).toBe('')
    })

    it('retorna vazio para string vazia', () => {
      expect(formatPhoneNumber('')).toBe('')
    })
  })

  describe('telefone fixo com DDD (10 dígitos)', () => {
    it('formata corretamente: 3233334444 → (32) 3333-4444', () => {
      expect(formatPhoneNumber('3233334444')).toBe('(32) 3333-4444')
    })

    it('formata com caracteres misturados: (32) 3333-4444 → (32) 3333-4444', () => {
      expect(formatPhoneNumber('(32) 3333-4444')).toBe('(32) 3333-4444')
    })
  })

  describe('telefone celular com DDD (11 dígitos)', () => {
    it('formata corretamente: 32988887777 → (32) 98888-7777', () => {
      expect(formatPhoneNumber('32988887777')).toBe('(32) 98888-7777')
    })

    it('formata com espaços e traços: 32 9 8888-7777 → (32) 98888-7777', () => {
      expect(formatPhoneNumber('32 9 8888-7777')).toBe('(32) 98888-7777')
    })
  })

  describe('telefone fixo com DDI +55 (12 dígitos)', () => {
    it('formata corretamente: 553233334444 → +55 (32) 3333-4444', () => {
      expect(formatPhoneNumber('553233334444')).toBe('+55 (32) 3333-4444')
    })
  })

  describe('telefone celular com DDI +55 (13 dígitos)', () => {
    it('formata corretamente: 5532988887777 → +55 (32) 98888-7777', () => {
      expect(formatPhoneNumber('5532988887777')).toBe('+55 (32) 98888-7777')
    })

    it('formata com prefixo +55: +55 32988887777 → +55 (32) 98888-7777', () => {
      expect(formatPhoneNumber('+55 32988887777')).toBe('+55 (32) 98888-7777')
    })
  })

  describe('formatos não reconhecidos', () => {
    it('retorna o original para número muito curto', () => {
      expect(formatPhoneNumber('12345')).toBe('12345')
    })

    it('retorna o original para número muito longo', () => {
      expect(formatPhoneNumber('123456789012345')).toBe('123456789012345')
    })
  })
})

describe('sanitizePhoneNumber', () => {
  it('retorna vazio para string vazia', () => {
    expect(sanitizePhoneNumber('')).toBe('')
  })

  it('remove formatação e mantém apenas dígitos', () => {
    expect(sanitizePhoneNumber('(32) 98888-7777')).toBe('32988887777')
  })

  it('remove o prefixo +55', () => {
    expect(sanitizePhoneNumber('+5532988887777')).toBe('5532988887777')
  })

  it('remove espaços e traços', () => {
    expect(sanitizePhoneNumber('32 9 8888-7777')).toBe('32988887777')
  })
})
