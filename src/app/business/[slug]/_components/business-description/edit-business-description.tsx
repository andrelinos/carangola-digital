'use client'

import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

import { updateBusinessDescription } from '@/actions/business/create-business-description'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/custom-modal'
import { TextArea } from '@/components/ui/text-area'
import { toast } from 'sonner'

interface Props {
  data: {
    businessDescription: string
    profileId: string
  }
}

export function EditBusinessDescription({ data }: Props) {
  const router = useRouter()
  const profileId = data.profileId

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [businessDescription, setBusinessDescription] = useState(
    data.businessDescription || ''
  )

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

      await updateBusinessDescription(formData)
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
        Editar
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
                maxLength={600}
                minLength={10}
                rows={4}
              />
            </div>
            <p
              className={`text-xs opacity-75 ${businessDescription.length >= 600 && 'text-rose-400'}`}
            >
              {businessDescription.length}/600
            </p>
          </div>

          <footer className="flex w-full justify-end gap-4 pt-6">
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
              className="min-w-[120px] font-bold "
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
