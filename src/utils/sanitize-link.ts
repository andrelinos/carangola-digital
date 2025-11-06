export function sanitizeLink(link: string): string {
  if (!link) return ''

  const normalizedLink = link.normalize('NFD')

  const linkWithoutAccents = normalizedLink.replace(/\p{M}/gu, '')

  const sanitizedLink = linkWithoutAccents
    .toLocaleLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')

  return sanitizedLink
}
