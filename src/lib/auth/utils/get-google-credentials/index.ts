export function getGoogleCredentials() {
  const clientId = process.env.AUTH_GOOGLE_ID || ''
  const clientSecret = process.env.AUTH_GOOGLE_SECRET || ''

  if (!clientId || clientId.length === 0) {
    console.error('Missing AUTH_GOOGLE_ID')
  }

  if (!clientSecret || clientSecret.length === 0) {
    console.error('Missing AUTH_GOOGLE_SECRET')
  }

  return { clientId, clientSecret }
}
