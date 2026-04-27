'use client'

import { Car, MapPin } from 'lucide-react'
import { useState } from 'react'

import type { PropertyProps } from '@/_types/property'
import { Link } from '@/components/ui/link'
import {
  generateGoogleMapsLinkByAddress,
  generateGoogleMapsLinkByCoords,
} from '@/utils/generate-link-route-google-maps'
import { EditPropertyAddresses } from './edit-property-address'

interface Props {
  propertyData: PropertyProps
  isOwner: boolean
  isUserAuth: boolean
}

export function PropertyAddress({ propertyData, isOwner, isUserAuth }: Props) {
  const fullAddress = `${propertyData?.address}, ${propertyData?.neighborhood}, Carangola - MG, ${propertyData?.cep}`

  const itemMapsLink =
    propertyData?.latitude && propertyData?.longitude
      ? generateGoogleMapsLinkByCoords({
          latitude: Number(propertyData?.latitude),
          longitude: Number(propertyData?.longitude),
        })
      : generateGoogleMapsLinkByAddress(fullAddress)

  return (
    <div className="w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="w-full">
          <div className="flex w-full flex-col gap-4">
            <div className="relative mb-2 w-fit font-bold text-xl tracking-tight text-slate-900">
              Endereço
              {(isOwner || isUserAuth) && (
                <div className="-right-8 absolute top-0 h-6">
                  <EditPropertyAddresses data={propertyData} />
                </div>
              )}
            </div>
            {propertyData?.address ? (
              <div className="flex w-full flex-col gap-4 rounded-xl bg-slate-50 border border-slate-100 p-5 transition-colors hover:bg-slate-100/80">
                <div className="flex items-start gap-3">
                  <div className="flex mt-0.5 h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <MapPin className="size-4" />
                  </div>
                  <div className="flex flex-1 flex-col text-slate-700">
                    <p className="font-semibold text-slate-900">{propertyData?.address}</p>
                    <p className="mt-1 text-sm">{propertyData.neighborhood}, Carangola/MG</p>
                    <p className="text-sm">{propertyData.cep}</p>
                  </div>
                </div>

                <div className="flex w-full justify-end mt-2">
                  <Link
                    variant="default"
                    className="group relative h-9 w-fit bg-blue-600 px-5 py-2 font-semibold text-white text-sm rounded-lg hover:bg-blue-700 transition"
                    href={itemMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="-top-4 -left-2 pointer-events-none absolute flex h-7 w-7 items-center justify-center rounded-full border-2 border-blue-100 bg-white text-blue-600 shadow-md transition-all duration-500 ease-out group-hover:left-[80%]">
                      <Car className="size-4 stroke-2" />
                    </span>
                    Como chegar
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
