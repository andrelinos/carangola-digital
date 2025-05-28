'use client'

import { EditPencil, Trash } from 'iconoir-react'
import { useParams, useRouter } from 'next/navigation'
import { startTransition, useEffect, useState } from 'react'

import { createBusinessPhones } from '@/actions/create-business-phones'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { sanitizePhoneNumber } from '@/lib/utils'
import { toast } from 'sonner'

interface FormValuesProps {
  title: string
  phone: string
  nameContact: string
  isWhatsapp: boolean
  isOnlyWhatsapp: boolean
}

interface Props {
  profileData: any
}

const initialFormValues: FormValuesProps[] = [
  {
    title: 'Telefone 1',
    phone: '',
    nameContact: '',
    isWhatsapp: false,
    isOnlyWhatsapp: false,
  },
  {
    title: 'Telefone 2',
    phone: '',
    nameContact: '',
    isWhatsapp: false,
    isOnlyWhatsapp: false,
  },
  {
    title: 'Telefone 3',
    phone: '',
    nameContact: '',
    isWhatsapp: false,
    isOnlyWhatsapp: false,
  },
  {
    title: 'Telefone 4',
    phone: '',
    nameContact: '',
    isWhatsapp: false,
    isOnlyWhatsapp: false,
  },
  {
    title: 'Telefone 5',
    phone: '',
    nameContact: '',
    isWhatsapp: false,
    isOnlyWhatsapp: false,
  },
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

  function handleNewPhone() {
    setFormValues(prev => [
      ...(prev ?? []),
      {
        title: `Telefone ${(prev?.length ?? 0) + 1}`,
        phone: '',
        nameContact: '',
        isWhatsapp: false,
        isOnlyWhatsapp: false,
      },
    ])
  }

  function handleDeletePhone(event: React.MouseEvent<HTMLButtonElement>) {
    if (!event || !event.currentTarget || !event.currentTarget.dataset.index)
      return
    const index = Number.parseInt(event.currentTarget.dataset.index ?? '0', 10)
    setFormValues(prev => (prev ? prev.filter((_, i) => i !== index) : null))
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value, type, checked } = event.target

    const match = name.match(
      /^phone(\d+)\.(phone|nameContact|isWhatsapp|isOnlyWhatsapp)$/
    )
    if (!match) return

    const index = Number.parseInt(match[1], 10)
    const field = match[2] as keyof FormValuesProps

    if (field === 'phone') {
      const sanitizedValue = sanitizePhoneNumber(value)
      setFormValues(prev =>
        prev
          ? prev.map((item, i) =>
              i === index
                ? {
                    ...item,
                    [field]: sanitizedValue,
                  }
                : item
            )
          : prev
      )
      return
    }

    setFormValues(prev =>
      prev
        ? prev.map((item, i) =>
            i === index
              ? {
                  ...item,
                  [field]: type === 'checkbox' ? checked : value,
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
      toast.success('Telefones de contato salvos com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar os telefones de contato.')
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

  useEffect(() => {
    console.log(formValues)
  }, [formValues])

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
          <div className="flex w-full flex-col items-end gap-4 ">
            <div className="flex w-full flex-1 flex-col items-end gap-4 text-zinc-700 lg:max-w-96">
              {formValues?.map((phone, index) => {
                return (
                  <div
                    key={String(index)}
                    className="flex w-full gap-2 border-zinc-200 border-b pb-4"
                  >
                    <div className="flex w-full flex-col gap-2">
                      <div className="flex gap-4">
                        <Input
                          variant="ghost"
                          name={`phone${index}.phone`}
                          title={`Telefone ${index + 1}`}
                          placeholder="32999998888 ou 3233334444"
                          maxLength={15}
                          value={phone.phone}
                          onChange={handleChange}
                        />
                        <Input
                          variant="ghost"
                          name={`phone${index}.nameContact`}
                          title="Nome do contato"
                          placeholder="32999998888 ou 3233334444"
                          maxLength={15}
                          value={phone.nameContact ?? ''}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="flex gap-2">
                        <span className="flex flex-col items-center justify-end gap-2 text-xs">
                          <input
                            type="checkbox"
                            name={`phone${index}.isWhatsapp`}
                            checked={phone?.isWhatsapp ?? false}
                            onChange={handleChange}
                          />
                          Também WhatsApp
                        </span>
                        <span className="flex flex-col items-center justify-end gap-2 text-xs">
                          <input
                            type="checkbox"
                            name={`phone${index}.isOnlyWhatsapp`}
                            checked={phone?.isOnlyWhatsapp ?? false}
                            onChange={handleChange}
                          />
                          Apenas WhatsApp
                        </span>
                      </div>
                    </div>
                    <div className="">
                      <Button
                        data-index={index}
                        variant="link"
                        className="size-4 p-0 text-rose-400 transition-all duration-300 hover:scale-125 hover:cursor-pointer"
                        onClick={handleDeletePhone}
                      >
                        <Trash className="size-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
            <Button variant="link" onClick={handleNewPhone}>
              Adicionar +
            </Button>
          </div>

          <footer className="flex justify-end gap-4">
            <button type="button" className="font-bold" onClick={onClose}>
              Voltar
            </button>
            <Button
              onClick={handleSaveContactPhones}
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
