'use client'

import type {
  BusinessPhoneProps,
  ProfileDataProps,
} from '@/_types/profile-data'
import { Link } from '@/components/ui/link'
import { SafeImage } from '@/components/ui/safe-image'
import { formatPhoneNumber } from '@/utils/format-phone-number'
import clsx from 'clsx'
import { Phone, Whatsapp } from 'iconoir-react'
import { PhoneCall } from 'lucide-react'
import { EditContactPhones } from './edit-business-contact-phones'

interface Props {
  profileData: ProfileDataProps
  isOwner?: boolean
  isUserAuth?: boolean
}

export function ContactPhones({ profileData, isOwner, isUserAuth }: Props) {
  const businessPhones = profileData?.businessPhones || []
  const profileId = profileData?.id || ''

  const phoneContacts = businessPhones?.filter(
    (item: BusinessPhoneProps) => !item?.isOnlyWhatsapp
  )
  const whatsappContacts = businessPhones?.filter(
    (item: BusinessPhoneProps) => item?.isWhatsapp
  )

  return (
    <div className="my-6 flex w-full flex-col items-center gap-6 rounded-xl p-6 pb-16">
      <div className="relative mx-auto flex justify-center">
        <h2 className="flex items-center gap-2 text-center font-bold text-background-secondary text-xl">
          <PhoneCall className="size-6" />
          Telefones de contato
        </h2>
        {(isOwner || isUserAuth) && (
          <div className="-top-5 absolute right-0">
            <EditContactPhones data={{ businessPhones, profileId }} />
          </div>
        )}
      </div>

      {phoneContacts && phoneContacts.length > 0 && (
        <div className="flex w-full flex-col items-center gap-3">
          <h3 className="font-semibold text-muted-foreground">Telefones</h3>
          {phoneContacts.map((item: BusinessPhoneProps, index: number) => (
            <Link
              key={`phone-${String(index)}`}
              href={`tel:${item.phone}`}
              className="hover:-translate-y-1 flex w-full max-w-xs transform items-center justify-center gap-2 rounded-lg bg-blue-600 p-3 text-white shadow-md transition-transform duration-200 hover:shadow-xl"
            >
              <Phone className="h-5 w-5" />
              <span className="font-medium tracking-wider">
                {formatPhoneNumber(item.phone)}
              </span>
            </Link>
          ))}
        </div>
      )}

      {whatsappContacts && whatsappContacts.length > 0 && (
        <div className="flex w-full flex-col items-center gap-3">
          <h3 className="font-semibold text-muted-foreground">WhatsApp</h3>
          {whatsappContacts.map((item: BusinessPhoneProps, index: number) => (
            <Link
              key={`whatsapp-${String(index)}`}
              href={`https://wa.me/+55${item.phone}?text=Olá! Vi seu contato no Carangola Digital e gostaria de saber mais.`}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                'hover:-translate-y-1 flex w-full max-w-xs transform items-center gap-3 rounded-lg bg-green-500 p-2.5 text-white shadow-md transition-transform duration-200 hover:bg-green-600 hover:shadow-xl',
                {
                  'justify-center': !item?.imageProfileWhatsApp,
                  'justify-start': item?.imageProfileWhatsApp,
                }
              )}
            >
              {item?.imageProfileWhatsApp && (
                <SafeImage
                  width={40}
                  height={40}
                  src={item?.imageProfileWhatsApp || '/default-image.png'}
                  alt={`Foto de ${item.nameContact}`}
                  className="h-10 w-10 rounded-full border-2 border-white/80 object-cover"
                />
              )}

              <div
                className={clsx('flex flex-1 items-center gap-2', {
                  'justify-center': !item?.imageProfileWhatsApp,
                  'justify-start': item?.imageProfileWhatsApp,
                })}
              >
                <Whatsapp className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{item.nameContact}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {businessPhones.length === 0 && (
        <p className="pt-4 text-center text-muted-foreground">
          Nenhum telefone de contato cadastrado.
        </p>
      )}
    </div>
  )
}
