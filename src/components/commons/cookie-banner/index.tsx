'use client'

import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

const COOKIE_KEY = 'consentCookie'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 ano em segundos

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : null
}

function CookieConfigModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-auto max-w-md rounded-md bg-white p-6">
        <h2 className="mb-4 font-bold text-xl">Configurações de Cookies</h2>
        <p className="mb-4">
          Para configurar os cookies, acesse as configurações do seu navegador.
          As instruções podem variar de acordo com o navegador.
        </p>
        <ul className="mb-4 list-disc pl-5 text-sm">
          <li>
            <strong>Google Chrome:</strong> Configurações &gt; Privacidade e
            segurança &gt; Cookies e outros dados do site.
          </li>
          <li>
            <strong>Mozilla Firefox:</strong> Opções &gt; Privacidade e
            Segurança &gt; Cookies e dados de sites.
          </li>
          <li>
            <strong>Microsoft Edge:</strong> Configurações &gt; Cookies e
            permissões do site.
          </li>
          <li>
            <strong>Opera:</strong> Configurações &gt; Privacidade e segurança
            &gt; Cookies e outros dados do site.
          </li>
          <li>
            <strong>Brave:</strong> Configurações &gt; Privacidade e segurança
            &gt; Cookies e outros dados do site.
          </li>
          <li>
            <strong>Safari (macOS):</strong> Vá até o menu{' '}
            <strong>Safári</strong> &gt; <strong>Ajustes</strong> &gt;{' '}
            <strong>Privacidade</strong>.
          </li>
        </ul>

        <Button onClick={onClose}>Fechar</Button>
      </div>
    </div>
  )
}

export function CookieBanner() {
  const [isBannerVisible, setIsBannerVisible] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!getCookie(COOKIE_KEY)) {
      setIsBannerVisible(true)
    }
  }, [])

  const handleAccept = () => {
    document.cookie = `${COOKIE_KEY}=accepted; path=/; max-age=${COOKIE_MAX_AGE}`
    setIsBannerVisible(false)
  }

  const handleConfigure = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  if (!isBannerVisible) return null

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center justify-between bg-gray-800 p-4 text-white md:flex-row">
        <p className="text-center text-sm md:text-left">
          Este site utiliza cookies para melhorar a experiência do usuário. Ao
          clicar em "Aceitar" você consente com o uso de cookies. Para mais
          controle, configure os cookies no seu navegador.
        </p>
        <div className="mt-2 flex gap-2 md:mt-0">
          <Button
            onClick={handleAccept}
            className="rounded bg-green-600 px-4 py-2 text-sm transition-colors hover:bg-green-700"
          >
            Aceitar
          </Button>
          <Button
            onClick={handleConfigure}
            className="rounded bg-blue-600 px-4 py-2 text-sm transition-colors hover:bg-blue-700"
          >
            Configurar
          </Button>
        </div>
      </div>
      {isModalOpen && <CookieConfigModal onClose={closeModal} />}
    </>
  )
}
