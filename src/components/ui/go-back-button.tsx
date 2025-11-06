'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

type GoBackButtonProps = {
  fallbackHref?: string
}

export function GoBackButton({ fallbackHref = '/' }: GoBackButtonProps) {
  const router = useRouter()

  const handleGoBack = () => {
    if (typeof window === 'undefined') {
      router.push(fallbackHref)
      return
    }

    const currentHref = window.location.href

    if (window.history.length > 1) {
      router.back()
      // Se não houver mudança após curto intervalo, garante fallback
      setTimeout(() => {
        if (window.location.href === currentHref) {
          router.push(fallbackHref)
        }
      }, 150)
    } else {
      router.push(fallbackHref)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleGoBack}
      className="flex cursor-pointer items-center font-bold transition-all duration-300 ease-in-out hover:animate-pulse"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      <span className="">Voltar</span>
    </Button>
  )
}
