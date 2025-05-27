'use client'

import { EditPencil } from 'iconoir-react'
import { useParams, useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

import { createBusinessPhones } from '@/actions/create-business-phones'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'

interface FormValuesProps {
  title: string
  phone: string
  isWhatsapp: boolean
}

interface Props {
  profileData: any
}

const initialFormValues: FormValuesProps[] = [
  { title: 'Telefone 1', phone: '', isWhatsapp: false },
  { title: 'Telefone 2', phone: '', isWhatsapp: false },
]

export function EditContactPhones({ profileData }: Props) {
  const router = useRouter()
  const profileId = useParams().profileId as string

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formValues, setFormValues] = useState<FormValuesProps[] | null>(
    profileData?.businessPhones || initialFormValues
  )

  function handleOpenModal() {
    setIsOpen(!isOpen)
  }

  function onClose() {
    setIsOpen(false)
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value, type, checked } = event.target

    const match = name.match(/^phone(\d+)\.(phone|isWhatsapp)$/)
    if (!match) return

    const index = Number.parseInt(match[1], 10)
    const field = match[2] as keyof FormValuesProps

    setFormValues(prev =>
      prev
        ? prev.map((item, i) =>
            i === index
              ? {
                  ...item,
                  [field]: field === 'isWhatsapp' ? checked : value,
                }
              : item
          )
        : prev
    )
  }

  async function handleSaveContactPhones() {
    setIsSubmitting(true)

    if (!formValues?.length) {
      setIsSubmitting(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('profileId', profileId)
      formData.append('phones', JSON.stringify(formValues))

      await createBusinessPhones(formData)
    } catch (error) {
      // return false
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
        title="Telefones de contato"
        description="Defina seus telefones de contato"
        classname="w-full max-w-md justify-center rounded-2xl border-[0.5px] border-blue-300 text-zinc-700 bg-white p-6"
      >
        <div className="items-end-safe lg:fex-row flex max-h-[90vh] w-full flex-col gap-4 overflow-y-auto py-6">
          <div className="flex w-full flex-col items-center justify-between gap-4 lg:flex-row lg:items-center ">
            <div className="flex w-full flex-1 flex-col items-end gap-4 text-zinc-700 lg:max-w-96">
              {formValues?.map((phone, index) => {
                return (
                  <div key={String(index)} className="flex w-full gap-2">
                    <Input
                      variant="ghost"
                      name={`phone${index}.phone`}
                      title={`Telefone ${index + 1}`}
                      placeholder="(00) 0 0000-0000"
                      maxLength={15}
                      value={phone.phone}
                      onChange={handleChange}
                    />
                    <span className="flex flex-col items-center justify-end gap-2 text-xs">
                      <input
                        type="checkbox"
                        name={`phone${index}.isWhatsapp`}
                        checked={phone?.isWhatsapp}
                        onChange={handleChange}
                      />
                      Também WhatsApp
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <footer className="flex justify-end gap-4">
            <button type="button" className="font-bold" onClick={onClose}>
              Voltar
            </button>
            <Button onClick={handleSaveContactPhones} disabled={isSubmitting}>
              Salvar
            </Button>
          </footer>
        </div>
      </Modal>
    </>
  )
}
