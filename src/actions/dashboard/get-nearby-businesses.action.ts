'use server'

import { distanceBetween, geohashQueryBounds } from 'geofire-common'
import { db } from '@/lib/firebase'

export interface AddressLocation {
  latitude: number
  longitude: number
}

export interface BusinessData {
  id: string
  name: string
  isBeaconActive?: boolean
  geohash?: string
  businessAddresses?: AddressLocation[]
  [key: string]: unknown
}

export async function getNearbyBusinessesAction(
  latitude: number,
  longitude: number,
  radiusInKm: number
): Promise<BusinessData[]> {
  try {
    const center: [number, number] = [latitude, longitude]
    const radiusInM = radiusInKm * 1000

    const bounds = geohashQueryBounds(center, radiusInM)
    const businessRef = db.collection('profiles')

    const queryPromises = bounds.map(b => {
      // Usando a sintaxe do firebase-admin (Node.js SDK)
      return businessRef.orderBy('geohash').startAt(b[0]).endAt(b[1]).get()
    })

    const snapshots = await Promise.all(queryPromises)
    const matchingBusinesses: BusinessData[] = []

    for (const snap of snapshots) {
      for (const doc of snap.docs) {
        const data = doc.data() as Partial<BusinessData>
        const primaryAddress = data.businessAddresses?.[0]

        if (
          primaryAddress &&
          typeof primaryAddress.latitude === 'number' &&
          typeof primaryAddress.longitude === 'number'
        ) {
          const distanceInKm = distanceBetween(
            [primaryAddress.latitude, primaryAddress.longitude],
            center
          )

          if (distanceInKm <= radiusInKm) {
            matchingBusinesses.push({
              id: doc.id,
              ...data,
              name: data.name || 'Sem nome',
            } as BusinessData)
          }
        }
      }
    }

    return matchingBusinesses
  } catch (err) {
    console.error('Erro ao buscar negócios próximos:', err)
    throw new Error('Erro ao buscar negócios próximos.')
  }
}
