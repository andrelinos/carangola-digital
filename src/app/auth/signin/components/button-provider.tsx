'use client'

import { signIn } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { LoaderCircleIcon } from 'lucide-react'
import { useState } from 'react'

interface componentsProps {
  title: string
  provider: string
}

export function ButtonProvider({ provider, title, ...rest }: componentsProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSignin() {
    try {
      setIsLoading(true)
      await signIn(provider)
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      className="w-full max-w-xs"
      onClick={handleSignin}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <LoaderCircleIcon className="size-6 animate-spin" />
      ) : (
        `Entrar com ${title}`
      )}
    </Button>
  )
}
