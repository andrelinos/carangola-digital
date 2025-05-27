import imageCompression from 'browser-image-compression'
import type { ClassValue } from 'clsx'
import clsx from 'clsx'
import type { ChangeEvent } from 'react'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeLink(link: string) {
  if (!link) return ''

  const sanitizedLink = link
    .replace(/\s/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLocaleLowerCase()

  return sanitizedLink
}

export async function compressFiles(files: File[]) {
  const compressPromises = files.map(async file => {
    try {
      return await compressImage(file)
    } catch (error) {
      return null
    }
  })

  return (await Promise.all(compressPromises)).filter(file => file != null)
}

export const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const options = {
      maxSize: 0.2, // MAX 200KB
      maxWidthOrHeight: 900,
      useWebWork: true,
      fileType: 'image/png',
    }

    imageCompression(file, options).then(compressedFile => {
      resolve(compressedFile)
    })
  })
}

export const normalizeUrl = (url: string): string => {
  const trimmedUrl = url.trim()

  // Verifica se já começa com 'http://' ou 'https://'
  if (trimmedUrl.startsWith('https://')) {
    return trimmedUrl
  }

  if (trimmedUrl.startsWith('http://')) {
    return trimmedUrl.replace('http://', 'https://') // Força HTTPS
  }

  // Adiciona 'https://' se não houver protocolo
  return `https://${trimmedUrl}`
}

export function triggerImageInput(id: string) {
  document.getElementById(id)?.click()
}

export function handleImageInput(e: ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0] ?? null

  if (file) {
    const imageURL = URL.createObjectURL(file)
    return imageURL
  }
  return null
}

export function formatPhoneNumber(phoneNumber: string) {
  const cleaned = phoneNumber.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phoneNumber
}

export function formatCep(cep: string) {
  return cep.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2')
}

export function sanitizePhoneNumber(phoneNumber: string) {
  if (!phoneNumber) return ''

  const sanitizedPhoneNumber = phoneNumber
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s/g, '')
    .replace(/[^0-9]/g, '')
    .toLowerCase()

  return sanitizedPhoneNumber
}
