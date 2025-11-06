export function normalizeText(text: string) {
  const normalizedText = text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()

  return normalizedText
}
