import type { ProfileDataResponseProps } from '@/_types/profile-data'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export function FormSearch() {
  const [searchTerms, setSearchTerms] = useState('')
  const [profiles, setProfiles] = useState<ProfileDataResponseProps[]>()
  const [isLoading, setIsLoading] = useState(false)
  const [imageProfile, setImageProfile] = useState('')

  return (
    <form onSubmit={onSubmit} className="mx-auto flex max-w-xl gap-1">
      <Input
        type="text"
        value={searchTerms}
        className="flex-1 px-6 text-xl"
        onChange={e => setSearchTerms(e.target.value)}
        placeholder="Quem você deseja encontrar?"
      />
      <Button type="submit" disabled={!searchTerms}>
        Buscar
      </Button>
    </form>
  )
}
