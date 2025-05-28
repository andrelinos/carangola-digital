'use client'

import {
  FacebookIcon,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share'

import { Copy, SendDiagonal } from 'iconoir-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import { Modal } from '@/components/ui/modal'

export function ShareButton() {
  const profileId = useParams().profileId as string

  const [isOpen, setIsOpen] = useState(false)

  function handleOpenModal() {
    setIsOpen(!isOpen)
  }

  function onClose() {
    setIsOpen(false)
  }

  const shareUrl = `https://localhost:3000/${profileId}`

  return (
    <>
      <button
        onClick={handleOpenModal}
        type="button"
        className="flex h-fit flex-col items-center text-zinc-600"
      >
        <span className="text-xs">Compartilhar</span>
        <SendDiagonal className="size-8 stroke-1" />
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
      </Modal>
    </>
  )
}
