import { describe, expect, it } from 'vitest'
import { normalizeUrl } from '@/utils/normalize-url'

describe('normalizeUrl', () => {
  it('mantém URL que já começa com https://', () => {
    expect(normalizeUrl('https://carangoladigital.com.br')).toBe(
      'https://carangoladigital.com.br'
    )
  })

  it('converte http:// para https://', () => {
    expect(normalizeUrl('http://carangoladigital.com.br')).toBe(
      'https://carangoladigital.com.br'
    )
  })

  it('adiciona https:// a URL sem protocolo', () => {
    expect(normalizeUrl('carangoladigital.com.br')).toBe(
      'https://carangoladigital.com.br'
    )
  })

  it('adiciona https:// a URL com www sem protocolo', () => {
    expect(normalizeUrl('www.carangoladigital.com.br')).toBe(
      'https://www.carangoladigital.com.br'
    )
  })

  it('remove espaços no início e no fim antes de processar', () => {
    expect(normalizeUrl('  https://carangoladigital.com.br  ')).toBe(
      'https://carangoladigital.com.br'
    )
  })

  it('converte http com www para https', () => {
    expect(normalizeUrl('http://www.exemplo.com.br')).toBe(
      'https://www.exemplo.com.br'
    )
  })
})
