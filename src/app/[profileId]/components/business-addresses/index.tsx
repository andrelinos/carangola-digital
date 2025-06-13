import { MapPin } from 'iconoir-react'

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
    <div className="mt-6 flex w-full flex-col items-center gap-1 bg-blue-50 px-4 pt-6 pb-12">
      <div className="flex w-full justify-center gap-1 text-center">
        <h2 className="text-center font-bold text-xl">Endereços</h2>
        {isOwner && <EditBusinessAddresses data={businessAddresses} />}
      </div>
      {!businessAddresses?.length && <p>Nenhum endereço cadastrado</p>}

      <div className="flex flex-col gap-2">
        {businessAddresses?.map((item, index) => {
          return (
            item.address && (
              <div key={String(index)} className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  <div className="transition-all duration-300 ease-in-out ">
                    {item.address}, - {item.neighborhood}
                  </div>
                </div>

                {item.latitude && item.longitude && (
                  <Link
                    className="flex items-center gap-2 font-medium text-blue-500 text-xs hover:underline"
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
                    Como chegar
                  </Link>
                )}
              </div>
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
