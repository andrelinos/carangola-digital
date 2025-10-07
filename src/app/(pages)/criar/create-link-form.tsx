'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import { createBusinessLink } from '@/actions/create-business-link'
import { verifyLink } from '@/actions/verify-link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { forbiddenProfiles } from '@/assets/data/forbidden-profiles'
import { Label } from '@/components/ui/label'
import { sanitizeLink } from '@/lib/utils'
import type { Session } from 'next-auth'

interface Props {
  session: Session | null
}

export function CreateLinkForm({ session }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const user = session?.user || null

  const [link, setLink] = useState(
    sanitizeLink(searchParams?.get('link') || '') ?? ''
  )
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setError('')
    setLink(sanitizeLink(value))
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    if (!link) {
      setError('Escolha um link antes de continuar :)')
      return
    }

    if (link.length < 3) {
      setError('O link deve ter pelo menos 3 caracteres')
      return
    }

    if (link.length > 30) {
      setError('O link deve ter no máximo 30 caracteres')
      return
    }

    if (forbiddenProfiles.some(profile => link === profile)) {
      setError('Este link não é permitido.')
      return
    }

    const isLinkTaken = await verifyLink(link)
    if (isLinkTaken) {
      return setError('Desculpe, esse link já está em uso.')
    }

    try {
      await createBusinessLink({ link, name })

      router.push(`/${link}`)
    } catch (error) {
      console.log(error)
      return setError(
        'Desculpe, não conseguimos criar o link. Tente novamente.'
      )
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-2 ">
        {!user?.name && (
          <div className="flex w-full flex-col items-center gap-2">
            <Label className="mt-4 font-semibold">
              Informe um nome para seu negócio
            </Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
        )}
        <div className="flex w-full items-center gap-2">
          <span className="">carangoladigital.com.br/</span>
          <Input
            literalerror={!!error}
            value={link}
            onChange={handleLinkChange}
          />
        </div>
        <Button
          disabled={!link || isLoading}
          variant={link ? 'default' : 'secondary'}
          className="mx-auto mt-4 w-full max-w-xs disabled:cursor-not-allowed disabled:opacity-25"
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
