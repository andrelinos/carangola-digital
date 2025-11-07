'use client'

import { Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import type { PropertyImage, PropertyProps } from '@/_types/property'
import { EditPropertyGallery } from './edit-property-gallery'
import { PropertyThumbList } from './property-thumb-list'

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

  const [selectedImage, setSelectedImage] = useState(
    images ? images[0] : ({} as PropertyImage)
  )

  useEffect(() => {
    if (images?.length > 0) {
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
          key={selectedImage?.url}
          src={selectedImage?.url}
          alt={`Imagem principal de ${title}`}
          fill
          className="object-cover transition-opacity duration-300"
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
        />
      </div>

      {images?.length > 1 && (
        <PropertyThumbList
          onSelectImage={setSelectedImage}
          selectedImage={selectedImage}
          title={title}
        />
      )}
    </div>
  )
}
