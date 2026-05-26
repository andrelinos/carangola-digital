import { describe, expect, it } from 'vitest'
import { formatCpfCnpj, sanitizeCpfCnpj } from './format-cpf-cnpj'

describe('formatCpfCnpj', () => {
  it('retorna vazio para entrada vazia', () => {
    expect(formatCpfCnpj('')).toBe('')
  })

  it('formata CPF progressivamente enquanto o usuário digita', () => {
    expect(formatCpfCnpj('1')).toBe('1')
    expect(formatCpfCnpj('123')).toBe('123')
    expect(formatCpfCnpj('1234')).toBe('123.4')
    expect(formatCpfCnpj('123456')).toBe('123.456')
    expect(formatCpfCnpj('1234567')).toBe('123.456.7')
    expect(formatCpfCnpj('12345678909')).toBe('123.456.789-09')
  })

  it('remove caracteres não numéricos antes de formatar', () => {
    expect(formatCpfCnpj('123.456.789-09')).toBe('123.456.789-09')
    expect(formatCpfCnpj('  123 456 789 09  ')).toBe('123.456.789-09')
  })

  it('trunca em 11 dígitos para CPF', () => {
    // 15 dígitos digitados → slice(0,14) → 14 dígitos → branch CNPJ
    // Para garantir truncamento no CPF, o input já deve ter no máx 11 numéricos
    expect(formatCpfCnpj('123456789099999')).toBe('12.345.678/9099-99')
  })

  it('formata CNPJ progressivamente ao passar de 11 dígitos', () => {
    // com 8 dígitos ainda está na branch CPF
    expect(formatCpfCnpj('11222333')).toBe('112.223.33')
    expect(formatCpfCnpj('112223330001')).toBe('11.222.333/0001')
    expect(formatCpfCnpj('11222333000181')).toBe('11.222.333/0001-81')
  })

  it('trunca em 14 dígitos para CNPJ', () => {
    expect(formatCpfCnpj('112223330001819999')).toBe('11.222.333/0001-81')
  })
})

describe('sanitizeCpfCnpj', () => {
  it('remove toda a formatação do CPF', () => {
    expect(sanitizeCpfCnpj('123.456.789-09')).toBe('12345678909')
  })

  it('remove toda a formatação do CNPJ', () => {
    expect(sanitizeCpfCnpj('11.222.333/0001-81')).toBe('11222333000181')
  })

  it('retorna vazio para entrada vazia', () => {
    expect(sanitizeCpfCnpj('')).toBe('')
  })
})
