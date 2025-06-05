'use client'

import { EditPencil } from 'iconoir-react'
import { useParams, useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

import type { ProfileDataProps } from '@/_types/profile-data'

import { createBusinessSocialMedia } from '@/actions/create-business-social-media'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { toast } from 'sonner'

interface FormValuesProps {
  instagram?: string
  threads?: string
  facebook?: string
  linkedin?: string
  tiktok?: string
  kwai?: string
  site?: string
}

interface Props {
  profileData: ProfileDataProps
}

export function EditBusinessSocialMedias({ profileData }: Props) {
  const router = useRouter()
  const { profileId } = useParams() as { profileId: string }

  const socialMedias = profileData?.socialMedias
  const initialFormValues: FormValuesProps =
    socialMedias || ({} as FormValuesProps)

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formValues, setFormValues] =
    useState<FormValuesProps>(initialFormValues)

  function handleOpenModal() {
    setIsOpen(!isOpen)
  }

  function onClose() {
    setIsOpen(false)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }))
  }

  async function handleSaveSocialMedia() {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('profileId', profileId)
      formData.append('socialMedias', JSON.stringify(formValues))

      await createBusinessSocialMedia(formData)
      toast.success('Redes sociais salvas com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar as redes sociais.')
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
        <div className="items-end-safe lg:fex-row flex max-h-[90vh] w-full flex-col gap-4 overflow-y-auto py-6">
          <div className="flex w-full flex-col items-center justify-between gap-4 lg:flex-row lg:items-center ">
            <div className="flex w-full flex-1 flex-col items-end gap-4 text-zinc-700">
              <Input
                variant="ghost"
                name="instagram"
                title="Link Instagram"
                placeholder="https://www.instagram.com/andrelinossilva"
                defaultValue={socialMedias?.instagram || ''}
                onChange={handleChange}
              />
              <Input
                variant="ghost"
                name="threads"
                title="Link Threads"
                placeholder="https://www.threads.com/@andrelinossilva"
                defaultValue={socialMedias?.threads || ''}
                onChange={handleChange}
              />
              <Input
                variant="ghost"
                name="facebook"
                title="Link Facebook"
                placeholder="https://www.facebook.com/andrelinossilva"
                defaultValue={socialMedias?.facebook || ''}
                onChange={handleChange}
              />
              <Input
                variant="ghost"
                name="linkedin"
                title="Link Linkedin"
                placeholder="https://www.linkedin.com/in/andrelinosilva"
                defaultValue={socialMedias?.linkedin || ''}
                onChange={handleChange}
              />
              <Input
                variant="ghost"
                name="tiktok"
                title="Link TikTok"
                placeholder="https://www.tiktok.com/@rocketseat"
                defaultValue={socialMedias?.tiktok || ''}
                onChange={handleChange}
              />
              <Input
                variant="ghost"
                name="kwai"
                title="Link Kwai"
                placeholder="https://www.kwai.com/@KwaiBrasilOficial"
                defaultValue={socialMedias?.kwai || ''}
                onChange={handleChange}
              />
              <Input
                variant="ghost"
                name="site"
                title="Link Site"
                placeholder="https://andrelinosilva.com.br"
                defaultValue={socialMedias?.site || ''}
                onChange={handleChange}
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
            <Button onClick={handleSaveSocialMedia} disabled={isSubmitting}>
              Salvar
            </Button>
          </footer>
        </div>
      </Modal>
      {isSubmitting && <Loading />}
    </>
  )
}
