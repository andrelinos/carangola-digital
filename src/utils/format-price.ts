// O formatador continua o mesmo
const brlFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

/**
 * Formata um valor em centavos para moeda BRL (R$).
 * Exemplo: 5990 -> "R$ 59,90"
 *
 * @param price O valor em centavos a ser formatado.
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

  let valueToConvert: number | string

  if (typeof price === 'string') {
    // Limpa a string mantendo apenas números (e possível sinal de negativo)
    // Se a string recebida for "5990", o replace a mantém intacta.
    const cleanedPrice = price
      .replace(/R\$\s*/g, '')
      .replace(/\./g, '')
      .replace(/,/g, '.')

    valueToConvert = cleanedPrice
  } else {
    // Se já for 'number', apenas usamos
    valueToConvert = price
  }

  // 2. Converte o input para número base (neste momento, ainda em centavos)
  const numericValue = Number(valueToConvert)

  // 3. Lida com inputs que não são numéricos (ex: "abc", NaN)
  if (Number.isNaN(numericValue)) {
    return defaultOnInvalid
  }

  // 4. CONVERSÃO: Transforma os centavos em Reais (ex: 5990 / 100 = 59.90)
  const valueInReais = numericValue / 100

  // 5. Formata o valor válido
  try {
    return brlFormatter.format(valueInReais)
  } catch {
    return defaultOnInvalid
  }
}
