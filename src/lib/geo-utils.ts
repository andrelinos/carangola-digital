import { geohashForLocation } from 'geofire-common'

export interface AddressLocation {
  latitude: number
  longitude: number
  [key: string]: unknown
}

export interface BusinessPayload {
  businessAddresses?: AddressLocation[]
  [key: string]: unknown
}

export type WithGeoHash<T> = T & { geohash?: string }

/**
 * Injeta o geohash na raiz do objeto do negócio
 * usando as coordenadas do endereço principal.
 */
export function attachGeoHash<T extends BusinessPayload>(
  businessData: T
): WithGeoHash<T> {
  const primaryAddress = businessData.businessAddresses?.[0]

  if (
    !primaryAddress ||
    typeof primaryAddress.latitude !== 'number' ||
    typeof primaryAddress.longitude !== 'number'
  ) {
    return businessData
  }

  const geohash = geohashForLocation([
    primaryAddress.latitude,
    primaryAddress.longitude,
  ])

  return {
    ...businessData,
    geohash,
  }
}
