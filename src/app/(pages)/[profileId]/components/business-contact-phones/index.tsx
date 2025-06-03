'use client'

import { Phone, Whatsapp } from 'iconoir-react'

import type { BusinessPhoneProps } from '@/_types/profile-data'
import { Link } from '@/components/ui/link'
import { formatPhoneNumber } from '@/lib/utils'
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
    <div className="mt-6 flex w-full flex-col gap-1 bg-green-50 p-4">
      <div className="flex w-full justify-center gap-1 text-center">
        <h2 className=" max-w-lg text-center font-bold text-xl">
          Telefones de contato
        </h2>
        {isOwner && <EditContactPhones profileData={profileData} />}
      </div>
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-4">
        {(!businessPhone || businessPhone.length === 0) && (
          <p>Nenhum telefone para contato</p>
        )}

        {businessPhones?.length >= 1 &&
          businessPhone?.map(
            (item: BusinessPhoneProps | undefined, index: number) =>
              item?.phone && (
                <Link
                  key={String(index)}
                  href={`phone:${item.phone}`}
                  className="flex w-full flex-1 items-center justify-center gap-1 px-6 sm:w-64"
                >
                  <Phone className="h-5 w-5" />
                  <p className="">{formatPhoneNumber(item.phone)}</p>
                </Link>
              )
          )}
      </div>
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-4">
        {!!businessWhatsapp?.length && (
          <h2 className=" mt-8 max-w-lg text-center font-bold text-lg">
            Contatos de WhatsApp
          </h2>
        )}
        {businessWhatsapp?.map(
          (item: BusinessPhoneProps | undefined, index: number) =>
            item?.phone &&
            item.isWhatsapp && (
              <Link
                key={String(index)}
                href={`https://wa.me/+55${item.phone}`}
                className="flex w-full flex-1 items-center justify-center gap-1 bg-accent-green px-6 sm:w-64"
              >
                <Whatsapp className="h-5 w-5" />
                <p className="">{item.nameContact}</p>
              </Link>
            )
        )}
      </div>
    </div>
  )
}
