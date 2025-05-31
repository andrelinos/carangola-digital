'use client'

import Link from 'next/link'
import { useState } from 'react'

import type { ProfileDataProps } from '@/_types/profile-data'
import { Loading } from '@/components/commons/loading'
import { getOperatingStatus } from '@/utils/get-status-from-day'
import Image from 'next/image'

interface SearchProps extends ProfileDataProps {
  profileId: string
}

export default function SearchFormClient() {
  const [searchTerms, setSearchTerms] = useState('')
  const [resultsSearch, setResultsSearch] = useState<SearchProps[]>([])
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

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
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 p-4">
        <form
          onSubmit={onSubmit}
          className="mx-auto flex max-w-xl flex-col gap-1 sm:flex-row"
        >
          <input
            type="text"
            name="searchTerms"
            value={searchTerms}
            onChange={e => setSearchTerms(e.target.value)}
            placeholder="Quem você deseja encontrar?"
            className="flex-1 rounded border border-gray-300 px-6 text-xl"
          />
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 text-white"
          >
            Buscar
          </button>
        </form>

        {resultsSearch && resultsSearch?.length > 0 && (
          <div className="flex size-full flex-col gap-2 py-8">
            <h2 className=" py-6 text-center font-bold text-2xl">Resultados</h2>
            <div className="flex w-full max-w-5xl flex-wrap justify-around gap-6">
              {resultsSearch?.map((profile, index) => (
                <Link
                  key={profile?.userId + String(index)}
                  href={`/${profile.profileId}`}
                  className="group h-[300px] w-[332px] overflow-hidden rounded-lg bg-zinc-50 py-4 font-medium text-zinc-700 transition-all duration-300 ease-in-out hover:bg-blue-100"
                  target="_blank"
                >
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex h-14 w-full items-center justify-center">
                      {getOperatingStatus(profile.openingHours as any)}
                    </div>
                    <div className="flex h-[96.735px] w-full items-center justify-center overflow-hidden bg-zinc-100">
                      <Image
                        width={400}
                        height={100}
                        className="size-full object-cover object-left-top"
                        src={profile.imagePath || '/default-image.png'}
                        alt={profile.name}
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
        {resultsSearch && resultsSearch?.length === 0 && (
          <div className="flex size-full flex-col py-8">
            <h2 className="py-6 text-center font-bold text-2xl">
              Nenhum resultado encontrado
            </h2>
          </div>
        )}
      </div>
      {isLoading && <Loading />}
    </>
  )
}
