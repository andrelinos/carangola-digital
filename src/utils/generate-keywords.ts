export function generateKeywords(text: string): string[] {
  try {
    if (!text || !text.trim()) return []

    const normalized = text
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()

    const terms = normalized
      .split(/[^\p{L}\p{N}]+/u)
      .map(t => t.replace(/^_+|_+$/g, ''))
      .filter(t => t.length > 2 && !/^\d+$/u.test(t))

    return Array.from(new Set(terms))
  } catch {
    return []
  }
}
