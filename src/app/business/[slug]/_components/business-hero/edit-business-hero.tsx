'use client'

import 'react-image-crop/dist/ReactCrop.css'

import { Building2, Image as ImageIcon, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { startTransition, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import type { ProfileDataProps } from '@/_types/profile-data'

import { saveProfile } from '@/actions/business/save-profile'
import { categories } from '@/assets/data/categories'
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button/index'
import { Modal } from '@/components/ui/custom-modal'
import { Input } from '@/components/ui/input'

import { normalizeText } from '@/utils/sanitize-text'
import { ImageUploader } from './image-uploader'

interface Props {
  data: {
    businessHeroInfo: ProfileDataProps
    profileId: string
  }
}

export function EditBusinessHero({ data }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const profileId = data.profileId

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const editParam = searchParams.get('edit')
    if (
      editParam === 'logo' ||
      editParam === 'cover' ||
      editParam === 'category'
    ) {
      setIsOpen(true)
    }
  }, [searchParams])

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
    router.replace(window.location.pathname)

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
    } catch (_error) {
      toast.error('Erro ao salvar perfil.')
    } finally {
      startTransition(() => {
        setIsSubmitting(false)
        onClose()
        router.refresh()
      })
    }
  }

  const MultiCategorySelect = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    const normalizedSearchTerm = normalizeText(searchTerm)

    const availableCategories = categories.filter(
      c =>
        !selectedCategories.includes(c) &&
        normalizeText(c).includes(normalizedSearchTerm)
    )

    const addCategory = (category: string) => {
      setSelectedCategories([...selectedCategories, category])
      setSearchTerm('')
    }

    const removeCategory = (category: string) => {
      setSelectedCategories(selectedCategories.filter(c => c !== category))
    }

    // biome-ignore lint/correctness/useExhaustiveDependencies: ingore this lint
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
          className='font-semibold text-slate-700 text-sm dark:text-slate-300'
        >
          Categorias
        </label>
        <div
          ref={wrapperRef}
          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50/50 dark:border-slate-800 dark:bg-slate-950 dark:focus-within:border-blue-500 dark:focus-within:ring-blue-900/30"
        >
          <div className="flex w-full flex-wrap gap-2">
            {selectedCategories?.map(cat => (
              <div
                key={cat}
                className='flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 font-medium text-slate-700 text-sm dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300'
              >
                <span>{cat}</span>
                <button
                  onClick={() => removeCategory(cat)}
                  type="button"
                  className="text-slate-400 transition-colors hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400"
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
              onFocus={() => {
                setDropdownOpen(true)
                setTimeout(() => {
                  const scrollContainer = document.getElementById(
                    'modal-scrollable-body'
                  )
                  if (scrollContainer) {
                    scrollContainer.scrollTo({
                      top: scrollContainer.scrollHeight,
                      behavior: 'smooth',
                    })
                  }
                }, 150)
              }}
              autoComplete="off"
              placeholder="Buscar ou adicionar categoria..."
              className='min-w-[200px] flex-1 bg-transparent p-1.5 text-slate-900 text-sm outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500'
            />
          </div>
          {dropdownOpen && availableCategories.length > 0 && (
            <>
              {/* Tooltip Arrow */}
              <div className='absolute top-[calc(100%+6px)] left-8 z-30 h-3 w-3 -translate-x-1/2 rotate-45 border-slate-200 border-t border-l bg-white dark:border-slate-800 dark:bg-slate-900' />

              <div className='scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 absolute top-full left-0 z-20 mt-4 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-2 shadow-xl dark:border-slate-800 dark:bg-slate-900'>
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
                    role="option"
                    aria-selected={false}
                    tabIndex={0}
                    className='flex cursor-pointer items-center justify-between px-5 py-2.5 font-medium text-slate-600 text-sm transition-colors hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-blue-500/10 dark:hover:text-blue-400'
                  >
                    {cat}
                  </div>
                ))}
              </div>
            </>
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
        classname="relative flex w-full max-h-[90vh] max-w-4xl flex-col overflow-hidden border border-slate-200 bg-slate-50/50 p-0 shadow-2xl md:rounded-3xl dark:border-slate-800 dark:bg-slate-950/50"
      >
        {/* Sticky Header */}
        <div className='z-20 flex-none border-slate-100 border-b bg-white px-8 py-6 dark:border-slate-800 dark:bg-slate-900'>
          <div className="flex items-center justify-between">
            <div>
              <h2 className='font-bold text-2xl text-slate-900 tracking-tight dark:text-slate-100'>
                Informações do Perfil
              </h2>
              <p className='mt-1 font-medium text-slate-500 text-sm dark:text-slate-400'>
                Como sua empresa aparece para os clientes e parceiros.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div
          id="modal-scrollable-body"
          className="flex-1 overflow-y-auto p-6 md:p-8"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-8">
            {/* Visuals Section */}
            <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm md:p-8 dark:border-slate-800/60 dark:bg-slate-900">
              <div className='mb-8 flex items-center gap-3 border-slate-100 border-b pb-4 dark:border-slate-800'>
                <div className="rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <ImageIcon className="size-5" />
                </div>
                <div>
                  <h3 className='font-bold text-lg text-slate-800 dark:text-slate-200'>
                    Imagens do Perfil
                  </h3>
                  <p className='font-medium text-slate-500 text-sm dark:text-slate-400'>
                    A primeira impressão é a que fica.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <ImageUploader
                  label="Logomarca"
                  aspectRatio={1 / 1}
                  initialImageUrl={data.businessHeroInfo.logoImageUrl}
                  onCropComplete={setCroppedLogoFile}
                  recommendation="Recomendado: 400x400px"
                  className="h-[240px] rounded-4xl border-slate-200 dark:border-slate-800"
                />

                <ImageUploader
                  label="Imagem de Capa"
                  aspectRatio={16 / 6}
                  initialImageUrl={data.businessHeroInfo.coverImageUrl}
                  onCropComplete={setCroppedCoverFile}
                  recommendation="Recomendado: 1200x450px"
                  className="h-[240px] rounded-4xl border-slate-200 dark:border-slate-800"
                />
              </div>
            </section>

            {/* Basic Info Section */}
            <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm md:p-8 dark:border-slate-800/60 dark:bg-slate-900">
              <div className='mb-8 flex items-center gap-3 border-slate-100 border-b pb-4 dark:border-slate-800'>
                <div className="rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <h3 className='font-bold text-lg text-slate-800 dark:text-slate-200'>
                    Dados Básicos
                  </h3>
                  <p className='font-medium text-slate-500 text-sm dark:text-slate-400'>
                    Informações principais do seu negócio.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <Input
                  title="Nome do Negócio"
                  name="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className='h-12 rounded-xl border-slate-200 font-medium text-lg text-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-900'
                />
                <MultiCategorySelect />
              </div>
            </section>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className='z-20 flex flex-none items-center justify-end gap-3 border-slate-100 border-t bg-white px-6 py-5 dark:border-slate-800 dark:bg-slate-900'>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border-slate-200 px-6 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveProfile}
            disabled={isSubmitting}
            className='rounded-xl bg-blue-600 px-8 font-semibold text-white shadow-blue-500/20 shadow-md hover:bg-blue-700 dark:hover:bg-blue-500'
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </Modal>
      {isSubmitting && <Loading />}
    </>
  )
}
