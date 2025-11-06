import { Camera } from 'lucide-react'
import Image from 'next/image'

import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
} from 'react-image-crop'

import { Button } from '@/components/ui/button'
import { compressImage } from '@/utils/compress-image'
import clsx from 'clsx'
import { type ChangeEvent, useEffect, useRef, useState } from 'react'

interface ImageUploaderProps {
  label: string
  aspectRatio: number
  initialImageUrl?: string
  onCropComplete: (file: File | null) => void
  className?: string
  container?: string
  recommendation?: string
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
    canvas.toBlob(resolve, 'image/jpeg', 0.95)
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

export function ImageUploader({
  label,
  aspectRatio,
  initialImageUrl,
  onCropComplete,
  recommendation,
  className,
  container,
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
    <div className={clsx('flex flex-col', container)}>
      <label
        htmlFor=""
        className="w-full text-center font-medium text-sm text-zinc-700"
      >
        {label}
      </label>
      <div className="mt-2">
        {imgSrc ? (
          <div className={clsx('flex flex-col items-center gap-4', className)}>
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={c => setCompletedCrop(c)}
              aspect={aspectRatio}
              minWidth={150}
              className="h-auto max-h-96"
            >
              <img
                ref={imgRef}
                alt="Recortar imagem"
                src={imgSrc}
                onLoad={onImageLoad}
                className="max-h-46 w-full object-contain"
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
            className={clsx(
              'relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-zinc-300 border-dashed bg-zinc-50 text-zinc-500 transition-colors hover:border-blue-400 hover:bg-blue-50',
              className
            )}
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
