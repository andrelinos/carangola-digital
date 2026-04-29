'use client'

import 'react-image-crop/dist/ReactCrop.css'

import { X } from 'lucide-react'
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
    if (editParam === 'logo' || editParam === 'cover' || editParam === 'category') {
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
    } finally {
      setIsSubmitting(false)
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
          className="font-semibold text-slate-700 text-sm"
        >
          Categorias
        </label>
        <div
          ref={wrapperRef}
          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50/50"
        >
          <div className="flex w-full flex-wrap gap-2">
            {selectedCategories?.map(cat => (
              <div
                key={cat}
                className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 font-medium text-slate-700 text-sm border border-slate-200"
              >
                <span>{cat}</span>
                <button
                  onClick={() => removeCategory(cat)}
                  type="button"
                  className="text-slate-400 hover:text-red-500 transition-colors"
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
                  const scrollContainer = document.getElementById('modal-scrollable-body')
                  if (scrollContainer) {
                    scrollContainer.scrollTo({
                      top: scrollContainer.scrollHeight,
                      behavior: 'smooth'
                    })
                  }
                }, 150)
              }}
              autoComplete='off'
              placeholder="Buscar ou adicionar categoria..."
              className="flex-1 bg-transparent p-1.5 text-sm outline-none text-slate-900 placeholder:text-slate-400 min-w-[200px]"
            />
          </div>
          {dropdownOpen && availableCategories.length > 0 && (
            <>
              {/* Tooltip Arrow */}
              <div className="absolute top-[calc(100%+6px)] left-8 z-30 h-3 w-3 -translate-x-1/2 rotate-45 border-t border-l border-slate-200 bg-white" />

              <div className="absolute top-full left-0 z-20 mt-4 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl py-2 scrollbar-thin scrollbar-thumb-slate-200">
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
                    className="cursor-pointer px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-between"
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
        classname="w-full relative max-w-4xl max-h-[90vh] md:rounded-3xl overflow-hidden bg-slate-50/50 p-0 border border-slate-200 shadow-2xl flex flex-col"
      >
        {/* Sticky Header */}
        <div className="flex-none px-8 py-6 border-b border-slate-100 bg-white z-20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Informações do Perfil</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">Como sua empresa aparece para os clientes e parceiros.</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div id="modal-scrollable-body" className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="flex flex-col gap-8 max-w-3xl mx-auto">

            {/* Visuals Section */}
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-sm">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  {/* Using generic SVG since I haven't added imports yet, wait, I will import them above */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image w-5 h-5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Imagens do Perfil</h3>
                  <p className="text-sm font-medium text-slate-500">A primeira impressão é a que fica.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ImageUploader
                  label="Logomarca"
                  aspectRatio={1 / 1}
                  initialImageUrl={data.businessHeroInfo.logoImageUrl}
                  onCropComplete={setCroppedLogoFile}
                  recommendation="Recomendado: 400x400px"
                  className="rounded-[2rem] border-slate-200 h-[240px]"
                />

                <ImageUploader
                  label="Imagem de Capa"
                  aspectRatio={16 / 6}
                  initialImageUrl={data.businessHeroInfo.coverImageUrl}
                  onCropComplete={setCroppedCoverFile}
                  recommendation="Recomendado: 1200x450px"
                  className="rounded-[2rem] border-slate-200 h-[240px]"
                />
              </div>
            </section>

            {/* Basic Info Section */}
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-sm">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-building-2 w-5 h-5"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" /><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" /><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" /><path d="M10 6h4" /><path d="M10 10h4" /><path d="M10 14h4" /><path d="M10 18h4" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Dados Básicos</h3>
                  <p className="text-sm font-medium text-slate-500">Informações principais do seu negócio.</p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <Input
                  title="Nome do Negócio"
                  name="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="h-12 border-slate-200 text-slate-900 font-medium text-lg focus:border-blue-500 focus:ring-blue-100 shadow-sm rounded-xl"
                />
                <MultiCategorySelect />
              </div>
            </section>

          </div>
        </div>

        {/* Sticky Footer */}
        <div className="flex-none px-6 py-5 bg-white border-t border-slate-100 flex items-center justify-end gap-3 z-20">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold px-6"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveProfile}
            disabled={isSubmitting}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 shadow-md shadow-blue-500/20"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </Modal>
      {isSubmitting && <Loading />}
    </>
  )
}
