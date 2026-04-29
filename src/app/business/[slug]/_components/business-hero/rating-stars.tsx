'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Star } from 'iconoir-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { submitRating } from '@/actions/business/submit-rating'
import { cn } from '@/lib/utils'

interface RatingStarsProps {
  profileId: string
  slug: string
  initialRating: number
  totalReviews: number
  userRating?: number | null
  isLoggedIn: boolean
  isOwner?: boolean
}

export function RatingStars({
  profileId,
  slug,
  initialRating,
  totalReviews,
  userRating,
  isLoggedIn,
  isOwner,
}: RatingStarsProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const isInteractionDisabled = isOwner || isPending
  const currentDisplayRating =
    hoveredRating !== null && !isOwner
      ? hoveredRating
      : userRating || initialRating

  const handleRate = async (score: number) => {
    if (!isLoggedIn) {
      toast.error('Você precisa estar logado para avaliar!', {
        description: 'Faça login com sua conta Google para continuar.',
        action: {
          label: 'Login',
          onClick: () => router.push('/auth/signin'),
        },
      })
      return
    }

    startTransition(async () => {
      const result = await submitRating({ profileId, score, slug })

      if (result.success) {
        toast.success(
          userRating
            ? 'Sua avaliação foi atualizada!'
            : 'Obrigado pela sua avaliação!',
          {
            icon: <Star className="size-4 fill-current text-amber-500" />,
          }
        )
      } else {
        toast.error('Ocorreu um erro ao enviar sua avaliação.')
      }
    })
  }

  return (
    <div className="flex flex-col items-center gap-3 md:items-start">
      <div className="flex items-center gap-4">
        {/* Stars Container */}
        <div className="flex gap-1" onMouseLeave={() => setHoveredRating(null)}>
          {[1, 2, 3, 4, 5].map(star => (
            <motion.button
              key={star}
              disabled={isInteractionDisabled}
              whileHover={!isInteractionDisabled ? { scale: 1.2, y: -2 } : {}}
              whileTap={!isInteractionDisabled ? { scale: 0.9 } : {}}
              onMouseEnter={() =>
                !isInteractionDisabled && setHoveredRating(star)
              }
              onClick={() => handleRate(star)}
              className={cn(
                'relative transition-colors duration-200 focus:outline-none',
                isInteractionDisabled ? 'cursor-default' : 'cursor-pointer'
              )}
            >
              <Star
                className={cn(
                  'size-5 transition-all duration-300 md:size-6',
                  star <= Math.floor(currentDisplayRating)
                    ? 'fill-current text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                    : 'text-zinc-600'
                )}
              />

              {/* Active User Rating Indicator Dot */}
              {userRating === star && !hoveredRating && (
                <div className="absolute -bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-amber-500" />
              )}
            </motion.button>
          ))}
        </div>

        {/* Rating Value */}
        <div className="flex items-center gap-2 font-bold text-sm text-white/90">
          <AnimatePresence mode="wait">
            <motion.span
              key={initialRating}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl tracking-tighter"
            >
              {typeof initialRating === 'number'
                ? initialRating.toFixed(1)
                : '0.0'}
            </motion.span>
          </AnimatePresence>
          <span className="text-white/40">/ 5</span>
        </div>
      </div>

      {/* Helper Text */}
      <div className="flex items-center gap-2 font-semibold text-[10px] text-white/50 uppercase tracking-widest sm:text-xs">
        {isOwner ? (
          <span className="text-amber-500/60">
            Proprietários não podem avaliar a si mesmos
          </span>
        ) : userRating ? (
          <span className="text-amber-500/80 underline decoration-amber-500/30 underline-offset-4">
            Sua nota: {userRating} estrelas (clique para mudar)
          </span>
        ) : (
          <span>
            {isLoggedIn
              ? 'Clique nas estrelas para avaliar'
              : 'Faça login para avaliar'}
          </span>
        )}
      </div>
    </div>
  )
}
