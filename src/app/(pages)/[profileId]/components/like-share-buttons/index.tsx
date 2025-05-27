'use client'

import clsx from 'clsx'
import { Heart } from 'iconoir-react'
import type { Session } from 'next-auth'
import { useParams, useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

import { toggleBusinessFavorite } from '@/actions/add-business-to-favorites'
import { Button } from '@/components/ui/button'

import { ShareButton } from './share-button'

interface Props {
  userInfo?: Session['user']
  isFavorite?: boolean
  isOwner?: boolean
}

export function LikeShareButtons({
  userInfo,
  isFavorite = false,
  isOwner = false,
}: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const profileId = useParams().profileId as string

  async function handleAddToFavorites() {
    setIsSubmitting(true)
    try {
      if (!userInfo?.id) return

      await toggleBusinessFavorite(userInfo?.id, profileId)
    } catch (error) {
      // return false
    } finally {
      startTransition(() => {
        setIsSubmitting(false)

        router.refresh()
      })
    }
  }

  return (
    <div className="top-0 right-0 flex justify-center gap-2 p-4 text-zinc-500 lg:absolute">
      {!isOwner && userInfo?.id && (
        <Button
          variant="ghost"
          className={clsx('flex flex-col items-center gap-1 p-0', {
            'text-red-500': isFavorite,
            'text-zinc-500': !isFavorite,
          })}
          onClick={handleAddToFavorites}
        >
          <Heart className="size-8 stroke-1" />
        </Button>
      )}
      <ShareButton />
    </div>
  )
}
