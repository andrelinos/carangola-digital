'use client'

import { Heart, HeartSolid } from 'iconoir-react'
import type { Session } from 'next-auth'
import { useParams, useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'
import { toast } from 'sonner'

import { toggleBusinessFavorite } from '@/actions/add-business-to-favorites'
import { Loading } from '@/components/commons/loading'

import { ShareButton } from './share-button'

interface Props {
  userInfo?: Session['user']
  isFavorite?: boolean
  isOwner?: boolean
  isUserAuth?: boolean
}

export function LikeShareButtons({
  userInfo,
  isFavorite = false,
  isOwner = false,
  isUserAuth = false,
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
      <div className="flex justify-center gap-2 p-4 text-zinc-500">
        <div className="flex items-center gap-6">
          {!isUserAuth && !isOwner && userInfo?.id && (
            <div className=" flex items-center ">
              <button
                type="button"
                className="group flex size-fit items-center gap-2 text-base text-zinc-700 transition-all hover:cursor-pointer"
                onClick={handleAddToFavorites}
              >
                <span className="flex size-fit items-center transition-all duration-300 ease-in-out group-hover:scale-115">
                  {isFavorite ? (
                    <HeartSolid className="size-6 stroke-1 text-red-500 " />
                  ) : (
                    <Heart className="size-6 stroke-1 text-zinc-700 transition-all duration-300 ease-in-out " />
                  )}
                </span>
                <span className="font-normal ">Favoritos</span>
              </button>
            </div>
          )}
          <ShareButton />
        </div>
      </div>
      {isSubmitting && <Loading />}
    </>
  )
}
