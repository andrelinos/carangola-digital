import { MapPin } from 'iconoir-react'

import type { ProfileDataProps } from '@/_types/profile-data'

import { Link } from '@/components/ui/link'
import {
  generateGoogleMapsLinkByAddress,
  generateGoogleMapsLinkByCoords,
} from '@/utils/generate-link-route-google-maps'
import { Car } from 'lucide-react'
import { EditBusinessAddresses } from './edit-business-addresses'

interface Props {
  profileData: ProfileDataProps
  isOwner?: boolean
  isUserAuth?: boolean
}

export function BusinessAddresses({ profileData, isOwner, isUserAuth }: Props) {
  const businessAddresses = profileData?.businessAddresses || []
  const profileId = profileData?.id || ''

  return (
    <div className="mt-6 flex w-full flex-col items-center gap-1 rounded-b-xl px-4 pt-6 pb-16">
      <div className="relative flex">
        <h2 className="flex items-center gap-2 text-center font-bold text-xl">
          <MapPin className="size-6" /> Endereços
        </h2>
        {(isOwner || isUserAuth) && (
          <div className="-top-5 absolute right-0 h-6 rounded-full ">
            <EditBusinessAddresses data={{ businessAddresses, profileId }} />
          </div>
        )}
      </div>
      {!businessAddresses?.length && <p>Nenhum endereço cadastrado</p>}

      <div className="mx-auto flex w-full max-w-full flex-col items-center justify-center gap-1">
        {businessAddresses?.map((item, index) => {
          const fullAddress = `${item.address}, ${item.neighborhood}, Carangola - MG, ${item.cep}`

          const itemMapsLink =
            item.latitude && item.longitude
              ? generateGoogleMapsLinkByCoords({
                  latitude: Number(item.latitude),
                  longitude: Number(item.longitude),
                })
              : generateGoogleMapsLinkByAddress(fullAddress)

          return (
            item.address && (
              <div
                key={String(index)}
                className="flex w-full flex-col gap-2 p-4 hover:bg-accent"
              >
                <div className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  <div className="flex flex-1 flex-col">
                    <p>{item.address}</p>
                    <p>{item.neighborhood}, Carangola/MG</p>
                    <p>{item.cep}</p>
                  </div>
                </div>

                {(Number(item.latitude) && Number(item.longitude)) ||
                item.address ? (
                  <div className="flex w-full justify-end">
                    <Link
                      variant="default"
                      className="group relative h-8 w-fit bg-blue-600 px-4 py-1 font-semibold text-white text-xs"
                      href={itemMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="-top-4 -left-2 pointer-events-none absolute flex h-6 w-6 items-center justify-center rounded-full border border-blue-500 bg-white text-blue-500 shadow-lg transition-all duration-500 ease-out group-hover:left-20">
                        <Car className="size-4 stroke-2" />
                      </span>
                      <span className="-top-4 -left-2 absolute flex h-6 w-6 scale-100 transform items-center justify-center rounded-full border border-blue-500 bg-white text-blue-500 opacity-50 transition-all duration-300 ease-linear group-hover:scale-150 group-hover:opacity-0" />
                      Como chegar
                    </Link>
                  </div>
                ) : (
                  <div />
                )}
              </div>
            )
          )
        })}
      </div>
    </div>
  )
}
