'use client'

import type { PropertyProps } from '@/_types/property'
import { formatPrice } from '@/utils/format-price'
import { EditPropertyPrice } from './edit-property-price'

interface Props {
  propertyData: PropertyProps
  isOwner: boolean
  isUserAuth: boolean
}

export function PropertyPrice({ propertyData, isOwner, isUserAuth }: Props) {
  return (
    <div className="w-fit pt-4">
      <p className="mb-1 text-gray-600 text-sm">Valor</p>
      <div className="relative flex items-center font-bold text-3xl text-blue-600 dark:text-blue-400">
        {formatPrice(Number(propertyData.price))}
        {(isOwner || isUserAuth) && <EditPropertyPrice data={propertyData} />}
      </div>
    </div>
  )
}
