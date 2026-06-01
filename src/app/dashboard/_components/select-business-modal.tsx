'use client'

import { Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { UserProfileTableData } from '@/actions/dashboard/get-user-profiles.action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SelectBusinessModalProps {
  open: boolean
  onClose: () => void
  onSelect: (slug: string) => void
  profiles: UserProfileTableData[]
  title: string
  description: string
  accentClass?: string
  checkIcon: React.ReactNode
}

export function SelectBusinessModal({
  open,
  onClose,
  onSelect,
  profiles,
  title,
  description,
  accentClass = 'hover:border-primary/50 hover:bg-primary/5',
  checkIcon,
}: SelectBusinessModalProps) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return profiles
    return profiles.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    )
  }, [profiles, query])

  if (!open) return null

  function handleClose() {
    setQuery('')
    onClose()
  }

  function handleSelect(slug: string) {
    setQuery('')
    onSelect(slug)
  }

  return (
    <div className="fade-in fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200">
      <div className="zoom-in-95 w-full max-w-md animate-in overflow-hidden rounded-3xl bg-white shadow-2xl duration-200 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-border border-b p-6">
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="text-muted-foreground text-xs">{description}</p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-2 transition-colors hover:bg-muted"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Search */}
        <div className="border-border border-b px-4 py-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Buscar empresa ou categoria..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="h-9 rounded-xl pl-9 text-sm"
            />
          </div>
        </div>

        {/* List */}
        <div className="max-h-[50vh] space-y-2 overflow-y-auto p-4">
          {filtered.map(profile => (
            <button
              key={profile.id}
              onClick={() => handleSelect(profile.slug)}
              className={`group flex w-full items-center gap-4 rounded-2xl border border-border p-3 text-left transition-all ${accentClass}`}
            >
              <div className="size-10 overflow-hidden rounded-xl border border-border bg-muted">
                {profile.image ? (
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center font-bold text-lg text-muted-foreground">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-sm leading-tight">
                  {profile.name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {profile.category}
                </p>
              </div>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100">
                {checkIcon}
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <p className="py-8 text-center text-muted-foreground text-sm italic">
              {query ? `Nenhum resultado para "${query}"` : 'Nenhuma empresa encontrada.'}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="bg-muted/30 p-4">
          <Button
            variant="outline"
            className="w-full rounded-2xl"
            onClick={handleClose}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}
