'use client'

import 'react-image-crop/dist/ReactCrop.css'

import clsx from 'clsx'
import { Camera, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import type React from 'react'
import {
  type ChangeEvent,
  startTransition,
  useEffect,
  useRef,
  useState,
} from 'react'
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop'
import { toast } from 'sonner'

import { ButtonForOwnerOnly } from '@/components/commons/button-for-owner-only'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/custom-modal'

import type { PropertyProps } from '@/_types/property'

import { updatePropertyGallery } from '@/actions/properties/save-image-gallery-property'

import { compressImage } from '@/utils/compress-image'

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
  if (!ctx) return null

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
    canvas.toBlob(resolve, 'image/jpeg', 0.95) // Qualidade alta antes de comprimir
  })

  if (!blob) return null

  // Cria o arquivo
  const uncompressedFile = new File([blob], fileName, { type: 'image/jpeg' })

  // *** ESTA É A SUA LÓGICA CORRETA ***
  // Comprime o arquivo antes de retorná-lo
  return compressImage(uncompressedFile)
}

function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps: React.DependencyList
) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const t = setTimeout(() => fn(), waitTime)
    return () => clearTimeout(t)
  }, deps)
}

interface ImageUploaderProps {
  label: string
  aspectRatio: number
  onFileProcessed: (file: File | null) => void
  className?: string
  container?: string
  recommendation?: string
}

function ImageUploader({
  label,
  aspectRatio,
  onFileProcessed,
  recommendation,
  className,
  container,
}: ImageUploaderProps) {
  const [imgSrc, setImgSrc] = useState('')
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isCompressing, setIsCompressing] = useState(false)

  async function onSelectFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }

    const files = Array.from(e.target.files)
    e.target.value = ''

    if (files.length === 1) {
      setCrop(undefined)
      const reader = new FileReader()
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || '')
      )
      reader.readAsDataURL(files[0])
    } else {
      setIsCompressing(true)
      toast.info(`Comprimindo ${files.length} imagens...`)

      const compressPromises = files.map(file => compressImage(file))
      const compressedFiles = await Promise.all(compressPromises)

      for (const file of compressedFiles) {
        if (file) {
          onFileProcessed(file)
        }
      }

      toast.success(`${files.length} imagens adicionadas!`)
      setIsCompressing(false)
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
        const croppedFile = await getCroppedImg(
          imgRef.current,
          completedCrop,
          'cropped-image.jpeg'
        )
        onFileProcessed(croppedFile)

        setImgSrc('')
        setCrop(undefined)
        setCompletedCrop(undefined)
      }
    },
    100,
    [completedCrop, onFileProcessed]
  )

  return (
    <div className={clsx(container)}>
      <div className="">
        {imgSrc ? (
          <div className={clsx('flex flex-col items-center gap-4', className)}>
            <p className="font-medium text-sm text-zinc-700">
              Recorte a imagem
            </p>
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={c => setCompletedCrop(c)}
              aspect={aspectRatio}
              minWidth={150}
              className="max-h-16 overflow-hidden"
            >
              <img
                ref={imgRef}
                alt="Recortar imagem"
                src={imgSrc}
                onLoad={onImageLoad}
                className="max-h-[400px] object-cover"
              />
            </ReactCrop>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={() => fileInputRef.current?.click()}
            className={clsx(
              'relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-zinc-300 border-dashed bg-zinc-50 text-zinc-500 transition-colors hover:border-blue-400 hover:bg-blue-50',
              className,
              isCompressing && 'cursor-not-allowed opacity-60' // <-- Feedback visual
            )}
            style={{ aspectRatio }}
          >
            <div className="relative z-10 flex flex-col items-center p-4 text-center">
              <Camera size={32} />
              <p className="mt-2 font-semibold">{label}</p>
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
          multiple
          disabled={isCompressing}
        />
      </div>
    </div>
  )
}

interface NewImageFile {
  file: File
  previewUrl: string
}

interface EditPropertyGalleryProps {
  propertyData?: PropertyProps
  isOwner: boolean
  aspectRatio: number
}

export function EditPropertyGallery({
  propertyData,
  isOwner,
  aspectRatio,
}: EditPropertyGalleryProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagesLength, setImagesLength] = useState(0)

  const [currentImages, setCurrentImages] = useState<PropertyProps['images']>(
    propertyData?.images ?? []
  )
  const [newImages, setNewImages] = useState<NewImageFile[]>([])

  const propertyId = propertyData?.id ?? ''
  const initialImages = propertyData?.images ?? []
  const planConfig =
    propertyData?.planConfig ?? ({} as PropertyProps['planConfig'])

  const onClose = () => {
    try {
      for (const img of newImages) {
        URL.revokeObjectURL(img.previewUrl)
      }
    } catch (error) {
      console.log('Erro ao recarregar imagem...')
    }
    setNewImages([])
    setIsOpen(false)
  }

  const handleAddFile = (file: File | null) => {
    if (!file) return

    const previewUrl = URL.createObjectURL(file)
    setNewImages(prev => [...prev, { file, previewUrl }])
  }

  const handleDeleteExisting = (pathToDelete: string) => {
    setCurrentImages(prev => prev.filter(img => img.path !== pathToDelete))
  }

  const handleDeleteNew = (previewUrl: string) => {
    URL.revokeObjectURL(previewUrl)
    setNewImages(prev => prev.filter(img => img.previewUrl !== previewUrl))
  }

  async function handleSaveGallery() {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('propertyId', propertyId)

      const imagesToDelete = initialImages
        .filter(
          initialImg =>
            !currentImages.some(
              currentImg => currentImg.path === initialImg.path
            )
        )

        .map(img => img.path)

      formData.append('imagesToDelete', JSON.stringify(imagesToDelete))

      for (const img of newImages) {
        formData.append('newImages', img.file)
      }

      const success = await updatePropertyGallery(formData)

      if (!success) {
        return toast.error('A ação no servidor falhou ao salvar.')
      }

      toast.success('Galeria atualizada com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar galeria.')
      console.error(error)
    } finally {
      setIsSubmitting(false)
      startTransition(async () => {
        await router.refresh()
        onClose()
      })
    }
  }

  useEffect(() => {
    if (isOpen) {
      setCurrentImages(initialImages)
    }
  }, [initialImages, isOpen])

  useEffect(() => {
    const length = currentImages?.length + newImages?.length

    setImagesLength(length)
  }, [currentImages, newImages])

  return (
    <>
      {isOwner && (
        <ButtonForOwnerOnly
          handleExecute={() => setIsOpen(true)}
          title="galeria de imagens"
        >
          <span className="font-bold">Editar galeria</span>
        </ButtonForOwnerOnly>
      )}

      <Modal
        isOpen={isOpen}
        setIsOpen={onClose}
        title="Editar galeria de imagens"
        description="Adicione, remova ou reordene as imagens do imóvel."
        classname="w-full z-50 max-w-4xl overflow-y-auto max-h-screen bg-white dark:bg-accent px-6 py-16 md:px-8"
      >
        <div className="flex w-full flex-col gap-6">
          <p className="font-medium text-muted-foreground text-sm">
            {imagesLength < 1 ? 'Ainda sem imagens' : 'Imagens Atuais'}
          </p>
          {currentImages?.length === 0 && newImages?.length === 0 && (
            <p className="text-sm text-zinc-500">
              Nenhuma imagem na galeria. Adicione uma abaixo.
            </p>
          )}

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {currentImages?.map(img => (
              <div key={img.path} className="relative aspect-video">
                <Image
                  src={img.url}
                  alt="Imagem existente"
                  fill
                  className="rounded-lg object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-7 w-7 rounded-full"
                  onClick={() => handleDeleteExisting(img.path)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}

            {newImages.map(img => (
              <div key={img.previewUrl} className="relative aspect-video">
                <Image
                  src={img.previewUrl}
                  alt="Nova imagem preview"
                  fill
                  className="rounded-lg object-cover ring-2 ring-blue-500"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-7 w-7 rounded-full"
                  onClick={() => handleDeleteNew(img.previewUrl)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}

            {imagesLength >= planConfig?.imagesGallery ? (
              <div className="pointer-none: relative flex w-full cursor-not-allowed flex-col items-center justify-center rounded-lg border-2 border-zinc-300 border-dashed bg-zinc-50 text-zinc-500 transition-colors hover:border-blue-400 hover:bg-blue-50">
                <div className="relative z-10 flex flex-col items-center p-4 text-center">
                  <Camera size={32} />
                  <p className="mt-2 font-semibold text-md">
                    Limite: {`${imagesLength} / ${planConfig.imagesGallery}`}
                  </p>

                  <p className="text-rose-400 text-xs">Limite alcançado</p>
                </div>
              </div>
            ) : (
              <ImageUploader
                label="Adicionar Imagem(ns)"
                aspectRatio={aspectRatio}
                onFileProcessed={handleAddFile}
                recommendation={`Recomendado: ${
                  aspectRatio === 16 / 9 ? '1280x720' : '800x600'
                }`}
                className="min-h-[120px]"
              />
            )}
          </div>

          <footer className="flex w-full justify-end gap-4 pt-6">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              className="font-bold hover:cursor-pointer"
            >
              Voltar
            </Button>
            <Button
              onClick={handleSaveGallery}
              disabled={isSubmitting}
              className="min-w-[120px] font-bold"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Galeria'}
            </Button>
          </footer>
        </div>
      </Modal>
      {isSubmitting && <Loading />}
    </>
  )
}
