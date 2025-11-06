'use client'

import { Trash } from 'iconoir-react'
import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

import { removeAdminFromProfile } from '@/actions/business/manage-admin-on-profile'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/custom-modal'
import { toast } from 'sonner'

interface AdminProps {
  email: string
  name: string
  userId: string
}

interface Props {
  admin: AdminProps
  profileId?: string
}

export function RemoveAdmin({ admin, profileId }: Props) {
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleOpenModal() {
    setIsOpen(!isOpen)
  }

  function onClose() {
    setIsOpen(false)
  }

  async function handleRemoveAdminFromProfile() {
    if (!profileId || !admin) {
      return null
    }
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('profileId', profileId)
      formData.append('adminUID', admin.userId)

      await removeAdminFromProfile(formData)
      toast.success('Gerente removido com sucesso!')
    } catch (error) {
      toast.error('Erro ao remover gerente do perfil.')
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
        title="Remover gerente"
        description="Esta ação removerá o gerente do perfil."
        classname="w-full max-w-lg justify-center rounded-2xl border-[0.5px] border-blue-300 text-zinc-700 bg-white p-6"
      >
        <div className="items-end-safe lg:fex-row flex max-h-[90vh] w-full flex-col gap-4 overflow-y-auto py-6">
          <p className="w-full">
            Remover <span className="font-bold">{admin.email}</span> do cargo de
            gerente deste perfil?
          </p>

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
