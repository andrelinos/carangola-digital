'use client'

import type { PropertyProps } from '@/_types/property'
import { FooterEditModal } from '@/components/commons/footer-edit-modal'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/custom-modal'
import { Label } from '@/components/ui/label'
import { Link } from '@/components/ui/link'
import { formatPhoneNumber } from '@/utils/format-phone-number'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  property?: PropertyProps
}

export function PropertyContactModal({ property }: Props) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleOpenModal() {
    setIsOpen(true)
  }

  function onClose() {
    setIsOpen(false)
  }

  const slugProperty = property?.slug ?? ''
  const socialLink = property?.actionContactSocial?.startsWith('https://')
    ? property?.actionContactSocial
    : ''

  const phoneCall = formatPhoneNumber(property?.actionContactPhone) ?? ''

  const hasAnyContact =
    property?.actionContactPhone ||
    property?.actionContactSocial ||
    property?.actionContactEmail ||
    property?.actionContactWhatsApp

  return (
    <>
      <Button
        onClick={handleOpenModal}
        className="w-full"
        title="Entrar em Contato"
      >
        {property?.actionButtonTitle ?? 'Entrar em contato'}
      </Button>

      <Modal
        isOpen={isOpen}
        setIsOpen={onClose}
        title="Entrar em contato"
        description="Entre em contato com o responsável"
        classname="w-full max-w-lg space-y-4 rounded-2xl border-[0.5px] border-blue-300 text-zinc-700 p-6 bg-white"
      >
        {hasAnyContact ? (
          <div className="grid grid-cols-2 gap-4">
            {phoneCall && (
              <div className="flex flex-col gap-1">
                <Label>Telefone</Label>
                <Link href={`tel:${phoneCall}`}>{phoneCall}</Link>
              </div>
            )}
            {property?.actionContactWhatsApp && (
              <div className="flex flex-col gap-1">
                <Label>Whatsapp</Label>
                <Link
                  href={`https://wa.me/+55${property?.actionContactWhatsApp}?text=Olá! Vi seu contato no Carangola Digital e gostaria de saber mais sobre a propriedade https://carangoladigital.com.br/imoveis/${slugProperty}`}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Whatsapp
                </Link>
              </div>
            )}

            {property?.actionContactEmail && (
              <div className="flex flex-col gap-1">
                <Label>Email</Label>
                <Link href={`mailto:${property?.actionContactEmail}`}>
                  E-mail
                </Link>
              </div>
            )}

            {socialLink && (
              <div className="flex flex-col gap-1">
                <Label>Rede social</Label>
                <Link href={socialLink}>Rede social</Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid">
            <p className="text-center">Nenhum contato disponível</p>
          </div>
        )}

        <FooterEditModal onClose={onClose} isSubmitting={isSubmitting} />
      </Modal>
    </>
  )
}
