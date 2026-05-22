import { describe, expect, it } from 'vitest'
import { normalizeText } from '@/utils/sanitize-text'

describe('normalizeText', () => {
  it('converte para minúsculas', () => {
    expect(normalizeText('CARANGOLA')).toBe('carangola')
  })

  it('remove acentos', () => {
    expect(normalizeText('Ação')).toBe('acao')
    expect(normalizeText('José')).toBe('jose')
    expect(normalizeText('São João')).toBe('sao joao')
  })

  it('remove espaços no início e no fim', () => {
    expect(normalizeText('  texto  ')).toBe('texto')
  })

  it('mantém espaços internos', () => {
    expect(normalizeText('Carangola Digital')).toBe('carangola digital')
  })

  it('processa string complexa', () => {
    expect(normalizeText('  Padaria & Confeitaria São João  ')).toBe(
      'padaria & confeitaria sao joao'
    )
  })
})
