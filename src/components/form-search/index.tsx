'use client'

import { Check, ChevronsUpDown, LayoutGrid, MapPin, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { categories as dataCategories } from '@/assets/data/categories'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

const CATEGORIES = ['Todos', ...dataCategories]

const DISTANCES = [
  { value: '5', label: '+ 5 km' },
  { value: '10', label: '+ 10 km' },
  { value: '25', label: '+ 25 km' },
  { value: '50', label: '+ 50 km' },
  { value: '100', label: '+ 100 km' },
  { value: 'any', label: 'Qualquer distância' },
]

export default function SearchFormBusiness() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchTerms, setSearchTerms] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('cat') || 'Todos')
  const [openCategory, setOpenCategory] = useState(false)
  const [distance, setDistance] = useState(searchParams.get('dist') || 'any')

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const params = new URLSearchParams()
    if (searchTerms.trim().length >= 3) params.set('q', searchTerms.trim())
    if (category && category !== 'Todos') params.set('cat', category)
    if (distance && distance !== 'any') params.set('dist', distance)

    router.push(`/business?${params.toString()}#resultados`)
  }

  return (
    <div className="mx-auto flex w-full flex-col items-center gap-4 px-4 py-8 xl:px-8">
      <form
        onSubmit={onSubmit}
        className="group relative mx-auto flex w-full flex-col gap-3 rounded-3xl bg-background/80 p-3 shadow-xl ring-1 ring-black/5 backdrop-blur-xl md:flex-row md:items-center dark:bg-slate-900/80 dark:ring-white/10"
      >
        {/* Keyword Search Input */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            type="search"
            value={searchTerms}
            onChange={e => setSearchTerms(e.target.value)}
            placeholder="O que você procura?"
            className="h-14 w-full border-none bg-transparent pr-4 pl-12 text-base shadow-none ring-0 focus-visible:ring-0 md:text-lg"
          />
        </div>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-border md:block"></div>

        {/* Category Select - Combobox */}
        <div className="relative flex items-center md:w-56">
          <Popover open={openCategory} onOpenChange={setOpenCategory}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                role="combobox"
                aria-expanded={openCategory}
                className="h-14 w-full justify-between border-none bg-transparent px-3 font-normal text-muted-foreground shadow-none ring-0 hover:bg-transparent focus:ring-0"
              >
                <div className="flex w-full items-center gap-2 overflow-hidden">
                  <LayoutGrid className="size-5 shrink-0" />
                  <span className="truncate text-base">{category}</span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 md:w-64">
              <Command>
                <CommandInput placeholder="Buscar categoria..." />
                <CommandList>
                  <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
                  <CommandGroup>
                    {CATEGORIES.map(cat => (
                      <CommandItem
                        key={cat}
                        value={cat}
                        onSelect={currentValue => {
                          const selected =
                            CATEGORIES.find(
                              c => c.toLowerCase() === currentValue
                            ) || cat
                          setCategory(selected)
                          setOpenCategory(false)
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4 shrink-0',
                            category === cat ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        <span className="truncate">{cat}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-border md:block"></div>

        {/* Distance Select */}
        <div className="relative md:w-52">
          <Select value={distance} onValueChange={setDistance}>
            <SelectTrigger className="h-14 w-full border-none bg-transparent shadow-none ring-0 focus:ring-0">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="size-5" />
                <SelectValue placeholder="Distância" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {DISTANCES.map(d => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-14 w-full rounded-2xl bg-primary px-8 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] md:w-auto"
        >
          Encontrar
        </Button>
      </form>
    </div>
  )
}
