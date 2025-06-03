'use client'

import { EditPencil, Plus, Trash } from 'iconoir-react'
import { useParams, useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

import { createBusinessPhones } from '@/actions/create-business-phones'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Modal } from '@/components/ui/modal'
import { handleImageInput, sanitizePhoneNumber } from '@/lib/utils'
import { ArrowUpFromLine } from 'lucide-react'
import Image from 'next/image'
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

export function EditContactPhones({ profileData }: Props) {
  const router = useRouter()
  const profileId = useParams().profileId as string

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profileWhatsAppPic, setProfileWhatsAppPic] = useState<string | null>(
    null
  )

  const [formValues, setFormValues] = useState<FormValuesProps[] | null>(
    profileData?.businessPhones || [
      {
        title: 'Telefone 1',
        phone: '',
        nameContact: '',
        isWhatsapp: false,
        isOnlyWhatsapp: false,
      },
    ]
  )

  function handleOpenModal() {
    setIsOpen(!isOpen)
  }

  function onClose() {
    setIsOpen(false)
  }

  function handleNewPhone() {
    if (formValues?.length && formValues?.length >= 3) {
      toast.info('Em breve você poderá adicionar mais telefones.', {
        description: 'Ainda estamos trabalhando nisso.',
        position: 'top-center',
      })

      return
    }

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

  function handleShowMessage() {
    toast.info('Em breve você poderá carregar uma foto para este contato!', {
      description: 'Ainda estamos trabalhando nisso.',
      position: 'top-center',
    })
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
        classname="w-full max-w-lg justify-center rounded-2xl border-[0.5px] border-blue-300 text-zinc-700 bg-white p-6"
      >
        <div className=" lg:fex-row flex max-h-[90vh] w-full flex-col gap-4 overflow-y-auto py-6">
          <div className="flex w-full flex-col items-end gap-4 ">
            <div className="flex w-full flex-1 flex-col items-end gap-4 text-zinc-700">
              {formValues?.map((phone, index) => {
                return (
                  <div
                    key={String(index)}
                    className="flex w-full gap-2 border-zinc-200 border-b pb-4"
                  >
                    <div className="flex w-full flex-col gap-2">
                      <div className="flex w-full justify-center gap-4">
                        <div className="flex flex-col gap-2">
                          <Label className="text-start font-bold">Foto</Label>

                          <div className="">
                            <div className="flex size-32 flex-col items-center justify-center overflow-hidden rounded-lg border border-zinc-200">
                              {profileWhatsAppPic ? (
                                <Image
                                  width={126}
                                  height={126}
                                  src={profileWhatsAppPic}
                                  className="size-full overflow-hidden object-cover object-left-top"
                                  alt="Project preview"
                                  onError={e => {
                                    e.currentTarget.src =
                                      '/images/user-no-image.png'
                                    setProfileWhatsAppPic(
                                      '/images/user-no-image.png'
                                    )
                                    e.currentTarget.onerror = null
                                  }}
                                />
                              ) : (
                                <button
                                  type="button"
                                  className="size-full text-zinc-700"
                                  // onClick={() =>
                                  //   triggerImageInput(
                                  //     'profile-whatsapp-image-pic'
                                  //   )
                                  // }
                                  onClick={handleShowMessage}
                                >
                                  <Image
                                    width={126}
                                    height={126}
                                    src="/images/user-no-image.png"
                                    className="size-full object-cover"
                                    alt="Telefone"
                                    title="Clique para adicionar uma foto 200x200"
                                    priority
                                  />
                                </button>
                              )}
                            </div>

                            <div>
                              <button
                                type="button"
                                className="flex h-6 items-center gap-2 transition-all duration-300 hover:cursor-pointer hover:text-blue-500"
                                // onClick={() =>
                                //   triggerImageInput(
                                //     'profile-whatsapp-image-pic'
                                //   )
                                // }
                                onClick={handleShowMessage}
                              >
                                <ArrowUpFromLine className="size-4" />
                                <span className="text-xs">
                                  Adicionar imagem
                                </span>
                              </button>
                              <input
                                type="file"
                                id="profile-whatsapp-image-pic"
                                accept="image/*"
                                className="hidden"
                                onChange={e =>
                                  setProfileWhatsAppPic(handleImageInput(e))
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col gap-4 ">
                          <Input
                            variant="ghost"
                            name={`phone${index}.nameContact`}
                            title="Nome do contato"
                            placeholder="Contato"
                            maxLength={15}
                            value={phone.nameContact ?? ''}
                            onChange={handleChange}
                          />
                          <Input
                            variant="ghost"
                            name={`phone${index}.phone`}
                            title={`Telefone ${index + 1}`}
                            placeholder="32999998888 ou 3233334444"
                            maxLength={15}
                            value={phone.phone}
                            onChange={handleChange}
                          />
                          <div className="flex justify-center gap-2">
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
            <div className="flex w-full justify-end pb-6">
              <Button
                variant="link"
                className="m-0 flex items-center py-0 text-xs hover:cursor-pointer hover:text-blue-500"
                onClick={handleNewPhone}
              >
                <Plus />
                Adicionar novo telefone
              </Button>
            </div>
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
