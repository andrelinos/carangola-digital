'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { updateServiceListing } from '@/actions/services/update-service-listing'
import { Button } from '@/components/ui/button'

export function ToggleServiceButton({
  id,
  isActive,
}: {
  id: string
  isActive: boolean
}) {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  async function handleToggle() {
    setIsPending(true)
    await updateServiceListing({ id, isActive: !isActive })
    setIsPending(false)
    router.refresh()
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-foreground"
      onClick={handleToggle}
      disabled={isPending}
      title={isActive ? 'Desativar' : 'Ativar'}
    >
      {isActive ? (
        <EyeOff className="size-4" />
      ) : (
        <Eye className="size-4" />
      )}
      <span className="sr-only">{isActive ? 'Desativar' : 'Ativar'}</span>
    </Button>
  )
}
