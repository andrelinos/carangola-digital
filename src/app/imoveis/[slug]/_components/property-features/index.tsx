'use client'

import { Check } from 'lucide-react'
import type { PropertyProps } from '@/_types/property'

import { EditPropertyFeatures } from './edit-property-features'

interface Props {
  propertyData: PropertyProps
  isOwner: boolean
  isUserAuth: boolean
}

export function PropertyFeatures({ propertyData, isOwner, isUserAuth }: Props) {
  if (!propertyData?.features?.length) return null

  return (
    <div className="w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="relative mb-6 flex w-fit gap-1 font-bold text-gray-900 text-xl tracking-tight">
        Diferenciais
        {(isOwner || isUserAuth) && (
          <EditPropertyFeatures data={propertyData} />
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {propertyData?.features?.map((feature, index) => (
          <div
            key={String(index)}
            className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-100 px-4 py-3 transition-colors hover:bg-slate-100"
          >
            <div className="flex shrink-0 items-center justify-center rounded-full bg-blue-100 p-1 text-blue-600">
              <Check className="h-4 w-4" strokeWidth={3} />
            </div>
            <span className="text-slate-700 font-medium text-sm">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
