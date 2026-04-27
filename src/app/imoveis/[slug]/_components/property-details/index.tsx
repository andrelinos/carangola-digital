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

  if (!propertyData?.characteristics) {
    return <div />
  }
  return (
    <div className="w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="relative mb-6 flex w-fit items-center font-bold text-gray-900 text-xl tracking-tight">
        Características
        {(isOwner || isUserAuth) && <EditPropertyDetails data={propertyData} />}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Square className="h-6 w-6" />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm">Área</p>
            <p className="font-semibold text-gray-900">{propertyData?.characteristics?.area} m²</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Bed className="h-6 w-6" />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm">Quartos</p>
            <p className="font-semibold text-gray-900">{propertyData?.characteristics?.bedrooms}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Bath className="h-6 w-6" />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm">Banheiros</p>
            <p className="font-semibold text-gray-900">{propertyData?.characteristics?.bathrooms}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Car className="h-6 w-6" />
          </div>
          <div>
            <p className="text-gray-500 font-medium text-sm">Vagas</p>
            <p className="font-semibold text-gray-900">{propertyData?.characteristics?.garageSpots}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
