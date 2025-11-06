'use client'

import { useRouter } from 'next/navigation'
import { startTransition, useEffect, useRef, useState } from 'react'

import 'react-image-crop/dist/ReactCrop.css'

import type { ProfileDataProps } from '@/_types/profile-data'

import { saveProfile } from '@/actions/business/save-profile'
import { categories } from '@/assets/data/categories'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button/index'
import { Modal } from '@/components/ui/custom-modal'
import { Input } from '@/components/ui/input'

import { X } from 'lucide-react'
import { toast } from 'sonner'
import { ImageUploader } from './image-uploader'

interface Props {
  data: {
    businessHeroInfo: ProfileDataProps
    profileId: string
  }
}

export function EditBusinessHero({ data }: Props) {
  const router = useRouter()
  const profileId = data.profileId

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState(data.businessHeroInfo?.name || '')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    data.businessHeroInfo?.categories || []
  )

  const [croppedLogoFile, setCroppedLogoFile] = useState<File | null>(null)
  const [croppedCoverFile, setCroppedCoverFile] = useState<File | null>(null)

  const onClose = () => {
    setIsOpen(false)
    setCroppedLogoFile(null)
    setCroppedCoverFile(null)
  }

  async function handleSaveProfile() {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('profileId', profileId)
      formData.append('name', name)
      formData.append('categories', JSON.stringify(selectedCategories))

      if (croppedCoverFile) formData.append('coverPic', croppedCoverFile)
      if (croppedLogoFile) formData.append('logoPic', croppedLogoFile)

      await saveProfile(formData)
      toast.success('Perfil atualizado com sucesso!')

      startTransition(() => {
        onClose()
        router.refresh()
      })
    } catch (error) {
      toast.error('Erro ao salvar perfil.')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const MultiCategorySelect = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    const availableCategories = categories.filter(
      c =>
        !selectedCategories.includes(c) &&
        c.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const addCategory = (category: string) => {
      setSelectedCategories([...selectedCategories, category])
      setSearchTerm('')
    }

    const removeCategory = (category: string) => {
      setSelectedCategories(selectedCategories.filter(c => c !== category))
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target as Node)
        ) {
          setDropdownOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [wrapperRef])

    return (
      <div className="relative flex flex-col gap-2">
        <label
          htmlFor="category-search"
          className="font-bold text-foreground/80 text-sm"
        >
          Categorias
        </label>
        <div
          ref={wrapperRef}
          className=" w-full rounded-lg border border-border bg-background p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:border-blue-300"
        >
          <div className="flex w-full flex-wrap gap-2 ">
            {selectedCategories?.map(cat => (
              <div
                key={cat}
                className="flex w-fit items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-800 text-sm dark:bg-blue-900 dark:text-blue-200"
              >
                <span>{cat}</span>
                <button
                  onClick={() => removeCategory(cat)}
                  type="button"
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <input
              id="category-search"
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onFocus={() => setDropdownOpen(true)}
              placeholder="Buscar categoria..."
              className="flex-1 bg-transparent p-1 text-sm outline-none"
            />
          </div>
          {dropdownOpen && availableCategories.length > 0 && (
            <div className="absolute top-full left-0 z-20 mt-2 max-h-36 w-full overflow-y-auto rounded-lg border border-border bg-background shadow-lg">
              {availableCategories.map(cat => (
                <div
                  key={cat}
                  onClick={() => {
                    addCategory(cat)
                    setDropdownOpen(false)
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      addCategory(cat)
                      setDropdownOpen(false)
                    }
                  }}
                  // biome-ignore lint/a11y/useSemanticElements: <explanation>
                  role="option"
                  aria-selected={false}
                  tabIndex={0}
                  className="cursor-pointer px-4 py-2 text-sm hover:bg-muted"
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <ButtonForOwnerOnly handleExecute={() => setIsOpen(true)}>
        Editar
      </ButtonForOwnerOnly>
      <Modal
        isOpen={isOpen}
        setIsOpen={onClose}
        title="Alterar informações"
        description="Atualize os dados e imagens do seu perfil."
        classname="w-full relative  max-w-3xl h-[720px] md:rounded-2xl overflow-y-auto max-h-screen bg-white dark:bg-accent px-6 pt-6 pb-20 md:px-8"
      >
        <div className=" flex h-fit w-full flex-col items-center gap-8">
          <div className="flex w-full flex-col items-center gap-4 md:flex-row md:items-start">
            <div className="h-64 overflow-y-auto ">
              <ImageUploader
                label="Logomarca"
                aspectRatio={1 / 1}
                initialImageUrl={data.businessHeroInfo.logoImageUrl}
                onCropComplete={setCroppedLogoFile}
                recommendation="Recomendado: 400x400px"
                className="max-h-46 w-full min-w-48 md:max-w-48"
                container="max-h-96"
              />
            </div>

            <div className="h-auto flex-1 overflow-y-auto">
              <ImageUploader
                label="Imagem de Capa"
                aspectRatio={16 / 6}
                initialImageUrl={data.businessHeroInfo.coverImageUrl}
                onCropComplete={setCroppedCoverFile}
                recommendation="Recomendado: 1200x450px"
                className="max-h-96"
                container="max-h-96 flex-1"
              />
            </div>
          </div>

          <div className="z-10 flex h-46 w-full flex-col gap-4 bg-white dark:bg-accent">
            <Input
              title="Nome"
              name={name}
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <MultiCategorySelect />
          </div>

          <footer className="absolute right-0 bottom-0 z-10 flex w-fit justify-end gap-4 p-6 pt-8">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              className="font-bold hover:cursor-pointer"
            >
              Voltar
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={isSubmitting}
              className="min-w-[120px] font-bold hover:cursor-pointer"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </footer>
        </div>
      </Modal>
      {isSubmitting && <Loading />}
    </>
  )
}
