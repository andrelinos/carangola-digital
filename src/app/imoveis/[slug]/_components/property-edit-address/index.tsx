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
  const [tempValue, setTempValue] = useState<any>('')
  const [editingField, setEditingField] = useState<string | null>(null)

  const openModal = (field: string, currentValue: any) => {
    setEditingField(field)
    setTempValue(currentValue)
  }

  const fullAddress = `${propertyData?.address}, ${propertyData?.neighborhood}, Carangola - MG, ${propertyData?.cep}`

  const itemMapsLink =
    propertyData?.latitude && propertyData?.longitude
      ? generateGoogleMapsLinkByCoords({
          latitude: Number(propertyData?.latitude),
          longitude: Number(propertyData?.longitude),
        })
      : generateGoogleMapsLinkByAddress(fullAddress)

  return (
    <div className="w-full rounded-lg p-6 shadow">
      <div className="mb-4 flex items-start justify-between">
        <div className="w-full">
          <div className="flex w-full flex-col gap-2">
            <div className="relative mt-4 w-fit font-bold text-xl">
              Endereço
              {(isOwner || isUserAuth) && (
                <div className="-right-7 absolute top-0 h-6 rounded-full">
                  <EditPropertyAddresses data={propertyData} />
                </div>
              )}
            </div>
            {propertyData?.address ? (
              <div className="flex w-full flex-col gap-2 p-4 hover:bg-accent">
                <div className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  <div className="flex flex-1 flex-col">
                    <p>{propertyData?.address}</p>
                    <p>{propertyData.neighborhood}, Carangola/MG</p>
                    <p>{propertyData.cep}</p>
                  </div>
                </div>

                <div className="flex w-full justify-end">
                  <Link
                    variant="default"
                    className="group relative h-8 w-fit bg-blue-600 px-4 py-1 font-semibold text-white text-xs"
                    href={itemMapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="-top-4 -left-2 pointer-events-none absolute flex h-6 w-6 items-center justify-center rounded-full border border-blue-500 bg-white text-blue-500 shadow-lg transition-all duration-500 ease-out group-hover:left-20">
                      <Car className="size-4 stroke-2" />
                    </span>
                    <span className="-top-4 -left-2 absolute flex h-6 w-6 scale-100 transform items-center justify-center rounded-full border border-blue-500 bg-white text-blue-500 opacity-50 transition-all duration-300 ease-linear group-hover:scale-150 group-hover:opacity-0" />
                    Como chegar
                  </Link>
                </div>
              </div>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
