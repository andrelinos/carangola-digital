import type { ProfileDataProps } from '@/_types/profile-data'
import { Badge } from '@/components/ui/badge'
import { SafeImage } from '@/components/ui/safe-image'
import { MessageText, Star } from 'iconoir-react'
import Image from 'next/image'
import { EditBusinessInfo } from '../edit-business-info'

interface Props {
  profileData: ProfileDataProps
  isOwner?: boolean
  isUserAuth?: boolean
}

// Componente Refatorado para um visual mais elegante
export async function BusinessHero({
  profileData,
  isOwner,
  isUserAuth,
}: Props) {
  const {
    name,
    imagePath,
    coverImageUrl,
    logoImageUrl,
    businessDescription,
    category,
    categories,
    planType,
    rating,
    reviewCount,
    isPremium,
  } = profileData
  const currentRating = isPremium ? '4.9' : rating || '0.0'
  const currentReviewCount = isPremium ? 19 : reviewCount || 0

  // Função para renderizar as estrelas (mantida, mas com estilo refinado no uso)
  const renderStars = (ratingValue: string) => {
    const ratingNum = Number.parseFloat(ratingValue)
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= ratingNum) {
        // Estrela cheia
        stars.push(
          <Star
            key={i}
            className="h-5 w-5 text-yellow-400"
            fill="currentColor"
          />
        )
      } else if (i === Math.ceil(ratingNum) && !Number.isInteger(ratingNum)) {
        // Meia estrela (pode ser implementado com um ícone específico se disponível)
        stars.push(
          <div key={i} className="relative">
            <Star className="h-5 w-5 text-zinc-300" fill="currentColor" />
            <div className="absolute top-0 left-0 h-full w-1/2 overflow-hidden">
              <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
            </div>
          </div>
        )
      } else {
        // Estrela vazia
        stars.push(
          <Star key={i} className="h-5 w-5 text-zinc-300" fill="currentColor" />
        )
      }
    }
    return stars
  }

  return (
    <section className="w-full bg-slate-50 pb-12">
      {/* Banner Superior */}
      <div className="relative h-48 w-full md:h-64">
        <SafeImage
          src={coverImageUrl || '/default-image.png'}
          alt={`Banner de ${name}`}
          className="object-cover shadow-md"
          fill
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/10" />
      </div>

      {/* Container Principal do Conteúdo */}
      <div className="-mt-20 container px-4">
        <div className="relative rounded-2xl bg-white p-6 shadow-lg">
          {/* Cabeçalho com Foto, Título e Botão de Editar */}
          <div className="flex flex-col items-center gap-4 border-slate-200 border-b pb-6 text-center sm:flex-row sm:text-left">
            {/* Foto de Perfil */}
            <div className="relative h-28 w-28 flex-shrink-0">
              <SafeImage
                src={logoImageUrl || '/default-image.png'}
                alt={`Banner de ${name}`}
                className="rounded-full border-4 border-white object-cover shadow-md"
                fill
              />
            </div>

            {/* Título e Botão */}
            <div className="flex w-full flex-col items-center justify-between sm:flex-row sm:items-start">
              <h1 className="font-bold text-3xl text-zinc-800">{name}</h1>
              {(isOwner || isUserAuth) && (
                <div className="mt-2 sm:mt-0 sm:ml-4">
                  <EditBusinessInfo profileData={profileData} />
                </div>
              )}
            </div>
          </div>

          {/* Corpo do Card */}
          <div className="pt-6">
            {/* Linha de Informações Rápidas (Avaliações e Tags) */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Avaliações */}
              <div className="flex items-center justify-center gap-3 sm:justify-start">
                <div className="flex">{renderStars(currentRating)}</div>
                <div className="text-sm">
                  <span className="font-bold text-zinc-800">
                    {currentRating}
                  </span>
                  <span className="text-zinc-500"> / 5</span>
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <a
                  href="#avaliacoes"
                  className="flex items-center gap-1.5 text-sm text-zinc-600 hover:text-blue-600"
                >
                  <MessageText className="h-4 w-4" />
                  <span>{currentReviewCount} avaliações</span>
                </a>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                {categories?.length ? (
                  categories?.map(category => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      {category}
                    </Badge>
                  ))
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800"
                  >
                    Geral
                  </Badge>
                )}

                {(isOwner || isUserAuth) && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    {planType?.toUpperCase() || 'GRÁTIS'}
                  </Badge>
                )}
              </div>
            </div>

            {/* Descrição do Negócio */}
            {businessDescription && (
              <p className="mt-6 text-center text-base text-zinc-600 sm:text-left">
                {businessDescription}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
