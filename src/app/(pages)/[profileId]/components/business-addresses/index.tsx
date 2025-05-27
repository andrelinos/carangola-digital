import { MapPin } from 'iconoir-react'

import type { ProfileDataProps } from '@/_types/profile-data'
import { EditBusinessAddresses } from './edit-business-addresses'

interface Props {
  profileData: ProfileDataProps
  isOwner?: boolean
}

export function BusinessAddresses({ profileData, isOwner }: Props) {
  const businessAddresses = profileData?.businessAddresses

  return (
    <div className="mt-6 flex flex-col gap-3">
      <div className="flex w-full justify-center gap-1 text-center">
        <h2 className="text-center font-bold text-xl">Endereços</h2>
        {isOwner && <EditBusinessAddresses data={businessAddresses} />}
      </div>
      {!businessAddresses?.length && <p>Nenhum endereço cadastrado</p>}

      {businessAddresses?.map((address, index) => {
        return (
          <div key={String(index)} className="flex items-center gap-1">
            <MapPin className="size-4" />
            <div className="transition-all duration-300 ease-in-out ">
              {address.address}, - {address.neighborhood}
            </div>
          </div>
        )
      })}

      {/* <p className="text-center font-normal text-xs">
        Clique no endereço para ver no mapa
      </p> */}
    </div>
  )
}
