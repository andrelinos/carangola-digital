export const normalizeUrl = (url: string): string => {
  const trimmedUrl = url.trim()

  // Verifica se já começa com 'http://' ou 'https://'
  if (trimmedUrl.startsWith('https://')) {
    return trimmedUrl
  }

  if (trimmedUrl.startsWith('http://')) {
    return trimmedUrl.replace('http://', 'https://') // Força HTTPS
  }

  // Adiciona 'https://' se não houver protocolo
  return `https://${trimmedUrl}`
}
