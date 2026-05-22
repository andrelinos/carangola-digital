import { describe, expect, it } from 'vitest'
import { sanitizeLink } from '@/utils/sanitize-link'

describe('sanitizeLink', () => {
  it('retorna vazio para string vazia', () => {
    expect(sanitizeLink('')).toBe('')
  })

  it('converte para minúsculas', () => {
    expect(sanitizeLink('Carangola')).toBe('carangola')
  })

  it('substitui espaços por hífens', () => {
    expect(sanitizeLink('meu negocio')).toBe('meu-negocio')
  })

  it('remove acentos', () => {
    expect(sanitizeLink('café')).toBe('cafe')
    expect(sanitizeLink('ação')).toBe('acao')
    expect(sanitizeLink('Carangola Digital')).toBe('carangola-digital')
  })

  it('remove caracteres especiais', () => {
    expect(sanitizeLink('negócio@especial!')).toBe('negocioespecial')
  })

  it('colapsa múltiplos hífens em um único', () => {
    expect(sanitizeLink('meu  --  negocio')).toBe('meu-negocio')
  })

  it('processa string com acentos e espaços complexos', () => {
    expect(sanitizeLink('Padaria & Confeitaria São João')).toBe(
      'padaria-confeitaria-sao-joao'
    )
  })
})
