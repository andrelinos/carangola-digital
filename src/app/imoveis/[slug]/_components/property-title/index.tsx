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
        <h1 className="mr-4 flex w-fit items-center font-extrabold text-3xl text-slate-900 leading-tight tracking-tight sm:text-4xl">
          <span className="break-words">{propertyData?.title}</span>
          {(isOwner || isUserAuth) && <EditPropertyTitle data={propertyData} />}
        </h1>
      </div>
    </div>
  )
}
