'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { Link } from '../ui/link'

interface DataProps {
  userId: string | null | undefined
  name: string | null | undefined
  link: string
}

export function ProfileSearchForm() {
  const [searchTerms, setSearchTerms] = useState('')
  const [profiles, setProfiles] = useState<DataProps[]>(() => [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const response = await fetch('/api/business', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        searchTerms: searchTerms,
      }),
    })

    const { data } = await response.json()

    console.log(data)
    setProfiles(data)
  }

  useEffect(() => {
    console.log(profiles)
  }, [profiles])

  return (
    <div className="w-full pt-8">
      <form onSubmit={onSubmit} className="mx-auto flex max-w-xl gap-1">
        <Input
          type="text"
          value={searchTerms}
          className="flex-1 px-6 text-xl"
          onChange={e => setSearchTerms(e.target.value)}
          placeholder="Quem você deseja encontrar?"
        />
        <Button type="submit">Buscar</Button>
      </form>

      <div className="flex size-full flex-col py-8">
        {profiles?.length && (
          <h2 className="py-6 text-center font-bold text-2xl">Resultados</h2>
        )}
        {profiles?.map(profile => (
          <Link
            variant="ghost"
            href={profile.link}
            key={profile?.userId}
            className="group w-full rounded-none border-zinc-100 border-b font-medium text-zinc-700 transition-all duration-300 ease-in-out"
            target="_blank"
          >
            <h2 className="mx-auto max-w-fit group-hover:scale-125">
              {profile.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  )
}
