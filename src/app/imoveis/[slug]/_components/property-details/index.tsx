'use client'

import type { PropertyProps } from '@/_types/property'
import { Bath, Bed, Car, Square } from 'lucide-react'
import { EditPropertyDetails } from './edit-property-details'

interface Props {
  propertyData: PropertyProps
  isOwner: boolean
  isUserAuth: boolean
}

export function PropertyDetails({ propertyData, isOwner, isUserAuth }: Props) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="relative mb-4 flex w-fit items-center font-bold text-gray-900 text-xl">
        Características
        {(isOwner || isUserAuth) && <EditPropertyDetails data={propertyData} />}
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="flex items-center gap-3">
          <Square className="h-8 w-8 text-blue-600" />
          <div>
            <p className="text-gray-600 text-sm">Área</p>
            <p className="font-semibold text-gray-900">
              {propertyData?.characteristics?.area} m²
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Bed className="h-8 w-8 text-blue-600" />
          <div>
            <p className="text-gray-600 text-sm">Quartos</p>
            <p className="font-semibold text-gray-900">
              {propertyData?.characteristics?.bedrooms}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Bath className="h-8 w-8 text-blue-600" />
          <div>
            <p className="text-gray-600 text-sm">Banheiros</p>
            <p className="font-semibold text-gray-900">
              {propertyData?.characteristics?.bathrooms}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Car className="h-8 w-8 text-blue-600" />
          <div>
            <p className="text-gray-600 text-sm">Vagas</p>
            <p className="font-semibold text-gray-900">
              {propertyData?.characteristics?.garageSpots}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
