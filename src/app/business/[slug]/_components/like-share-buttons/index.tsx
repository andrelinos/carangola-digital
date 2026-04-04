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
import { cn } from '@/lib/utils'

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
    return null
  }
  const profileId = profileData.id

  async function handleAddToFavorites() {
    if (!userInfo?.id) {
       toast.error('Você precisa estar logado para favoritar.')
       return
    }

    setIsSubmitting(true)
    const originalState = isCurrentlyFavorite
    setIsCurrentlyFavorite(!originalState)

    try {
      await toggleBusinessFavorite(userInfo?.id, profileId)
      toast.success(
        originalState
          ? 'Removido dos favoritos!'
          : 'Adicionado aos favoritos!'
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
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {!isUserAuth && !isOwner && (
          <button
            type="button"
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-2xl p-4 font-bold transition-all active:scale-95",
              isCurrentlyFavorite 
                ? "bg-rose-50 text-rose-500 ring-1 ring-rose-200 dark:bg-rose-950/20 dark:ring-rose-900/50" 
                : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 transition-all hover:bg-slate-100 dark:bg-slate-900/40 dark:text-slate-400 dark:ring-slate-700"
            )}
            onClick={handleAddToFavorites}
          >
            {isCurrentlyFavorite ? (
              <HeartSolid className="size-5 fill-current" />
            ) : (
              <Heart className="size-5" />
            )}
            <span>{isCurrentlyFavorite ? 'Favoritado' : 'Favoritar'}</span>
          </button>
        )}
        
        <div className={cn(!isUserAuth && !isOwner ? "" : "col-span-2")}>
          <ShareButton />
        </div>
      </div>
      {isSubmitting && <Loading />}
    </div>
  )
}
