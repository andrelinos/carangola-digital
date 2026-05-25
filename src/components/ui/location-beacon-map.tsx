'use client'

import L from 'leaflet'
import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export interface AddressLocation {
  latitude: number
  longitude: number
}

export interface BusinessMarker {
  id: string
  name: string
  isBeaconActive?: boolean
  businessAddresses?: AddressLocation[]
}

interface LocationBeaconMapProps {
  businesses: BusinessMarker[]
  centerLat: number
  centerLng: number
  zoom?: number
}

const createCustomIcon = (isActive: boolean) => {
  const html = isActive
    ? `<div class="relative flex h-10 w-10 items-center justify-center">
         <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"></span>
         <span class="relative inline-flex h-5 w-5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] ring-4 ring-white"></span>
       </div>`
    : `<div class="relative flex h-6 w-6 items-center justify-center">
         <span class="relative inline-flex h-3 w-3 rounded-full bg-slate-600 shadow-sm ring-2 ring-white"></span>
       </div>`

  return L.divIcon({
    html,
    className: 'bg-transparent border-none',
    iconSize: isActive ? [40, 40] : [24, 24],
    iconAnchor: isActive ? [20, 20] : [12, 12],
    popupAnchor: [0, isActive ? -20 : -12],
  })
}

export default function LocationBeaconMap({
  businesses,
  centerLat,
  centerLng,
  zoom = 14,
}: LocationBeaconMapProps) {
  useEffect(() => {
    // Corrige erro de renderização do Leaflet no SSR do Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/leaflet/marker-icon-2x.png',
      iconUrl: '/leaflet/marker-icon.png',
      shadowUrl: '/leaflet/marker-shadow.png',
    })
  }, [])

  return (
    <div className="h-[500px] w-full overflow-hidden rounded-3xl border border-slate-200 shadow-sm dark:border-slate-800">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={zoom}
        scrollWheelZoom={false}
        className="z-0 h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {businesses.map(business => {
          const primaryAddress = business.businessAddresses?.[0]

          if (!primaryAddress?.latitude || !primaryAddress?.longitude) {
            return null
          }

          return (
            <Marker
              key={business.id}
              position={[primaryAddress.latitude, primaryAddress.longitude]}
              icon={createCustomIcon(!!business.isBeaconActive)}
            >
              <Popup className="rounded-xl">
                <div className="flex flex-col gap-1 p-1">
                  <span className="font-bold text-slate-900 text-sm">
                    {business.name}
                  </span>
                  {business.isBeaconActive && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-[10px] text-emerald-600 uppercase tracking-wide">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      Beacon Ativo
                    </span>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}
