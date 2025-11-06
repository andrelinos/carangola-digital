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
    <div className="mb-4 flex w-full items-start justify-between">
      <div className="w-full">
        <div className="mr-4 flex items-center font-bold text-3xl text-muted-foreground">
          <span>{propertyData?.title}</span>
          {(isOwner || isUserAuth) && <EditPropertyTitle data={propertyData} />}
        </div>
      </div>
    </div>
  )
}
