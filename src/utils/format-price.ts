// O formatador continua o mesmo
const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/**
 * Formata um valor (número, string, null, ou undefined) para moeda BRL (R$)
 * de forma segura e performática.
 *
 * Lida com strings formatadas em BRL (ex: "1.000,00") e
 * strings em formato americano (ex: "1000.00").
 *
 * @param price O valor a ser formatado.
 * @param options Opções de formatação.
 * @param options.defaultOnInvalid O valor a ser retornado se o input for
 * inválido (null, undefined, "abc", NaN). Padrão é uma string vazia: "".
 * @returns A string formatada (ex: "R$ 1.234,56") ou o valor padrão em caso de erro.
 */
export function formatPrice(
  price: number | string | null | undefined,
  options: { defaultOnInvalid?: string } = {}
): string {
  const { defaultOnInvalid = '' } = options

  // 1. Lida com inputs nulos ou indefinidos
  if (price === null || price === undefined) {
    return defaultOnInvalid
  }

  // --- INÍCIO DA CORREÇÃO ---
  let valueToConvert: number | string

  if (typeof price === 'string') {
    // Se for string, limpamos ela para um formato numérico válido
    const cleanedPrice = price
      .replace(/R\$\s*/g, '') // Remove "R$ " (opcional)
      .replace(/\./g, '') // Remove o ponto de milhar (ex: 1.000 -> 1000)
      .replace(/,/g, '.') // Substitui a vírgula decimal por ponto (ex: 1000,00 -> 1000.00)

    valueToConvert = cleanedPrice
  } else {
    // Se já for 'number', apenas usamos
    valueToConvert = price
  }
  // --- FIM DA CORREÇÃO ---

  // 3. Converte o input (agora limpo) para número
  // Number("1000000.00") se torna 1000000 (corretamente)
  const numericValue = Number(valueToConvert)

  // 4. Lida com inputs que não são numéricos (ex: "abc", NaN)
  if (Number.isNaN(numericValue)) {
    return defaultOnInvalid
  }

  // 5. Formata o valor válido
  try {
    return brlFormatter.format(numericValue)
  } catch (error) {
    console.error('Erro ao formatar preço:', error, 'Input:', price)
    return defaultOnInvalid
  }
}
