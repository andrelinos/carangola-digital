'use client'

import { EditPencil } from 'iconoir-react'
import { useParams, useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

import { createBusinessDescription } from '@/actions/create-business-description'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { TextArea } from '@/components/ui/text-area'
import { toast } from 'sonner'

interface Props {
  data: string
}

export function EditBusinessDescription({ data }: Props) {
  const router = useRouter()
  const profileId = useParams().profileId as string

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [businessDescription, setBusinessDescription] = useState(data || '')

  function handleOpenModal() {
    setIsOpen(!isOpen)
  }

  function onClose() {
    setIsOpen(false)
  }

  async function handleSaveOpeningHours() {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('profileId', profileId)
      formData.append('businessDescription', businessDescription)

      await createBusinessDescription(formData)
      toast.success('Descrição salva com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar descrição')
      return false
    } finally {
      startTransition(() => {
        setIsSubmitting(false)
        onClose()

        router.refresh()
      })
    }

    setIsSubmitting(false)
    onClose()
  }

  return (
    <>
      <ButtonForOwnerOnly handleExecute={handleOpenModal}>
        <EditPencil className="size-4 transition-all duration-300 hover:scale-150 hover:cursor-pointer" />
      </ButtonForOwnerOnly>

      <Modal
        isOpen={isOpen}
        setIsOpen={onClose}
        title="Descrição"
        description="Dê uma breve descrição sobre você"
        classname="w-full max-w-lg justify-center rounded-2xl border-[0.5px] border-blue-300 text-zinc-700 bg-white p-6"
      >
        <div className="items-end-safe lg:fex-row flex max-h-[90vh] w-full flex-col gap-4 overflow-y-auto py-6">
          <div className="flex w-full flex-col gap-4 ">
            <div className="flex w-full flex-1 flex-col gap-4 text-zinc-700">
              <TextArea
                name="businessDescription"
                variant="ghost"
                title="Endereço"
                placeholder="Fale um pouco sobre você"
                className="h-64"
                value={businessDescription}
                onChange={e => setBusinessDescription(e.target.value)}
                autoFocus
                maxLength={500}
                minLength={10}
                rows={4}
              />
            </div>
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
              onClick={handleSaveOpeningHours}
              disabled={isSubmitting}
              className="w-32"
            >
              Salvar
            </Button>
          </footer>
        </div>
      </Modal>
      {isSubmitting && <Loading />}
    </>
  )
}
