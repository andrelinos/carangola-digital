'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { createBusinessLink } from '@/actions/create-business-link'
import { verifyLink } from '@/actions/verify-link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { sanitizeLink } from '@/lib/utils'

export function CreateLinkForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [link, setLink] = useState(
    sanitizeLink(searchParams?.get('link') || '') ?? ''
  )
  const [error, setError] = useState('')

  const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setError('')
    setLink(sanitizeLink(value))
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!link) {
      setError('Escolha um link antes de continuar :)')
      return
    }

    const isLinkTaken = await verifyLink(link)
    if (isLinkTaken) {
      return setError('Desculpe, esse link já está em uso.')
    }

    const isLinkCreated = await createBusinessLink(link)

    if (!isLinkCreated)
      return setError(
        'Desculpe, não conseguimos criar o link. Tente novamente.'
      )

    router.push(`/${link}`)
  }

  return (
    <>
      <form onSubmit={onSubmit} className="flex w-full items-center gap-2 ">
        <span className="">carangoladigital.com.br/</span>
        <Input
          literalerror={!!error}
          value={link}
          onChange={handleLinkChange}
        />
        <Button
          disabled={!link}
          variant={link ? 'default' : 'secondary'}
          className="w-[126px] disabled:cursor-not-allowed disabled:opacity-25"
        >
          Criar
        </Button>
      </form>
      <div className="block h-16 w-full pt-2 text-center">
        <span className="text-accent-pink opacity-70">{error}</span>
      </div>
    </>
  )
}
