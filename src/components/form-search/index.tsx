'use client'

import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'

import type { ProfileDataProps } from '@/_types/profile-data'
import { Loading } from '@/components/commons/loading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BusinessCard } from '@/components/business/business-card'

export default function SearchFormBusiness() {
  const [searchTerms, setSearchTerms] = useState('')
  const [resultsSearch, setResultsSearch] = useState<ProfileDataProps[]>([])
  const [isLoadingBusiness, setIsLoadingBusiness] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  function onChangeSearchTerms(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setSearchTerms(value)
    setHasSearched(false)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (searchTerms.trim().length < 3) return
    
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
    } catch {
      console.error('Erro na busca')
    } finally {
      setHasSearched(true)
      setIsLoadingBusiness(false)
    }
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 py-8">
        <form
          onSubmit={onSubmit}
          className="group relative mx-auto flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              type="search"
              name="searchTerms"
              value={searchTerms}
              onChange={onChangeSearchTerms}
              placeholder="Ex: Restaurante, Mecânica, Advogado..."
              className="h-14 w-full rounded-2xl border-border bg-background pl-12 pr-6 text-lg shadow-sm ring-offset-background transition-all focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="h-14 rounded-2xl bg-primary px-8 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            disabled={searchTerms.trim().length < 3 || isLoadingBusiness}
          >
            {isLoadingBusiness ? (
              <Loader2 className="mr-2 size-5 animate-spin" />
            ) : (
              <Search className="mr-2 size-5" />
            )}
            Encontrar
          </Button>
        </form>

        {resultsSearch && resultsSearch.length > 0 && (
          <div className="flex w-full flex-col gap-6 py-12">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="font-bold text-2xl tracking-tight">
                Resultados da sua busca
              </h2>
              <span className="text-muted-foreground text-sm">
                {resultsSearch.length} {resultsSearch.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </span>
            </div>
            
            <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {resultsSearch.map((profile, index) => (
                <div key={profile?.id || profile?.userId + String(index)} className="flex justify-center">
                  <BusinessCard profile={profile} />
                </div>
              ))}
            </div>
          </div>
        )}

        {hasSearched &&
          !isLoadingBusiness &&
          resultsSearch &&
          resultsSearch.length === 0 && (
            <div className="flex w-full flex-col items-center py-12 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <Search className="size-8 text-muted-foreground" />
              </div>
              <h2 className="font-bold text-2xl">
                Nenhum resultado encontrado
              </h2>
              <p className="mt-2 text-muted-foreground max-w-md">
                Não encontramos o que você procurava. Tente usar termos mais genéricos ou verifique a ortografia.
              </p>
            </div>
          )}
      </div>
      {isLoadingBusiness && <Loading />}
    </>
  )
}
