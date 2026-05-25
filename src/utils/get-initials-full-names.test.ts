import { describe, expect, it } from 'vitest'
import { getInitialsFullNameAvatar } from '@/utils/get-initials-full-names'

describe('getInitialsFullNameAvatar', () => {
  it('retorna "NA" para null', () => {
    expect(getInitialsFullNameAvatar(null)).toBe('NA')
  })

  it('retorna "NA" para undefined', () => {
    expect(getInitialsFullNameAvatar(undefined)).toBe('NA')
  })

  it('retorna "NA" para string vazia', () => {
    expect(getInitialsFullNameAvatar('')).toBe('NA')
  })

  it('retorna inicial única para nome simples', () => {
    expect(getInitialsFullNameAvatar('André')).toBe('A')
  })

  it('retorna duas iniciais para nome composto', () => {
    expect(getInitialsFullNameAvatar('André Lima')).toBe('AL')
  })

  // A função usa o índice [0] e [1] do split, portanto pega sempre
  // a 1ª e a 2ª palavras — preposições como "de" são incluídas.
  it('retorna inicial da 1ª e 2ª palavras (inclui preposições)', () => {
    expect(getInitialsFullNameAvatar('André de Oliveira Lima')).toBe('AD')
  })

  it('converte para maiúsculas', () => {
    expect(getInitialsFullNameAvatar('maria josé')).toBe('MJ')
  })

  it('lida com espaços extras no início e no fim', () => {
    expect(getInitialsFullNameAvatar('  João Silva  ')).toBe('JS')
  })
})
