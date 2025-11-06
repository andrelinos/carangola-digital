'use client'

import type { PropertyProps } from '@/_types/property'

import { EditPropertyFeatures } from './edit-property-features'

interface Props {
  propertyData: PropertyProps
  isOwner: boolean
  isUserAuth: boolean
}

export function PropertyFeatures({ propertyData, isOwner, isUserAuth }: Props) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="relative mb-4 flex w-fit gap-1 font-bold text-gray-900 text-xl">
        Diferenciais
        {(isOwner || isUserAuth) && (
          <EditPropertyFeatures data={propertyData} />
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {propertyData?.features?.map((feature, index) => (
          <div
            key={String(index)}
            className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2"
          >
            <div className="h-2 w-2 rounded-full bg-blue-600" />
            <span className="text-gray-700 text-sm">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
