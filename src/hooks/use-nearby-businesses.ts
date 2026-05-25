'use client'

import { useEffect, useState } from 'react'
import {
  type BusinessData,
  getNearbyBusinessesAction,
} from '@/actions/dashboard/get-nearby-businesses.action'

export type { BusinessData }

interface UseNearbyBusinessesResult {
  businesses: BusinessData[]
  loading: boolean
  error: Error | null
}

export function useNearbyBusinesses(
  latitude: number | null,
  longitude: number | null,
  radiusInKm: number
): UseNearbyBusinessesResult {
  const [businesses, setBusinesses] = useState<BusinessData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (latitude === null || longitude === null || radiusInKm <= 0) {
      setBusinesses([])
      return
    }

    const fetchNearby = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getNearbyBusinessesAction(
          latitude,
          longitude,
          radiusInKm
        )
        setBusinesses(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error('Erro ao buscar negócios próximos.')
        )
      } finally {
        setLoading(false)
      }
    }

    fetchNearby()
  }, [latitude, longitude, radiusInKm])

  return { businesses, loading, error }
}
