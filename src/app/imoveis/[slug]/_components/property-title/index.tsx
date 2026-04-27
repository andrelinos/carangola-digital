'use client'

import type { PropertyProps } from '@/_types/property'
import { EditPropertyTitle } from './edit-property-title'

interface Props {
  propertyData: PropertyProps
  isOwner: boolean
  isUserAuth: boolean
}

export function PropertyTitle({ propertyData, isOwner, isUserAuth }: Props) {
  return (
    <div className="mb-2 flex w-full items-start justify-between">
      <div className="w-full">
        <h1 className="mr-4 flex w-fit items-center font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
          <span className="break-words">{propertyData?.title}</span>
          {(isOwner || isUserAuth) && <EditPropertyTitle data={propertyData} />}
        </h1>
      </div>
    </div>
  )
}
