'use client'

import { ImagePlus, Loader2 } from 'lucide-react'
import {
  CldUploadWidget,
  type CloudinaryUploadWidgetResults,
} from 'next-cloudinary'
import { useState } from 'react'
import { toast } from 'sonner'

import { saveGalleryImage } from '@/actions/business/save-gallery-image'

interface ImageGalleryUploadProps {
  businessId: string
  currentImagesCount: number
  limit: number
}

export function ImageGalleryUpload({
  businessId,
  currentImagesCount,
  limit,
}: ImageGalleryUploadProps) {
  const [isSaving, setIsSaving] = useState(false)

  const isLimitReached = currentImagesCount >= limit

  const handleUploadSuccess = async (
    results: CloudinaryUploadWidgetResults
  ) => {
    // Validação da URL segura retornada pelo Cloudinary
    if (typeof results.info === 'object' && 'secure_url' in results.info) {
      setIsSaving(true)
      const secureUrl = results.info.secure_url

      // Chamada da Server Action para gravar no Firebase Firestore
      const response = await saveGalleryImage(businessId, secureUrl)

      if (response.success) {
        toast.success('Imagem adicionada à galeria com sucesso!')
      } else {
        toast.error(response.error || 'Erro ao salvar a imagem.')
      }

      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {isLimitReached ? (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/50 dark:bg-orange-900/20">
          <p className="font-medium text-orange-800 text-sm dark:text-orange-200">
            Você atingiu o limite de {limit} fotos na sua galeria (Plano PRO).
            Exclua alguma imagem para adicionar novas.
          </p>
        </div>
      ) : (
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          options={{
            maxFiles: limit - currentImagesCount,
            resourceType: 'image',
            clientAllowedFormats: ['png', 'jpeg', 'jpg', 'webp'],
            language: 'pt',
          }}
          onSuccess={handleUploadSuccess}
        >
          {({ open }) => {
            return (
              <button
                type="button"
                onClick={() => open()}
                disabled={isSaving}
                className="flex w-fit items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Salvando no banco...
                  </>
                ) : (
                  <>
                    <ImagePlus className="size-5" />
                    Fazer Upload de Foto
                  </>
                )}
              </button>
            )
          }}
        </CldUploadWidget>
      )}
      <p className="text-muted-foreground text-sm">
        {currentImagesCount} de {limit} imagens utilizadas na sua vitrine.
      </p>
    </div>
  )
}
