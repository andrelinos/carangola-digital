'use client'

import { Heart, HeartSolid } from 'iconoir-react'
import type { Session } from 'next-auth'
import { useParams, useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'

import { toggleBusinessFavorite } from '@/actions/add-business-to-favorites'
import { Button } from '@/components/ui/button'

import { Loading } from '@/components/commons/loading'
import { toast } from 'sonner'
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
      toast.success(
        isFavorite
          ? 'Negócio removido dos favoritos com sucesso!'
          : 'Negócio adicionado aos favoritos com sucesso!'
      )
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
    <>
      <div className="top-0 right-0 flex justify-center gap-2 p-4 text-zinc-500 lg:absolute">
        {!isOwner && userInfo?.id && (
          <div className="flex items-center gap-6 lg:flex-col lg:gap-1">
            <div className="flex flex-col items-center gap-1 lg:flex-col">
              <span className="font-normal text-xs text-zinc-700">
                Favoritos
              </span>
              <Button
                variant="ghost"
                className="flex flex-col items-center p-0 transition-all duration-300 ease-in-out hover:scale-115 hover:cursor-pointer"
                onClick={handleAddToFavorites}
              >
                {isFavorite ? (
                  <HeartSolid className=" size-8 stroke-1 text-red-500" />
                ) : (
                  <Heart className="size-8 stroke-1 text-zinc-700" />
                )}
              </Button>
            </div>
            <ShareButton />
          </div>
        )}
      </div>
      {isSubmitting && <Loading />}
    </>
  )
}
