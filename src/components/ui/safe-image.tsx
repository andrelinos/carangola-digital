'use client'

import Image, { type ImageProps } from 'next/image'
import { useEffect, useState } from 'react'

interface SafeImageProps extends ImageProps {
  fallbackSrc?: string
}

export function SafeImage({
  src,
  fallbackSrc = '/default-image.png',
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
    />
  )
}
