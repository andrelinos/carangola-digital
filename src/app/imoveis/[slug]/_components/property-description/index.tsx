'use client'

import type { PropertyProps } from '@/_types/property'
import { EditPropertyDescription } from './edit-property-description'

interface Props {
  propertyData: PropertyProps
  isOwner: boolean
  isUserAuth: boolean
}

export function PropertyDescription({
  propertyData,
  isOwner,
  isUserAuth,
}: Props) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className=" mb-4 flex w-fit gap-1 font-bold text-gray-900 text-xl">
        Descrição
        {(isOwner || isUserAuth) && (
          <EditPropertyDescription data={propertyData} />
        )}
      </div>
      <p className="text-gray-700 leading-relaxed">
        {propertyData?.description}
      </p>
    </div>
  )
}
