'use client'

import { Phone, Whatsapp } from 'iconoir-react'

import { Button } from '@/components/ui/button'
import { EditContactPhones } from './edit-business-contact-phones'

interface Props {
  profileData: any
  isOwner?: boolean
}

export function ContactPhones({ profileData, isOwner }: Props) {
  const businessPhones = profileData?.businessPhones || []

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

        {businessPhones?.map((phone: any, index: number) => (
          <div key={String(index)} className="flex w-fit gap-1">
            <Button className="flex w-52 flex-1 items-center justify-center gap-1 px-6">
              <Phone className="h-5 w-5" />
              <p className="">{phone.phone}</p>
            </Button>
            <Button className="bg-accent-green">
              <Whatsapp className="h-5 w-5" />
              <p className="text-sm">{phone.whatsapp}</p>
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
