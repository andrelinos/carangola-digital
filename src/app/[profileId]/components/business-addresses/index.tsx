import { MapPin } from 'iconoir-react'

import type { ProfileDataProps } from '@/_types/profile-data'

import { Link } from '@/components/ui/link'
import { generateGoogleMapsLink } from '@/utils/generate-link-route-google-maps'
import { Car } from 'lucide-react'
import { EditBusinessAddresses } from './edit-business-addresses'

interface Props {
  profileData: ProfileDataProps
  isOwner?: boolean
}

export function BusinessAddresses({ profileData, isOwner }: Props) {
  const businessAddresses = profileData?.businessAddresses

  return (
    <div className="mt-6 flex w-full flex-col items-center gap-1 px-4 pt-6 pb-12 shadow-lg">
      <div className="mb-6 flex w-full justify-center gap-1 bg-zinc-100 p-6 text-center">
        <h2 className="text-center font-bold text-xl">Endereços</h2>
        {isOwner && <EditBusinessAddresses data={businessAddresses} />}
      </div>
      {!businessAddresses?.length && <p>Nenhum endereço cadastrado</p>}

      <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center gap-1">
        {businessAddresses?.map((item, index) => {
          return (
            item.address && (
              <div
                key={String(index)}
                className="flex w-full items-center justify-between gap-2 border-zinc-100 border-y p-4 hover:bg-zinc-50"
              >
                <div className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  <div className="flex flex-1 flex-col">
                    <p>{item.address}</p>
                    <p>{item.neighborhood}</p>
                    <p>Carangola/MG</p>
                  </div>
                </div>

                {item.latitude && item.longitude && (
                  <Link
                    variant="tertiary"
                    className="group relative w-14 bg-blue-600 px-2 py-1 text-white text-xs"
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
                    <span className="-top-4 -left-2 absolute flex h-6 w-6 items-center justify-center rounded-full border border-blue-500 bg-white text-blue-500 shadow-lg transition-all duration-500 ease-out group-hover:left-10">
                      <Car className="size-4 stroke-2" />
                    </span>
                    <span className="-top-4 -left-2 absolute flex h-6 w-6 scale-100 transform items-center justify-center rounded-full border border-blue-500 bg-white text-blue-500 opacity-50 transition-all duration-300 ease-linear group-hover:scale-150 group-hover:opacity-0" />
                    Como <br />
                    chegar
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
