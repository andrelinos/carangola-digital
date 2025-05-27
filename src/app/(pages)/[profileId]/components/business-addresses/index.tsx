import { Car, MapPin } from 'iconoir-react'

import type { ProfileDataProps } from '@/_types/profile-data'

import { generateGoogleMapsLink } from '@/utils/generate-link-route-google-maps'
import Link from 'next/link'
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

      <div className="flex flex-col gap-2">
        {businessAddresses?.map((item, index) => {
          return (
            item.address && (
              <Link
                key={String(index)}
                className="flex items-center gap-2 hover:underline"
                href={
                  (item?.latitude &&
                    item?.latitude &&
                    generateGoogleMapsLink({
                      latitude: Number(item.latitude),
                      longitude: Number(item.longitude),
                    })) ||
                  ''
                }
                target="_blank"
              >
                <div className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  <div className="transition-all duration-300 ease-in-out ">
                    {item.address}, - {item.neighborhood}
                  </div>
                </div>

                {item.latitude && item.longitude && <Car className="size-4" />}
              </Link>
            )
          )
        })}
      </div>

      {/* <p className="text-center font-normal text-xs">
        Clique no endereço para ver no mapa
      </p> */}
    </div>
  )
}
