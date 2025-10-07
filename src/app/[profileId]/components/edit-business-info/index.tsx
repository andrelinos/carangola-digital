'use client'

import { ArrowUpFromLine, Camera, X } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import type React from 'react'
import {
  type ChangeEvent,
  startTransition,
  useEffect,
  useRef,
  useState,
} from 'react'

// Importações da biblioteca de recorte
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import type { ProfileDataProps } from '@/_types/profile-data'

import { saveProfile } from '@/actions/save-profile'
import { categories } from '@/assets/data/categories' // Supondo que este é seu array de strings de categorias
import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button/index'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'

import { compressImage } from '@/lib/utils'
import { toast } from 'sonner'

interface ImageUploaderProps {
  label: string
  aspectRatio: number
  initialImageUrl?: string
  onCropComplete: (file: File | null) => void

  recommendation?: string
}

interface Props {
  profileData: ProfileDataProps
}

async function getCroppedImg(
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string
): Promise<File | null> {
  const canvas = document.createElement('canvas')
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  canvas.width = Math.floor(crop.width * scaleX)
  canvas.height = Math.floor(crop.height * scaleY)

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    return null
  }

  const cropX = crop.x * scaleX
  const cropY = crop.y * scaleY

  ctx.drawImage(
    image,
    cropX,
    cropY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  )

  const blob = await new Promise<Blob | null>(resolve => {
    canvas.toBlob(resolve, 'image/jpeg', 0.95) // Gera um JPEG de alta qualidade inicial
  })

  if (!blob) {
    console.error('Canvas está vazio após o recorte.')
    return null
  }

  const uncompressedFile = new File([blob], fileName, { type: 'image/jpeg' })

  const compressedFile = await compressImage(uncompressedFile)

  return compressedFile
}

// Função auxiliar para debounce (evitar execuções excessivas ao arrastar o crop)
function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps: React.DependencyList
) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const t = setTimeout(() => {
      fn()
    }, waitTime)

    return () => {
      clearTimeout(t)
    }
  }, deps)
}

// Função para converter o canvas do recorte em um arquivo para upload
async function canvasToFile(
  canvas: HTMLCanvasElement,
  fileName: string
): Promise<File> {
  const blob = await new Promise<Blob | null>(resolve =>
    canvas.toBlob(resolve, 'image/jpeg', 0.9)
  )
  if (!blob) {
    throw new Error('Canvas to Blob conversion failed')
  }
  return new File([blob], fileName, { type: 'image/jpeg' })
}

function ImageUploader({
  label,
  aspectRatio,
  initialImageUrl,
  onCropComplete,
  recommendation,
}: ImageUploaderProps) {
  const [imgSrc, setImgSrc] = useState('')
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()

  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function onSelectFile(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined)
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || '')
      )
      reader.readAsDataURL(e.target.files[0])
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    const newCrop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, aspectRatio, width, height),
      width,
      height
    )
    setCrop(newCrop)
  }

  useDebounceEffect(
    async () => {
      if (completedCrop?.width && completedCrop?.height && imgRef.current) {
        // Usa a nova função utilitária para gerar o arquivo
        const croppedFile = await getCroppedImg(
          imgRef.current,
          completedCrop,
          'cropped-image.jpeg'
        )
        onCropComplete(croppedFile)
      }
    },
    100,
    [completedCrop]
  )

  return (
    <div>
      <label htmlFor="" className="font-medium text-sm text-zinc-700">
        {label}
      </label>
      <div className="mt-2">
        {imgSrc ? (
          <div className="flex flex-col items-center gap-4">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={c => setCompletedCrop(c)}
              aspect={aspectRatio}
              minWidth={150}
            >
              <img
                ref={imgRef}
                alt="Recortar imagem"
                src={imgSrc}
                onLoad={onImageLoad}
                className="max-h-[400px]"
              />
            </ReactCrop>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              Trocar Imagem
            </Button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={() => fileInputRef.current?.click()}
            className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-zinc-300 border-dashed bg-zinc-50 text-zinc-500 transition-colors hover:border-blue-400 hover:bg-blue-50"
            style={{ aspectRatio }}
          >
            {initialImageUrl && (
              <Image
                src={initialImageUrl}
                alt="Imagem atual"
                fill
                className="rounded-lg object-cover opacity-40"
              />
            )}
            <div className="relative z-10 flex flex-col items-center p-4 text-center">
              <Camera size={32} />
              <p className="mt-2 font-semibold">
                Alterar {label.toLowerCase()}
              </p>
              {recommendation && <p className="text-xs">{recommendation}</p>}
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          className="hidden"
        />
        <canvas ref={previewCanvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  )
}

export function EditBusinessInfo({ profileData }: Props) {
  const router = useRouter()
  const { profileId } = useParams() as { profileId: string }

  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- Estados do Formulário ---
  const [name, setName] = useState(profileData?.name || '')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    profileData?.categories || []
  )
  const [imgSrc, setImgSrc] = useState('')
  const [croppedImageFile, setCroppedImageFile] = useState<File | null>(null)
  const [croppedLogoFile, setCroppedLogoFile] = useState<File | null>(null)
  const [croppedCoverFile, setCroppedCoverFile] = useState<File | null>(null)

  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const previewCanvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // const initialImageUrl = profileData?.imagePath || '/default-cover.png'

  const onClose = () => {
    setIsOpen(false)
    setImgSrc('')
    setCroppedLogoFile(null)
    setCroppedCoverFile(null)
  }

  // --- Função de Salvamento ---
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

  // --- Componente de Multi-seleção de Categoria ---
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

    // Fecha o dropdown se clicar fora
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
      <div className="flex flex-col gap-2">
        <label htmlFor="" className="font-medium text-sm text-zinc-700">
          Categorias
        </label>
        <div
          ref={wrapperRef}
          className="relative w-full rounded-lg border border-zinc-300 bg-zinc-50 p-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200"
        >
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(cat => (
              <div
                key={cat}
                className="flex items-center gap-1.5 rounded-md bg-blue-100 px-2 py-1 text-blue-800 text-sm"
              >
                <span>{cat}</span>
                <button
                  onClick={() => removeCategory(cat)}
                  type="button"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onFocus={() => setDropdownOpen(true)}
              placeholder="Adicionar categoria..."
              className="flex-1 bg-transparent p-1 text-sm outline-none"
            />
          </div>
          {dropdownOpen && availableCategories.length > 0 && (
            <div className="absolute top-full left-0 z-10 mt-2 max-h-48 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
              {availableCategories.map(cat => (
                <div
                  key={cat}
                  onClick={() => {
                    addCategory(cat)
                    setDropdownOpen(false)
                  }}
                  onKeyDown={() => {
                    addCategory(cat)
                    setDropdownOpen(false)
                  }}
                  className="cursor-pointer px-4 py-2 text-sm hover:bg-zinc-100"
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
        classname="w-full max-w-2xl rounded-2xl bg-white p-6 md:p-8"
      >
        <div className="flex w-full flex-col gap-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Uploader para a Logomarca */}
            <ImageUploader
              label="Logomarca"
              aspectRatio={1 / 1}
              initialImageUrl={profileData.logoImageUrl}
              onCropComplete={setCroppedLogoFile}
              recommendation="Recomendado: 400x400px"
            />
            {/* Uploader para a Imagem de Capa */}
            <ImageUploader
              label="Imagem de Capa"
              aspectRatio={16 / 6}
              initialImageUrl={profileData.coverImageUrl}
              onCropComplete={setCroppedCoverFile}
              recommendation="Recomendado: 1200x450px"
            />
          </div>

          <div className="flex w-full flex-col gap-4">
            <Input
              // variant="outline"
              // label="Nome do seu negócio"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <MultiCategorySelect />
          </div>

          <footer className="mt-4 flex justify-end gap-4 border-zinc-200 border-t pt-6">
            <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={isSubmitting}
              className="min-w-[120px]"
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
