'use client'

import { Trash } from 'iconoir-react'
import { useParams, useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

import { removeAdminFromProfile } from '@/actions/remove-admin from-profile'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { toast } from 'sonner'

interface AdminProps {
  email: string
  name: string
  userId: string
}

interface Props {
  admin: AdminProps
}

export function RemoveAdmin({ admin }: Props) {
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

  async function handleRemoveAdminFromProfile() {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('profileId', profileId)
      // ALTERADO: Enviamos apenas o ID do admin a ser removido.
      formData.append('adminUID', admin.userId)

      // Removido: Não precisamos mais enviar o array inteiro
      // formData.append('admins', admins)

      await removeAdminFromProfile(formData)
      toast.success('Administrador removido com sucesso!')
    } catch (error) {
      toast.error('Erro ao remover administrador.')
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
      <Button
        variant="outline"
        onClick={handleOpenModal}
        className="size-8 hover:bg-rose-400"
      >
        <Trash className="size-4 " />
      </Button>

      <Modal
        isOpen={isOpen}
        setIsOpen={onClose}
        title="Remover administrador"
        description="Esta ação removerá o administrador do perfil."
        classname="w-full max-w-lg justify-center rounded-2xl border-[0.5px] border-blue-300 text-zinc-700 bg-white p-6"
      >
        <div className="items-end-safe lg:fex-row flex max-h-[90vh] w-full flex-col gap-4 overflow-y-auto py-6">
          <div className="flex w-full gap-1 ">
            Remover <strong>{admin.email}</strong> do perfil?
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
              onClick={handleRemoveAdminFromProfile}
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
