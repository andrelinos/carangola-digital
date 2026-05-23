import { describe, expect, it } from 'vitest'
import { checkIsValidURL } from '@/utils/check-is-valid-url'

describe('checkIsValidURL', () => {
  it('retorna false para null', () => {
    expect(checkIsValidURL(null)).toBe(false)
  })

  it('retorna false para string vazia', () => {
    expect(checkIsValidURL('')).toBe(false)
  })

  it('retorna false para URL com http://', () => {
    expect(checkIsValidURL('http://exemplo.com')).toBe(false)
  })

  it('retorna false para URL sem protocolo', () => {
    expect(checkIsValidURL('www.exemplo.com')).toBe(false)
  })

  it('retorna true para URL com https://', () => {
    expect(checkIsValidURL('https://exemplo.com')).toBe(true)
  })

  it('retorna true para URL https com path', () => {
    expect(
      checkIsValidURL('https://carangoladigital.com.br/business/slug')
    ).toBe(true)
  })
})
