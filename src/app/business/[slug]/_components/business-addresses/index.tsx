import { MapPin } from 'iconoir-react'
import type { ProfileDataProps } from '@/_types/profile-data'
import { Link } from '@/components/ui/link'
import {
  generateGoogleMapsLinkByAddress,
  generateGoogleMapsLinkByCoords,
} from '@/utils/generate-link-route-google-maps'
import { Navigation } from 'lucide-react'
import { EditBusinessAddresses } from './edit-business-addresses'
import { ProfileSection } from '../profile-section'

interface Props {
  profileData: ProfileDataProps
  isOwner?: boolean
  isUserAuth?: boolean
}

export function BusinessAddresses({ profileData, isOwner, isUserAuth }: Props) {
  const businessAddresses = profileData?.businessAddresses || []
  const profileId = profileData?.id || ''

  return (
    <ProfileSection 
      title="Localização" 
      icon={<MapPin className="size-6" />}
      delay={0.3}
    >
      <div className="relative">
        {(isOwner || isUserAuth) && (
          <div className="absolute -top-12 right-0">
            <EditBusinessAddresses data={{ businessAddresses, profileId }} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {!businessAddresses?.length ? (
            <p className="text-muted-foreground text-sm italic col-span-full">Nenhum endereço cadastrado</p>
          ) : (
            businessAddresses.map((item, index) => {
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
                    className="group relative flex flex-col justify-between gap-6 rounded-2xl bg-slate-50 p-6 transition-all hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-900/60"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 flex size-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                        <MapPin className="size-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg text-foreground leading-tight tracking-tight">{item.address}</p>
                        <p className="text-muted-foreground text-sm mt-1">
                          {item.neighborhood}, Carangola/MG
                        </p>
                        <p className="text-muted-foreground text-xs mt-1 font-medium">{item.cep}</p>
                      </div>
                    </div>

                    <Link
                      href={itemMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-md shadow-primary/10 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Navigation className="size-4" />
                      Como chegar
                    </Link>
                  </div>
                )
              )
            })
          )}
        </div>
      </div>
    </ProfileSection>
  )
}
