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
    <div className="w-fit">
      <p className="mb-0.5 font-medium text-slate-500 text-sm">
        Valor de venda
      </p>
      <div className="relative flex w-fit items-center font-extrabold text-3xl text-blue-600 tracking-tight sm:text-4xl">
        {formatPrice(Number(propertyData.price))}
        {(isOwner || isUserAuth) && (
          <div className="absolute top-0 -right-8">
            <EditPropertyPrice data={propertyData} />
          </div>
        )}
      </div>
    </div>
  )
}
