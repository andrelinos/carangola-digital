export function generateGoogleMapsLink({
  latitude,
  longitude,
}: {
  latitude: number
  longitude: number
}): string {
  try {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`

    return mapsUrl
  } catch (error) {
    return ''
  }
}
