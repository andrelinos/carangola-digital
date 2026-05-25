import { describe, expect, it } from 'vitest'
import { generateKeywords } from '@/utils/generate-keywords'

describe('generateKeywords', () => {
  it('retorna array vazio para string vazia', () => {
    expect(generateKeywords('')).toEqual([])
  })

  it('retorna array vazio para string de espaços', () => {
    expect(generateKeywords('   ')).toEqual([])
  })

  it('extrai termos únicos de uma frase', () => {
    const result = generateKeywords('padaria confeitaria')
    expect(result).toContain('padaria')
    expect(result).toContain('confeitaria')
  })

  it('normaliza acentos e converte para minúsculas', () => {
    const result = generateKeywords('Padaria São João')
    expect(result).toContain('padaria')
    expect(result).toContain('sao')
    expect(result).toContain('joao')
  })

  it('filtra palavras com 2 caracteres ou menos', () => {
    const result = generateKeywords('eu de um padaria')
    expect(result).not.toContain('eu')
    expect(result).not.toContain('de')
    expect(result).not.toContain('um')
    expect(result).toContain('padaria')
  })

  it('filtra termos puramente numéricos', () => {
    const result = generateKeywords('loja 123 digital')
    expect(result).not.toContain('123')
    expect(result).toContain('loja')
    expect(result).toContain('digital')
  })

  it('retorna termos únicos (sem duplicatas)', () => {
    const result = generateKeywords('padaria padaria café café')
    const unique = new Set(result)
    expect(result.length).toBe(unique.size)
  })

  it('retorna array vazio para entrada inválida', () => {
    // @ts-expect-error testando null propositalmente
    expect(generateKeywords(null)).toEqual([])
  })
})
