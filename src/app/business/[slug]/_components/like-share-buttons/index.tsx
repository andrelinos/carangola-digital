'use client'

import { Heart, HeartSolid } from 'iconoir-react'
import type { Session } from 'next-auth'
import { useRouter } from 'next/navigation'
import { startTransition, useState } from 'react'
import { toast } from 'sonner'

import { toggleBusinessFavorite } from '@/actions/business/add-business-to-favorites'
import { Loading } from '@/components/commons/loading'

import type { ProfileDataProps } from '@/_types/profile-data'
import { ShareButton } from './share-button'

interface Props {
  userInfo?: Session['user']
  isFavorite?: boolean
  isOwner?: boolean
  isUserAuth?: boolean
  profileData?: ProfileDataProps
}

export function LikeShareButtons({
  userInfo,
  isFavorite = false,
  isOwner = false,
  isUserAuth = false,
  profileData,
}: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCurrentlyFavorite, setIsCurrentlyFavorite] = useState(isFavorite)

  if (!profileData?.id) {
    return <div />
  }
  const profileId = profileData.id

  async function handleAddToFavorites() {
    if (!userInfo?.id) return

    setIsSubmitting(true)

    const originalState = isCurrentlyFavorite

    setIsCurrentlyFavorite(!originalState)

    try {
      await toggleBusinessFavorite(userInfo?.id, profileId)
      toast.success(
        originalState
          ? 'Negócio removido dos favoritos com sucesso!'
          : 'Negócio adicionado aos favoritos com sucesso!'
      )
    } catch (error) {
      toast.error('Ocorreu um erro ao favoritar.')
      setIsCurrentlyFavorite(originalState)
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
                  {isCurrentlyFavorite ? (
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
