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
      <p className="mb-0.5 text-slate-500 font-medium text-sm">Valor de venda</p>
      <div className="relative flex w-fit items-center font-extrabold text-3xl sm:text-4xl text-blue-600 tracking-tight">
        {formatPrice(Number(propertyData.price))}
        {(isOwner || isUserAuth) && (
          <div className="-right-8 absolute top-0">
            <EditPropertyPrice data={propertyData} />
          </div>
        )}
      </div>
    </div>
  )
}
