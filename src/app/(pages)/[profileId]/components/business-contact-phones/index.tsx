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
    (item: BusinessPhoneProps) => !item?.isWhatsapp
  )

  const businessWhatsapp = businessPhones?.filter(
    (item: BusinessPhoneProps) => item?.isWhatsapp
  )

  return (
    <div className="mt-6 flex w-full flex-col gap-1">
      <div className="flex w-full justify-center gap-1 text-center">
        <h2 className=" max-w-lg text-center font-bold text-xl">
          Telefones de contato
        </h2>
        {isOwner && <EditContactPhones profileData={profileData} />}
      </div>
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-4">
        {!businessPhones?.length && <p>Nenhum telefone cadastrado</p>}

        {businessPhone?.map(
          (item: BusinessPhoneProps | undefined, index: number) =>
            item?.phone && (
              <div key={String(index)} className="flex w-fit gap-1">
                <Link
                  href={`phone:${item.phone}`}
                  className="flex w-52 flex-1 items-center justify-center gap-1 px-6"
                >
                  <Phone className="h-5 w-5" />
                  <p className="">{formatPhoneNumber(item.phone)}</p>
                </Link>
              </div>
            )
        )}
      </div>
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-4">
        {businessWhatsapp?.length && (
          <h2 className=" mt-8 max-w-lg text-center font-bold text-lg">
            Contatos de WhatsApp
          </h2>
        )}
        {businessWhatsapp?.map(
          (item: BusinessPhoneProps | undefined, index: number) =>
            item?.phone && (
              <div key={String(index)} className="flex w-fit gap-1">
                {item.isWhatsapp && (
                  <Link
                    href={`https://wa.me/${item.phone}`}
                    className="flex w-52 flex-1 items-center justify-center gap-1 bg-accent-green px-6"
                  >
                    <Whatsapp className="h-5 w-5" />
                    <p className="">{item.nameContact}</p>
                  </Link>
                )}
              </div>
            )
        )}
      </div>
    </div>
  )
}
