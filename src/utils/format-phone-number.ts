// Em /lib/formatters.ts (ou /lib/utils.ts)

/**
 * Formata uma string de número de telefone para os padrões brasileiros (fixo e móvel, com ou sem DDI +55).
 * * Lida com entradas nulas, vazias e formatos não reconhecidos.
 * * @param phone A string do número de telefone (ex: "11988887777" ou "+55 (32) 99999-8888" ou null)
 * @returns O número formatado (ex: "(11) 98888-7777") ou a string original se não for um formato reconhecido.
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  // 1. Lidar com erros de entrada: nulo, indefinido ou vazio
  if (!phone) {
    return ''
  }

  // 2. Limpar a string, removendo tudo exceto dígitos numéricos
  const cleaned = String(phone).replace(/\D/g, '')

  // 3. Verificar o comprimento da string limpa para aplicar a máscara
  const length = cleaned.length

  try {
    if (length === 10) {
      // Formato Fixo com DDD: (XX) XXXX-XXXX
      // Ex: "1144443333" -> "(11) 4444-3333"
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }

    if (length === 11) {
      // Formato Móvel com DDD: (XX) 9XXXX-XXXX
      // Ex: "11988887777" -> "(11) 98888-7777"
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }

    if (length === 12) {
      // Formato Fixo com DDI 55: +55 (XX) XXXX-XXXX
      // Ex: "551144443333" -> "+55 (11) 4444-3333"
      return cleaned.replace(/(\d{2})(\d{2})(\d{4})(\d{4})/, '+$1 ($2) $3-$4')
    }

    if (length === 13) {
      // Formato Móvel com DDI 55: +55 (XX) 9XXXX-XXXX
      // Ex: "5511988887777" -> "+55 (11) 98888-7777"
      return cleaned.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4')
    }

    // 4. Lidar com erro: formato não reconhecido (muito curto, muito longo, etc.)
    // Retorna a string original (como recebida) para não perder dados.
    // Ex: "Ramal 123", "12345" ou um número internacional "18005551234"
    return phone
  } catch (error) {
    // 5. Lidar com erro inesperado (ex: falha no .replace())
    console.error('Erro ao formatar telefone:', error)
    return phone // Retorna o original em caso de falha
  }
}

export function sanitizePhoneNumber(phoneNumber: string) {
  if (!phoneNumber) return ''

  const sanitizedPhoneNumber = phoneNumber
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s/g, '')
    .replace(/[^0-9]/g, '')
    .toLowerCase()

  return sanitizedPhoneNumber
}
