import {
  type PlanConfigProps,
  type PlanTypeProps,
  plansConfig,
} from '@/configs/plans'
import imageCompression from 'browser-image-compression'
import type { ClassValue } from 'clsx'
import clsx from 'clsx'
import type { ChangeEvent } from 'react'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sanitizeLink(link: string): string {
  if (!link) return ''

  const normalizedLink = link.normalize('NFD')

  const linkWithoutAccents = normalizedLink.replace(/\p{M}/gu, '')

  const sanitizedLink = linkWithoutAccents
    .toLocaleLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')

  return sanitizedLink
}

export const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  }

  try {
    const compressedFile = await imageCompression(file, options)

    return compressedFile
  } catch (error) {
    console.error('Erro ao comprimir a imagem, enviando a original:', error)
    return file
  }
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

  // Verifica se é um celular: 11 dígitos e o terceiro dígito é 9
  const isMobile = cleaned.length === 11 && cleaned[2] === '9'

  let match: RegExpMatchArray | null = null

  if (isMobile) {
    // Formata celular: (XX) 9XXXX-XXXX
    match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
  } else {
    // Formata número fixo: (XX) XXXX-XXXX
    match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
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

type PlanActive = {
  type?: string
  status: string
  expiresAt: number
  // … demais campos do seu objeto
}

export function getPlanConfig(planActive?: PlanActive): PlanConfigProps {
  const now = Date.now()

  const isValid =
    planActive &&
    planActive.status === 'active' &&
    typeof planActive.expiresAt === 'number' &&
    planActive.expiresAt > now

  const key: PlanTypeProps =
    isValid && (planActive?.type as PlanTypeProps) in plansConfig
      ? (planActive?.type as PlanTypeProps)
      : 'free'

  return plansConfig[key]
}

// // Exemplo de payload do usuário
// type UserData = {
//   socialMedias: Array<{
//     platform: keyof PlanConfigProps['socialMedias']
//     value: string
//   }>
//   businessPhones: Array<{ number: string }>
// }

// // Função que aplica o corte de acordo com o config
// export function filterUserData(
//   user: UserData,
//   planConfigProps: PlanConfigProps
// ): UserData {
//   // 1) Só retorna socialMedias com permissão `true`
//   const allowedSM = Object.entries(planConfigProps.socialMedias)
//     .filter(([, allowed]) => allowed)
//     .map(([platform]) => platform) as Array<
//     keyof PlanConfigProps['socialMedias']
//   >

//   const socialMedias = user.socialMedias.filter(item =>
//     allowedSM.includes(item.platform)
//   )

//   // 2) Limita a quantidade de telefones
//   const businessPhones = user.businessPhones.slice(
//     0,
//     planConfigProps.businessPhones.quantity
//   )

//   return { socialMedias, businessPhones }
// }
