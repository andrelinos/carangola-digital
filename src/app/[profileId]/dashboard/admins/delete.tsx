'use client'

import { Trash } from 'iconoir-react'
import { useParams, useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

import { createBusinessAddress } from '@/actions/create-business-address'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { toast } from 'sonner'

interface Props {
  adminUID: string
}

export function RemoveAdminFromManagerProfile({ adminUID }: Props) {
  const router = useRouter()
  const profileId = useParams().profileId as string

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleOpenModal() {
    setIsOpen(!isOpen)
  }

  function onClose() {
    setIsOpen(false)
  }

  async function handleSaveAddresses() {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('profileId', profileId)
      formData.append('adminUID', adminUID)

      await createBusinessAddress(formData)
      toast.success('Administrador removido com sucesso!')
    } catch (error) {
      toast.error('Erro ao remover administrador.')
      return false
    } finally {
      startTransition(() => {
        setIsSubmitting(false)
        onClose()

        router.refresh()
      })
    }
  }

  return (
    <>
      <ButtonForOwnerOnly handleExecute={handleOpenModal}>
        <Trash className="size-4 text-zinc-400 transition-all duration-300 ease-in-out hover:animate-bounce hover:cursor-pointer hover:text-red-500" />
      </ButtonForOwnerOnly>

      <Modal
        isOpen={isOpen}
        setIsOpen={onClose}
        title="Remover administrador"
        description="Esta ação removerá o administrador do perfil."
        classname="w-full max-w-lg justify-center rounded-2xl border-[0.5px] border-blue-300 text-zinc-700 bg-white p-6"
      >
        <div className="items-end-safe lg:fex-row flex max-h-[90vh] w-full flex-col gap-4 overflow-y-auto py-6">
          <div className="flex w-full gap-1 ">
            Remover <strong>{adminUID}</strong> do perfil?
          </div>

          <footer className="flex justify-end gap-4">
            <button
              type="button"
              className="font-bold hover:cursor-pointer"
              onClick={onClose}
            >
              Voltar
            </button>
            <Button
              variant={'destructive'}
              onClick={handleSaveAddresses}
              disabled={isSubmitting}
              className="w-32"
            >
              Remover
            </Button>
          </footer>
        </div>
      </Modal>
      {isSubmitting && <Loading />}
    </>
  )
}
