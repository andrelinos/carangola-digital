/**
 * Formata uma string para o padrão de CEP (XXXXX-XXX) de forma segura.
 * Lida com valores nulos, indefindos ou não-strings.
 * Trunca a string para o máximo de 8 dígitos.
 * Formata dinamicamente (ideal para máscaras de input).
 *
 * @param cep A string contendo o CEP a ser formatado.
 * @returns O CEP formatado ou uma string vazia se a entrada for inválida.
 */
export function formatCep(cep: string): string {
  // 1. Tratamento de Erros e Inputs Inválidos
  // Retorna string vazia se for null, undefined, não-string, etc.
  if (!cep || typeof cep !== 'string') {
    return ''
  }

  // 2. Limpeza e Normalização
  // Remove tudo que não for dígito e trunca no máximo em 8 dígitos
  const digitsOnly = cep.replace(/\D/g, '').slice(0, 8)

  // 3. Formatação (Estilo Máscara)
  // Se tiver mais de 5 dígitos, aplica o hífen.
  // Ex: "12345" -> "12345"
  // Ex: "123456" -> "12345-6"
  // Ex: "12345678" -> "12345-678"
  if (digitsOnly.length > 5) {
    // Usa um regex que captura os 5 primeiros dígitos
    // e depois captura o restante (de 1 a 3 dígitos).
    return digitsOnly.replace(/(\d{5})(\d{1,3})/, '$1-$2')
  }

  // Se tiver 5 ou menos dígitos, retorna apenas os dígitos
  return digitsOnly
}
