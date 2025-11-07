import imageCompression from 'browser-image-compression'

type Options = {
  maxSizeMB?: number
  maxWidthOrHeight?: number
}

export async function compressImage(
  file: File,
  options: Options = {}
): Promise<File | null> {
  if (!file.type.startsWith('image/')) {
    console.warn('Tentativa de comprimir arquivo que não é imagem:', file.name)
    return null
  }

  const defaultOptions = {
    maxSizeMB: options.maxSizeMB || 0.5, // 500KB por padrão
    maxWidthOrHeight: options.maxWidthOrHeight || 720, // 720px por padrão
    useWebWorker: true,
    initialQuality: 0.8,
    fileType: 'image/webp',
  }

  try {
    const compressedFile = await imageCompression(file, defaultOptions)

    return new File([compressedFile], file.name, {
      type: compressedFile.type,
      lastModified: Date.now(),
    })
  } catch (error) {
    console.error('Erro ao comprimir imagem:', error)
    return null
  }
}
