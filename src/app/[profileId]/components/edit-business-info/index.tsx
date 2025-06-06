'use client'

import { EditPencil } from 'iconoir-react'
import { ArrowUpFromLine } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { type ChangeEvent, startTransition, useState } from 'react'

import type { ProfileDataProps } from '@/_types/profile-data'

import { saveProfile } from '@/actions/save-profile'
import { categories } from '@/assets/data/categories'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button/index'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Select } from '@/components/ui/select'
import { compressFiles, handleImageInput, triggerImageInput } from '@/lib/utils'
import { toast } from 'sonner'

interface Props {
  profileData: ProfileDataProps
  imagePath?: string
}

export function EditBusinessInfo({ profileData, imagePath }: Props) {
  const router = useRouter()
  const { profileId } = useParams() as { profileId: string }

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [name, setName] = useState(profileData?.name || '')
  const [profilePic, setProfilePic] = useState<string | null>(imagePath || null)
  const [category, setCategory] = useState(profileData?.category || '')

  function handleOpenModal() {
    setIsOpen(!isOpen)
  }

  function onClose() {
    setIsOpen(!isOpen)
  }

  function handleSelectChange(e: ChangeEvent<HTMLSelectElement>): void {
    const value = (e.target as HTMLSelectElement).value
    setCategory(value)
  }

  async function handleSaveProfile() {
    setIsSubmitting(true)
    const imagesInput = document.getElementById(
      'profile-image-pic'
    ) as HTMLInputElement

    if (!imagesInput?.files) return

    try {
      const compressedFile = await compressFiles(Array.from(imagesInput.files))

      const formData = new FormData()

      formData.append('profileId', profileId)
      formData.append('businessPic', compressedFile[0])
      formData.append('yourName', name)
      formData.append('category', category)

      await saveProfile(formData)
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar perfil')
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
        <EditPencil className="size-4 transition-all duration-300 hover:scale-150 hover:cursor-pointer" />
      </ButtonForOwnerOnly>
      <Modal
        isOpen={isOpen}
        setIsOpen={onClose}
        title="Novo projeto"
        description="Crie um novo projeto"
        classname="w-full max-w-[638px] justify-center rounded-2xl border-[0.5px] border-blue-300 bg-white p-6"
      >
        <div className="flex w-full flex-col gap-4 ">
          <div className="flex flex-col items-center gap-3 text-xs">
            <div className="h-[209px] w-full overflow-hidden rounded-xl bg-background-tertiary">
              {profilePic ? (
                <Image
                  width={1080}
                  height={209}
                  src={profilePic}
                  alt="Project preview"
                  className="size-full overflow-hidden object-cover object-left-top"
                  onError={e => {
                    e.currentTarget.src = '/default-image.png'
                    setProfilePic('/default-image.png')
                    e.currentTarget.onerror = null // prevents looping
                  }}
                />
              ) : (
                <button
                  type="button"
                  className="size-full text-white"
                  onClick={() => triggerImageInput('profile-image-pic')}
                >
                  1080x324
                </button>
              )}
            </div>
            <button
              type="button"
              className="flex items-center gap-2"
              onClick={() => triggerImageInput('profile-image-pic')}
            >
              <ArrowUpFromLine className="size-4" />
              <span>Adicionar imagem</span>
            </button>
            <input
              type="file"
              id="profile-image-pic"
              accept="image/*"
              className="hidden"
              onChange={e => setProfilePic(handleImageInput(e))}
            />
          </div>
          <div className="flex w-full flex-col gap-4">
            <Input
              variant="ghost"
              title="Nome do seu negócio"
              placeholder="Informe o nome do seu negócio"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <Select
              options={categories}
              placeholder="Selecione uma opção"
              title="Categoria"
              selected={category}
              handleSelectChange={handleSelectChange}
            />
          </div>

          <footer className="flex justify-end gap-4">
            <button
              type="button"
              className="font-bold hover:cursor-pointer"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Voltar
            </button>
            <Button
              onClick={handleSaveProfile}
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
