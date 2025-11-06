'use client'

import clsx from 'clsx'
import { Image as ImageIcon } from 'lucide-react' // Ícone de fallback
import Image from 'next/image'
import { useEffect, useState } from 'react'
import type { PropertyProps } from '../../../../../_types/property'
import { EditPropertyGallery } from './edit-property-gallery'

interface PropertyImageGalleryProps {
  propertyData?: PropertyProps
  title: string
  propertyId: string
  isOwner: boolean
}

export function PropertyImageGallery({
  propertyData,
  title,
  propertyId,
  isOwner,
}: PropertyImageGalleryProps) {
  const images = propertyData?.images
  if (!images || images?.length === 0) {
    return (
      <div className="relative flex aspect-video w-full items-center justify-center border border-accent shadow-lg md:rounded-lg">
        <div className="absolute top-2 right-2 z-10">
          <EditPropertyGallery
            propertyData={propertyData}
            isOwner={isOwner}
            aspectRatio={16 / 9}
          />
        </div>
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <ImageIcon size={48} />
          <p className="font-medium">Nenhuma imagem cadastrada</p>
        </div>
      </div>
    )
  }

  const [selectedImage, setSelectedImage] = useState(images[0])

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0])
    }
  }, [images])

  return (
    <div className="relative w-full">
      <div className="group -top-6 absolute right-2 z-30 ">
        <EditPropertyGallery
          propertyData={propertyData}
          isOwner={isOwner}
          aspectRatio={16 / 9}
        />
      </div>
      <div className="relative aspect-video w-full overflow-hidden bg-gray-300/50 shadow-lg md:rounded-t-lg">
        <Image
          key={selectedImage.url}
          src={selectedImage.url}
          alt={`Imagem principal de ${title}`}
          fill
          className="object-cover transition-opacity duration-300"
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
      </div>

      {images?.length > 1 && (
        <div className="w-full overflow-x-auto rounded-b-lg border border-zinc-400/20 p-2 shadow-lg">
          <div className=" relative flex space-x-2">
            {images?.map((imgUrl, index) => (
              <button
                key={String(index)}
                type="button"
                onClick={() => setSelectedImage(imgUrl)}
                className={clsx(
                  'relative h-20 w-20 shrink-0 overflow-hidden rounded-md transition-all duration-200',
                  'ring-2 ring-transparent',
                  {
                    'opacity-100 ring-blue-600': selectedImage === imgUrl,

                    'opacity-60 hover:opacity-100 focus:opacity-100 focus:ring-blue-400':
                      selectedImage !== imgUrl,
                  }
                )}
              >
                <Image
                  src={imgUrl.url}
                  alt={`Miniatura ${index + 1} de ${title}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
