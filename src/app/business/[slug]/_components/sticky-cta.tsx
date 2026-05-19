'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

import type { BusinessPhoneProps } from '@/_types/profile-data'

interface StickyCtaProps {
  phones: BusinessPhoneProps[]
  businessName: string
}

export function StickyCta({ phones, businessName }: StickyCtaProps) {
  const [isVisible, setIsVisible] = useState(false)

  // Identifica o primeiro telefone que seja WhatsApp
  const whatsapp = phones?.find(p => p.isWhatsapp)

  useEffect(() => {
    const handleScroll = () => {
      // Exibe o CTA somente após o usuário descer 400px na tela
      setIsVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!whatsapp) return null

  // Remove formatações (parenteses, traços, espaços)
  const cleanPhone = whatsapp.phone.replace(/\D/g, '')

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          href={`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
            `Olá, vi o perfil de ${businessName} no Carangola Digital e gostaria de mais informações.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed right-6 bottom-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition-transform hover:scale-110 hover:bg-[#20bd5a] md:right-8 md:bottom-8"
        >
          <MessageCircle className="size-7 fill-current" />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
