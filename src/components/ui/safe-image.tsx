// components/ui/safe-image.tsx
'use client'

import Image, { type ImageProps } from 'next/image'
import { useEffect, useState } from 'react'

interface SafeImageProps extends ImageProps {
  fallbackSrc?: string
}

/**
 * Um wrapper para o componente Next/Image que faz fallback para uma imagem padrão
 * em caso de erro no carregamento da imagem principal (ex: 404, imagem corrompida).
 */
export function SafeImage({
  src,
  fallbackSrc = '/default-avatar.png',
  alt,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)

  // Se o `src` externo mudar, resete o estado interno
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
