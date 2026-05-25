'use client'

import Image, { type ImageProps } from 'next/image'
import { useEffect, useState } from 'react'

interface SafeImageProps extends ImageProps {
  fallbackSrc?: string
}

export function SafeImage({
  src,
  fallbackSrc = '/default-image.webp',
  alt = '',
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
  }, [src])

  return (
    <Image
      {...props}
      alt={alt}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc)
      }}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority
    />
  )
}
