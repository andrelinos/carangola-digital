'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

import { createBusinessLink } from '@/actions/business/create-business-link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Label } from '@/components/ui/label'
import { forbiddenProfiles } from '@/configs/forbidden-profiles'

import { sanitizeLink } from '@/utils/sanitize-link'
import type { Session } from 'next-auth'
import { toast } from 'sonner'

interface Props {
  session: Session | null
}

export function CreateLinkForm({ session }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const user = session?.user || null

  const [link, setLink] = useState(user?.name ? sanitizeLink(user?.name) : '')
  const [error, setError] = useState('')
  const [name, setName] = useState(user?.name || '')
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

    startTransition(async () => {
      const response = await createBusinessLink({ link, name })
      if (response?.success) {
        toast.success('Perfil criado com sucesso!')
        router.push(`/business/${link}`)
      } else {
        setError(response?.error || '')
        toast.error(response?.error)
      }
      setIsLoading(false)
    })
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
          disabled={!link || isLoading || isPending}
          variant={link ? 'default' : 'secondary'}
          className="mx-auto mt-4 w-full max-w-xs disabled:cursor-not-allowed disabled:opacity-25"
        >
          {isPending ? 'Criando...' : 'Criar'}
        </Button>
      </form>
      <div className="block h-16 w-full pt-2 text-center">
        <span className="text-accent-pink opacity-70">{error}</span>
      </div>
    </>
  )
}
