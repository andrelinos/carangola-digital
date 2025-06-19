'use client'

import { Phone, Whatsapp } from 'iconoir-react'

import type { BusinessPhoneProps } from '@/_types/profile-data'
import { Link } from '@/components/ui/link'
import { formatPhoneNumber } from '@/lib/utils'
import { PhoneCall } from 'lucide-react'
import Image from 'next/image'
import { EditContactPhones } from './edit-business-contact-phones'

interface Props {
  profileData: any
  isOwner?: boolean
}

export function ContactPhones({ profileData, isOwner }: Props) {
  const businessPhones = profileData?.businessPhones || []

  const businessPhone = businessPhones?.filter(
    (item: BusinessPhoneProps) => !item?.isOnlyWhatsapp
  )

  const businessWhatsapp = businessPhones?.filter(
    (item: BusinessPhoneProps) => item?.isWhatsapp
  )

  return (
    <div className="mt-6 flex w-full flex-col items-center gap-1 px-4 pt-6 pb-24 shadow-lg">
      <div className="relative flex">
        <h2 className="flex max-w-lg items-center gap-2 text-center font-bold text-xl">
          <PhoneCall className="size-6" /> Telefones de contato
        </h2>
        {isOwner && (
          <div className="-top-5 absolute right-0 h-6 rounded-full bg-white/70">
            <EditContactPhones profileData={profileData} />
          </div>
        )}
      </div>
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-1">
        {(!businessPhone || businessPhone.length === 0) && (
          <p>Nenhum telefone para contato</p>
        )}

        {businessPhones?.length >= 1 && (
          <>
            <h2 className="mt-6 max-w-lg text-center font-bold text-lg">
              Telefones
            </h2>
            {businessPhone?.map(
              (item: BusinessPhoneProps | undefined, index: number) =>
                item?.phone && (
                  <Link
                    key={String(index)}
                    href={`tel:${item.phone}`}
                    className="flex w-full flex-1 items-center justify-center gap-1 px-6 text-white sm:w-64"
                  >
                    <Phone className="h-5 w-5" />
                    <p className="">{formatPhoneNumber(item.phone)}</p>
                  </Link>
                )
            )}
          </>
        )}
      </div>
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-1">
        {!!businessWhatsapp?.length && (
          <h2 className=" mt-8 max-w-lg text-center font-bold text-lg">
            WhatsApp
          </h2>
        )}
        {businessWhatsapp?.map(
          (item: BusinessPhoneProps | undefined, index: number) =>
            item?.phone &&
            item.isWhatsapp && (
              <Link
                key={String(index)}
                href={`https://wa.me/+55${item.phone}?text=Olá! Vi seu contato no Carangola Digital e gostaria de saber mais.`}
                target="_blank"
                className="flex w-full flex-1 items-center justify-center gap-1 bg-accent-green px-6 text-white sm:w-64"
              >
                {item?.imageProfileWhatsApp && (
                  <span>
                    <Image
                      width={24}
                      height={24}
                      src={item?.imageProfileWhatsApp || ''}
                      alt=""
                    />
                  </span>
                )}
                <Whatsapp className="h-5 w-5" />
                <p className="">{item.nameContact}</p>
              </Link>
            )
        )}
      </div>
    </div>
  )
}
