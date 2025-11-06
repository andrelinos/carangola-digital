'use client'

import Link from 'next/link'
import { useState } from 'react'

import type { PropertyProps } from '@/_types/property'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/utils/format-price'
import Image from 'next/image'

interface SearchProps extends PropertyProps {}

export default function SearchFormProperties() {
  const [searchTerms, setSearchTerms] = useState('')
  const [resultsSearch, setResultsSearch] = useState<SearchProps[]>([])
  const [isLoadingProperties, setIsLoadingProperties] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  function onChangeSearchTerms(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearchTerms(value)
    setHasSearched(false)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoadingProperties(true)

    try {
      const formData = new FormData()
      formData.append('searchTerms', searchTerms)

      // Chama a nova API de busca de imóveis
      const response = await fetch('/api/properties', {
        method: 'POST',
        body: formData,
      })

      const json = await response?.json()
      setResultsSearch(json.data || [])
    } catch (error) {
      console.error('Erro na busca de imóveis:', error)
    } finally {
      setHasSearched(true)
      setIsLoadingProperties(false)
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
            placeholder="O que você procura? (Ex: Casa, Apto...)"
            className="h-14 flex-1 rounded-lg border border-gray-300 px-6 text-xl shadow-sm"
          />
          <Button
            type="submit"
            className="h-14 rounded bg-blue-500 px-4 py-4 text-white"
            disabled={searchTerms.trim().length < 3 || isLoadingProperties}
          >
            Buscar Imóvel
          </Button>
        </form>

        {resultsSearch && resultsSearch?.length > 0 && (
          <div className="flex size-full flex-col gap-2 py-8">
            <h2 className=" py-6 text-center font-bold text-2xl">
              Resultados da sua busca
            </h2>
            <div className="flex w-full max-w-5xl flex-wrap justify-around gap-6">
              {resultsSearch?.map(property => (
                <Link
                  key={property.id}
                  href={`/imoveis/${property.slug}`} // Rota de detalhe
                  className="group h-80 w-[332px] overflow-hidden rounded-lg bg-zinc-50 pb-4 font-medium text-zinc-700 shadow-md transition-all duration-300 ease-in-out hover:bg-blue-100"
                  target="_blank"
                >
                  <div className="flex h-full w-full flex-col gap-2">
                    <div className="relative h-48 w-full">
                      <Image
                        width={332}
                        height={192}
                        className="size-full object-cover"
                        src={'/default-image.png'}
                        // src={property.images[0] || '/default-image.png'}
                        alt={property.title}
                        priority
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between px-4">
                      <h2 className="text-center font-semibold text-xl">
                        {property.title}
                      </h2>
                      {property.type && (
                        <p className="text-center text-gray-600 text-sm capitalize">
                          {property.type === 'rent' ? 'Para Alugar' : 'À Venda'}
                        </p>
                      )}
                      {property.price && (
                        <p className="text-center font-bold text-blue-600 text-lg">
                          {formatPrice(property.price)}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        {hasSearched &&
          !isLoadingProperties &&
          resultsSearch &&
          resultsSearch.length === 0 && (
            <div className="flex size-full flex-col py-8">
              <h2 className="py-6 text-center font-bold text-2xl">
                Nenhum imóvel encontrado
              </h2>
            </div>
          )}
      </div>
      {isLoadingProperties && <Loading />}
    </>
  )
}
