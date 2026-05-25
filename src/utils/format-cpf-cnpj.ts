/**
 * Formata uma string para o padrão de CPF (000.000.000-00)
 * ou CNPJ (00.000.000/0000-00) de forma dinâmica (ideal para máscara de input).
 *
 * - Remove automaticamente caracteres não numéricos.
 * - Trunca no máximo em 14 dígitos (CNPJ).
 * - Alterna entre máscara de CPF (≤ 11 dígitos) e CNPJ (> 11 dígitos).
 *
 * @param value A string digitada pelo usuário.
 * @returns O valor formatado com a máscara adequada.
 *
 * @example
 * formatCpfCnpj('12345678909')   // '123.456.789-09'
 * formatCpfCnpj('11222333000181') // '11.222.333/0001-81'
 */
export function formatCpfCnpj(value: string): string {
  if (!value || typeof value !== 'string') return ''

  // Remove tudo que não for dígito e limita ao máximo de 14 (CNPJ)
  const digits = value.replace(/\D/g, '').slice(0, 14)

  if (digits.length <= 11) {
    // Máscara CPF: 000.000.000-00
    // Aplica progressivamente: xxx.xxx.xxx-xx
    return digits
      .replace(/(\d{3})(\d{1,})/, '$1.$2')
      .replace(/(\d{3}\.\d{3})(\d{1,})/, '$1.$2')
      .replace(/(\d{3}\.\d{3}\.\d{3})(\d{1,2})$/, '$1-$2')
  }

  // Máscara CNPJ: 00.000.000/0000-00
  return digits
    .replace(/(\d{2})(\d{1,})/, '$1.$2')
    .replace(/(\d{2}\.\d{3})(\d{1,})/, '$1.$2')
    .replace(/(\d{2}\.\d{3}\.\d{3})(\d{1,})/, '$1/$2')
    .replace(/(\d{2}\.\d{3}\.\d{3}\/\d{4})(\d{1,2})$/, '$1-$2')
}

/**
 * Remove toda a formatação do CPF/CNPJ, retornando apenas os dígitos.
 *
 * @example
 * sanitizeCpfCnpj('123.456.789-09') // '12345678909'
 */
export function sanitizeCpfCnpj(value: string): string {
  if (!value) return ''
  return value.replace(/\D/g, '')
}
