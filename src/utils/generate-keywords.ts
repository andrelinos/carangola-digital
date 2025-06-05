export function generateKeywords(name: string): string[] {
  const normalizedString = name
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()

  return normalizedString.split(/\s+/)
}
