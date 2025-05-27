export function checkIsValidURL(url: string | null) {
  if (!url) return false

  return url.startsWith('https://')
}
