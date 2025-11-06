'use client'

import { usePathname } from 'next/navigation'
import {
  FacebookIcon,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share'

import { Copy, ShareAndroid } from 'iconoir-react'
import { useState } from 'react'

import { FooterEditModal } from '@/components/commons/footer-edit-modal'
import { Modal } from '@/components/ui/custom-modal'

export function ShareButton() {
  const path = usePathname()

  const [isOpen, setIsOpen] = useState(false)

  function handleOpenModal() {
    setIsOpen(!isOpen)
  }

  function onClose() {
    setIsOpen(false)
  }

  const shareUrl = `https://carangoladigital.com.br/${path}`

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleOpenModal}
        type="button"
        className="group flex h-fit items-center gap-2 rounded-lg bg-zinc-600 px-4 py-1 text-white hover:cursor-pointer"
      >
        <ShareAndroid className="size-6 stroke-1 transition-all duration-300 ease-in-out group-hover:scale-115" />
        <span className="">Compartilhar</span>
      </button>

      <Modal
        isOpen={isOpen}
        setIsOpen={onClose}
        title="Compartilhe este perfil"
        description="Escolha a plataforma que você deseja compartilhar este perfil"
        classname="w-full max-w-lg justify-center sm:rounded-2xl border-[0.5px] border-blue-300 text-zinc-700 bg-white p-6"
      >
        <div className="items-end-safe lg:fex-row flex max-h-[90vh] w-full flex-col gap-4 overflow-y-auto py-6">
          <div className="flex w-full justify-center gap-4 ">
            <FacebookShareButton url={shareUrl} className="">
              <FacebookIcon size={44} round />
            </FacebookShareButton>
            <WhatsappShareButton url={shareUrl} className="">
              <WhatsappIcon size={44} round />
            </WhatsappShareButton>
            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-full bg-orange-500 text-white transition-colors duration-300 hover:cursor-pointer"
            >
              <Copy className="size-8" />
            </button>
          </div>
        </div>
        <FooterEditModal onClose={onClose} />
      </Modal>
    </div>
  )
}
