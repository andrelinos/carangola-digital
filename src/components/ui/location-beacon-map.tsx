'use client'

import L from 'leaflet'
import { Clock, MapPin, Phone, Star } from 'lucide-react'
import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export interface AddressLocation {
  latitude: number
  longitude: number
  // Optional rich fields for the popup card
  title?: string
  address?: string
  neighborhood?: string
  cep?: string
}

export interface BusinessMarker {
  id: string
  name: string
  isBeaconActive?: boolean
  businessAddresses?: AddressLocation[]
  // Rich info for the popup
  category?: string
  logoUrl?: string
  rating?: number
  reviewCount?: number
  phone?: string
  isOpen?: boolean
  profileSlug?: string
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
    popupAnchor: [0, isActive ? -24 : -14],
  })
}

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => {
    const filled = i < Math.floor(rating)
    const half = !filled && i < rating
    return `<span style="color:${filled || half ? '#f59e0b' : '#d1d5db'};font-size:12px;">★</span>`
  }).join('')
}

export default function LocationBeaconMap({
  businesses,
  centerLat,
  centerLng,
  zoom = 14,
}: LocationBeaconMapProps) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          const addr = business.businessAddresses?.[0]
          if (!addr?.latitude || !addr?.longitude) return null

          const initial = business.name.charAt(0).toUpperCase()
          const fullAddress = [addr.address, addr.neighborhood]
            .filter(Boolean)
            .join(', ')
          const cep = addr.cep ? `CEP ${addr.cep}` : ''

          const popupHtml = `
            <div style="width:240px;font-family:'Inter',sans-serif;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.12);">
              <!-- Header with logo -->
              <div style="display:flex;align-items:center;gap:10px;padding:14px 14px 10px;">
                ${
                  business.logoUrl
                    ? `<img src="${business.logoUrl}" alt="" style="width:44px;height:44px;border-radius:10px;object-fit:cover;border:1px solid #e2e8f0;flex-shrink:0;" />`
                    : `<div style="width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-weight:900;font-size:18px;color:white;">${initial}</div>`
                }
                <div style="min-width:0;flex:1;">
                  <p style="margin:0;font-weight:800;font-size:13px;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.2;">${business.name}</p>
                  ${business.category ? `<p style="margin:2px 0 0;font-size:11px;color:#64748b;font-weight:600;">${business.category}</p>` : ''}
                </div>
              </div>

              <!-- Rating -->
              ${
                business.rating
                  ? `<div style="display:flex;align-items:center;gap:6px;padding:0 14px 8px;">
                      <span style="font-weight:800;font-size:13px;color:#f59e0b;">${business.rating.toFixed(1)}</span>
                      <span>${renderStars(business.rating)}</span>
                      ${business.reviewCount ? `<span style="font-size:11px;color:#94a3b8;font-weight:500;">(${business.reviewCount})</span>` : ''}
                    </div>`
                  : ''
              }

              <!-- Divider -->
              <div style="height:1px;background:#f1f5f9;margin:0 14px;"></div>

              <!-- Address -->
              ${
                fullAddress
                  ? `<div style="display:flex;align-items:flex-start;gap:8px;padding:10px 14px ${business.phone || business.isOpen !== undefined ? '4px' : '12px'};">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                      <div>
                        <p style="margin:0;font-size:12px;color:#334155;font-weight:500;line-height:1.4;">${fullAddress}</p>
                        ${cep ? `<p style="margin:2px 0 0;font-size:11px;color:#94a3b8;font-weight:500;">${cep}</p>` : ''}
                      </div>
                    </div>`
                  : ''
              }

              <!-- Phone -->
              ${
                business.phone
                  ? `<div style="display:flex;align-items:center;gap:8px;padding:4px 14px ${business.isOpen !== undefined ? '4px' : '12px'};">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>
                      <p style="margin:0;font-size:12px;color:#334155;font-weight:500;">${business.phone}</p>
                    </div>`
                  : ''
              }

              <!-- Open/Closed status -->
              ${
                business.isOpen !== undefined
                  ? `<div style="display:flex;align-items:center;gap:8px;padding:4px 14px 12px;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${business.isOpen ? '#10b981' : '#ef4444'}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      <p style="margin:0;font-size:12px;font-weight:700;color:${business.isOpen ? '#059669' : '#dc2626'};">${business.isOpen ? 'Aberto agora' : 'Fechado'}</p>
                    </div>`
                  : ''
              }

              <!-- Beacon badge -->
              ${
                business.isBeaconActive
                  ? `<div style="padding:0 14px 14px;">
                      <div style="display:inline-flex;align-items:center;gap:5px;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:99px;padding:4px 10px;">
                        <span style="width:6px;height:6px;border-radius:50%;background:#10b981;display:inline-block;box-shadow:0 0 0 3px rgba(16,185,129,.2);animation:pulse 1.5s infinite;"></span>
                        <span style="font-size:10px;font-weight:700;color:#059669;text-transform:uppercase;letter-spacing:.06em;">Em destaque</span>
                      </div>
                    </div>`
                  : ''
              }

              <!-- View profile link -->
              ${
                business.profileSlug
                  ? `<div style="border-top:1px solid #f1f5f9;padding:10px 14px;">
                      <a href="/business/${business.profileSlug}" target="_blank" style="display:block;text-align:center;background:#6366f1;color:white;border-radius:10px;padding:8px;font-size:12px;font-weight:700;text-decoration:none;letter-spacing:.03em;">Ver perfil completo →</a>
                    </div>`
                  : ''
              }
            </div>
          `

          return (
            <Marker
              key={business.id}
              position={[addr.latitude, addr.longitude]}
              icon={createCustomIcon(!!business.isBeaconActive)}
            >
              <Popup
                className="gmaps-popup"
                minWidth={240}
                maxWidth={240}
              >
                <div
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: controlled template string with no user input
                  dangerouslySetInnerHTML={{ __html: popupHtml }}
                  style={{ margin: 0, padding: 0 }}
                />
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      <style>{`
        .gmaps-popup .leaflet-popup-content-wrapper {
          padding: 0;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.14);
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }
        .gmaps-popup .leaflet-popup-content {
          margin: 0;
          line-height: 1;
        }
        .gmaps-popup .leaflet-popup-tip-container {
          margin-top: -1px;
        }
      `}</style>
    </div>
  )
}
