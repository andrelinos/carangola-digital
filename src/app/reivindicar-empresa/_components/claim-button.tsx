'use client'

import { Button } from '@/components/ui/button'

import { useState } from 'react'

interface ClaimButtonProps {
  businessId?: string
  userId?: string
  companySlug?: string
}

export default function ClaimButton({
  businessId,
  userId,
  companySlug,
}: ClaimButtonProps) {
  const [buttonText, setButtonText] = useState('Confirmar Reivindicação')

  const [isLoading, setIsLoading] = useState(false)

  const handleClaimClick = () => {
    if (isLoading) return

    setIsLoading(true)

    const message = `Olá!

Estou entrando em contato para reivindicar a empresa:
- Perfil: ${companySlug || 'N/A'}
- ID: ${businessId || 'N/A'}
- UserId: ${userId || 'N/A'}

Obrigado!`

    const instagramUser = 'carangoladigital'
    const instagramUrl = `https://ig.me/m/${instagramUser}`

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(message)
        .then(() => {
          setButtonText('Mensagem Copiada!')
          setTimeout(() => {
            window.open(instagramUrl, '_blank', 'noopener,noreferrer')
            setButtonText('Confirmar Reivindicação')
            setIsLoading(false)
          }, 3000) // 3000ms = 3 segundos
        })
        .catch(err => {
          console.error('Falha ao copiar mensagem: ', err)
          window.open(instagramUrl, '_blank', 'noopener,noreferrer')
          setIsLoading(false)
        })
    } else {
      window.open(instagramUrl, '_blank', 'noopener,noreferrer')
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleClaimClick}
      // Desabilita o botão durante o timeout
      disabled={isLoading}
      className={`mt-8 w-full rounded-lg px-4 py-3 font-bold text-white transition-all duration-200 ${
        buttonText.includes('Copiada')
          ? 'bg-green-600 hover:bg-green-700'
          : 'bg-blue-600 hover:bg-blue-700'
      }
      ${
        // Adiciona estilo de desabilitado
        isLoading ? 'cursor-not-allowed opacity-50' : ''
      }
      `}
    >
      {buttonText}
    </Button>
  )
}
