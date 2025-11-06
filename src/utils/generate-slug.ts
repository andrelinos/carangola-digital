import { customAlphabet } from 'nanoid'

const alphabet =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const nano = customAlphabet(alphabet, 8)

export function slugify(text: string) {
  if (typeof text !== 'string') return `slug-${Date.now()}`

  const normalizedLink = text.normalize('NFD')

  const textWithoutAccents = normalizedLink.replace(/\p{M}/gu, '')

  const sanitizedText = textWithoutAccents
    .toLocaleLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')

  const slugWithId = `${sanitizedText}-${nano()}`

  return slugWithId
}
