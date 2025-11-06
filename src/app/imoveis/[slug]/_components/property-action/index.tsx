'use client'

import type { PropertyProps } from '@/_types/property'
import { EditPropertyActionCard } from './edit-property-action'
import { PropertyContactModal } from './property-contact-modal'

interface Props {
  propertyData: PropertyProps
  isOwner: boolean
  isUserAuth: boolean
}

export function PropertyAction({ propertyData, isOwner, isUserAuth }: Props) {
  return (
    <div className="rounded-lg bg-blue-50 p-6 shadow">
      <div className=" mb-4 flex w-fit gap-1 font-bold text-gray-900 text-xl">
        Interessado?
        {(isOwner || isUserAuth) && (
          <EditPropertyActionCard data={propertyData} />
        )}
      </div>

      <p className="mb-4 text-gray-700 text-sm">
        Entre em contato para mais informações sobre este imóvel.
      </p>
      <PropertyContactModal property={propertyData} />
    </div>
  )
}
