import { Label } from '@radix-ui/react-label'
import clsx from 'clsx'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'

interface CustomSelectProps {
  options: string[]
  placeholder?: string
  title?: string
  selected?: string | null
  handleSelectChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

export const Select: React.FC<CustomSelectProps> = ({
  options,
  placeholder = 'Localizar uma categoria',
  title,
  selected,
  handleSelectChange,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  // const [selected, setSelected] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  // Filtra as opções com base no texto digitado
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  )

  // Fecha o dropdown se clicar fora do componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full">
      {title && (
        <Label className="mb-1 block text-left font-semibold text-gray-700 text-sm">
          {title}
        </Label>
      )}

      <div className="h-12 rounded-lg">
        <select
          value={selected ?? ''}
          onChange={handleSelectChange}
          className="h-12 w-full rounded-lg border border-zinc-700 p-2"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <option
                key={option}
                value={option}
                className={clsx('flex gap-1', {
                  'bg-zinc-300 font-bold': selected === option,
                })}
              >
                {option}
              </option>
            ))
          ) : (
            <option value="" disabled>
              Nenhuma opção encontrada
            </option>
          )}
        </select>
      </div>
    </div>
  )
}
