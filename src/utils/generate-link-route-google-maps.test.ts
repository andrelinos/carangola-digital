import { describe, expect, it } from 'vitest'
import {
  generateGoogleMapsLinkByAddress,
  generateGoogleMapsLinkByCoords,
} from '@/utils/generate-link-route-google-maps'

describe('generateGoogleMapsLinkByAddress', () => {
  it('retorna string vazia para endereço vazio', () => {
    expect(generateGoogleMapsLinkByAddress('')).toBe('')
  })

  it('gera URL correta para um endereço simples', () => {
    const url = generateGoogleMapsLinkByAddress('Rua das Flores, Carangola MG')
    expect(url).toContain('https://www.google.com/maps/search/')
    expect(url).toContain('api=1')
    expect(url).toContain('Rua')
  })

  it('codifica corretamente caracteres especiais do endereço', () => {
    const url = generateGoogleMapsLinkByAddress(
      'Rua São João, 100 - Carangola/MG'
    )
    expect(url).not.toContain(' ') // espaços devem ser encodados pelo encodeURIComponent
    // encodeURIComponent usa %20, não +
    expect(url).toContain('%20')
  })
})

describe('generateGoogleMapsLinkByCoords', () => {
  it('gera URL correta para coordenadas válidas', () => {
    const url = generateGoogleMapsLinkByCoords({
      latitude: -20.736,
      longitude: -42.029,
    })
    expect(url).toBe(
      'https://www.google.com/maps/search/?api=1&query=-20.736,-42.029'
    )
  })

  it('inclui sinal negativo para coordenadas sul/oeste', () => {
    const url = generateGoogleMapsLinkByCoords({
      latitude: -20.736,
      longitude: -42.029,
    })
    expect(url).toContain('-20.736')
    expect(url).toContain('-42.029')
  })
})
