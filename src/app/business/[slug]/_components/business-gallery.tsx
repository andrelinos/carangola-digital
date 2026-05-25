'use client'

import { Expand, Trash2 } from 'lucide-react'
import { CldImage } from 'next-cloudinary'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { deleteGalleryImage } from '@/actions/business/delete-gallery-image'
import { ImageGalleryUpload } from '@/app/dashboard/perfil/_components/image-gallery-upload'

interface BusinessGalleryProps {
  galleryImages?: string[]
  isOwner?: boolean
  businessId?: string
  limit?: number
}

export function BusinessGallery({
  galleryImages,
  isOwner,
  businessId,
  limit,
}: BusinessGalleryProps) {
  const [isPending, startTransition] = useTransition()
  const currentImages = galleryImages || []

  // Esconde caso não seja dono e não haja imagens
  if (!isOwner && currentImages.length === 0) {
    return null
  }

  const handleDelete = (url: string) => {
    if (!businessId || !isOwner) return
    if (!confirm('Deseja realmente remover esta foto da sua galeria?')) return

    startTransition(async () => {
      const result = await deleteGalleryImage(businessId, url)
      if (result.success) {
        toast.success('Imagem removida com sucesso.')
      } else {
        toast.error(result.error || 'Erro ao remover imagem.')
      }
    })
  }

  return (
    <section className="my-12">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-bold text-2xl text-slate-900 tracking-tight dark:text-white">
          Nossa Galeria
        </h2>

        {/* Painel de Upload exposto in-place para o Proprietário */}
        {isOwner && businessId && limit !== undefined && (
          <ImageGalleryUpload
            businessId={businessId}
            currentImagesCount={currentImages.length}
            limit={limit}
          />
        )}
      </div>

      {currentImages.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {currentImages.map((imageUrl, index) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: Imagens de galeria podem não ter ID único atrelado além do URL
              key={index}
              className="group relative aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800"
            >
              <CldImage
                src={imageUrl}
                alt={`Galeria de fotos do estabelecimento - imagem ${index + 1}`}
                fill
                crop="fill"
                gravity="auto"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay Interativo */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100">
                {isOwner ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(imageUrl)}
                    disabled={isPending}
                    className="rounded-full bg-red-600 p-3 text-white shadow-lg backdrop-blur-sm transition-transform hover:scale-110 disabled:opacity-50"
                    title="Excluir foto"
                  >
                    <Trash2 className="size-5" />
                  </button>
                ) : (
                  <div className="rounded-full bg-white/90 p-2 text-slate-900 backdrop-blur-sm transition-transform group-hover:scale-110">
                    <Expand className="size-5" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        isOwner && (
          <div className="rounded-xl border border-slate-200 border-dashed bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/50">
            <p className="font-medium text-muted-foreground text-sm">
              Sua galeria PRO está vazia. Use o botão acima para adicionar fotos
              e atrair mais clientes!
            </p>
          </div>
        )
      )}
    </section>
  )
}
