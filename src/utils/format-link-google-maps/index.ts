interface FormatLinkGoogleMapsProps {
  address: string
  city: string
  state: string
  latitude: number
  longitude: number
}

function generateGoogleMapsLink({
  address,
  city,
  state,
  latitude,
  longitude,
}: FormatLinkGoogleMapsProps) {
  if (!address || !city || !state || !latitude || !longitude) {
    return null
  }

  const baseUrl = 'https://www.google.com/maps/place/'
  const formattedAddress = `${address}, ${city}, ${state}`
  const coordinates = `@${latitude},${longitude},17z`
  return `${baseUrl}${encodeURIComponent(formattedAddress)}/${coordinates}`
}

// https://www.google.com/maps/dir/R.+Domingos+Guarino,+208+-+Eldorado,+Carangola+-+MG,+36800-000/R.+Domingos+Guarino,+20+-+Eldorado,+Carangola+-+MG,+36800-000/@-20.7341042,-42.0181911,17z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0xbb7a13b09b5f41:0x1ffa8dcd34297998!2m2!1d-42.0155868!2d-20.7349634!1m5!1m1!1s0xbb7b36c34ef279:0x433a9d75ab67bb82!2m2!1d-42.0157862!2d-20.733266?entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoASAFQAw%3D%3D
