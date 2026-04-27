'use client'

import type { PropertyProps } from '@/_types/property'
import { ShareButton } from '@/app/business/[slug]/_components/like-share-buttons/share-button'
import { EditPropertyActionCard } from './edit-property-action'
import { PropertyContactModal } from './property-contact-modal'

interface Props {
  propertyData: PropertyProps
  isOwner: boolean
  isUserAuth: boolean
}

export function PropertyAction({ propertyData, isOwner, isUserAuth }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
        <div className="mb-4 flex w-fit gap-1 font-bold text-slate-900 text-xl tracking-tight">
          Tem interesse?
          {(isOwner || isUserAuth) && (
            <EditPropertyActionCard data={propertyData} />
          )}
        </div>

        <p className="mb-6 text-slate-600 text-sm leading-relaxed">
          Entre em contato diretamente e garanta a melhor negociação para este imóvel.
        </p>
        <PropertyContactModal property={propertyData} />
      </div>
      <div className="flex w-full justify-center mt-2">
        <ShareButton />
      </div>
    </div>
  )
}
