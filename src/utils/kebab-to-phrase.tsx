export function kebabToPhrase(input: string) {
  if (typeof input !== 'string') return ''
  return input
    .split('-')
    .map(token => {
      const lower = token.toLowerCase()
      return lower
    })
    .join(' ')
}
