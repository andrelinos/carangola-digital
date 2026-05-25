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
    <div className="w-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="relative mb-6 flex w-fit gap-1 font-bold text-slate-900 text-xl tracking-tight">
        Descrição do Imóvel
        {(isOwner || isUserAuth) && (
          <EditPropertyDescription data={propertyData} />
        )}
      </div>
      <p className="whitespace-pre-wrap text-slate-600 leading-relaxed">
        {propertyData?.description || 'Nenhuma descrição fornecida.'}
      </p>
    </div>
  )
}
