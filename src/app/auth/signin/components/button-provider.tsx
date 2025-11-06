'use client'

import { signIn } from 'next-auth/react'

import { Button } from '@/components/ui/button'

interface componentsProps {
  title: string
  provider: string
}

export function ButtonProvider({ provider, title, ...rest }: componentsProps) {
  return (
    <Button
      className="w-full max-w-xs"
      onClick={() => signIn(provider)}
      {...rest}
    >
      Entrar com {title}
    </Button>
  )
}
