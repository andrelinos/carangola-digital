'use client'

import Link from 'next/link'
import { useState } from 'react'

import type { ProfileDataProps } from '@/_types/profile-data'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getOperatingStatus } from '@/utils/get-status-from-day'
import Image from 'next/image'

interface SearchProps extends ProfileDataProps {
  profileId: string
}

export default function SearchFormBusiness() {
  const [searchTerms, setSearchTerms] = useState('')
  const [resultsSearch, setResultsSearch] = useState<SearchProps[]>([])
  const [isLoadingBusiness, setIsLoadingBusiness] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  function onChangeSearchTerms(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearchTerms(value)
    setHasSearched(false)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoadingBusiness(true)

    try {
      const formData = new FormData()
      formData.append('searchTerms', searchTerms)

      const response = await fetch('/api/business', {
        method: 'POST',
        body: formData,
      })

      const json = await response.json()
      setResultsSearch(json.data || [])
    } catch (error) {
      console.error('Erro na busca:', error)
    } finally {
      setHasSearched(true)
      setIsLoadingBusiness(false)
    }
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 py-4">
        <form
          onSubmit={onSubmit}
          className="mx-auto flex w-full max-w-xl flex-col gap-2 sm:flex-row"
        >
          <Input
            type="search"
            name="searchTerms"
            value={searchTerms}
            onChange={onChangeSearchTerms}
            placeholder="Quem você deseja encontrar?"
            className="h-14 flex-1 rounded-lg border border-gray-300 px-6 text-xl shadow-sm"
          />
          <Button
            type="submit"
            className="h-14 rounded bg-blue-500 px-4 py-4 text-white"
            disabled={searchTerms.trim().length < 3 || isLoadingBusiness}
          >
            Encontrar
          </Button>
        </form>

        {resultsSearch && resultsSearch?.length > 0 && (
          <div className="flex size-full flex-col gap-2 py-8">
            <h2 className=" py-6 text-center font-bold text-2xl">
              Resultados da sua busca
            </h2>
            <div className="flex w-full max-w-5xl flex-wrap justify-around gap-6">
              {resultsSearch?.map((profile, index) => (
                <Link
                  key={profile?.userId + String(index)}
                  href={`/business/${profile.slug}`}
                  className="group h-[300px] w-[332px] overflow-hidden rounded-lg bg-zinc-50 py-4 font-medium text-zinc-700 transition-all duration-300 ease-in-out hover:bg-blue-100"
                  target="_blank"
                >
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex h-14 w-full items-center justify-center">
                      {getOperatingStatus({
                        schedule: profile.openingHours as any,
                        currentTime: new Date(),
                        openingHours: profile.openingHours,
                      })}
                    </div>
                    <div className="relative flex h-24 w-full items-center justify-center overflow-hidden ">
                      <Image
                        width={100}
                        height={100}
                        className="z-10 h-full max-h-24 w-auto shadow-2xl lg:max-h-24"
                        src={profile.imagePath || '/default-image.png'}
                        alt={profile.name}
                        priority
                      />

                      <Image
                        id="background-image"
                        loading="eager"
                        src={profile?.imagePath || '/default-image.png'}
                        className="absolute z-0 size-full object-cover object-center opacity-90 blur-md"
                        alt={profile?.name || ''}
                        quality={10}
                        fill
                        unoptimized
                        priority
                      />
                    </div>
                    <div className="flex-1 px-4">
                      <h2 className="text-center font-semibold text-xl">
                        {profile.name}
                      </h2>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        {hasSearched &&
          !isLoadingBusiness &&
          resultsSearch &&
          resultsSearch.length === 0 && (
            <div className="flex size-full flex-col py-8">
              <h2 className="py-6 text-center font-bold text-2xl">
                Nenhum resultado encontrado
              </h2>
            </div>
          )}
      </div>
      {isLoadingBusiness && <Loading />}
    </>
  )
}
