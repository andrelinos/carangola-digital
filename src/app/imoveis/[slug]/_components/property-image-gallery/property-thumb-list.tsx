'use client'

import type { PropertyImage } from '@/_types/property'
import clsx from 'clsx'
import Image from 'next/image'

interface Props {
  title: string
  images?: PropertyImage[]
  selectedImage: PropertyImage
  onSelectImage: (image: PropertyImage) => void
}

export function PropertyThumbList({
  title,
  images,
  onSelectImage,
  selectedImage,
}: Props) {
  return (
    <div className="w-full overflow-x-auto rounded-b-lg border border-zinc-400/20 p-2 shadow-lg">
      <div className=" relative flex space-x-2">
        {images?.map((imgUrl, index) => (
          <button
            key={String(index)}
            type="button"
            onClick={() => onSelectImage(imgUrl)}
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
              src={imgUrl?.url}
              alt={`Miniatura ${index + 1} de ${title}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
