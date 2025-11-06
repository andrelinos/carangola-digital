'use client'

import { InfoCircle, Phone, Whatsapp } from 'iconoir-react'
import { Search } from 'lucide-react'
import { useState } from 'react'

import { Link } from '@/components/ui/link'
import { formatPhoneNumber } from '@/utils/format-phone-number'
import { normalizeText } from '@/utils/sanitize-text'
import { infoData } from './info-data'

interface SetoresProps {
  setor: string
  telefones: {
    phone: string
    isWhatsApp: boolean
  }[]
}

export default function UtilsPhonesPage() {
  const [search, setSearch] = useState('')

  const flattened = infoData.flatMap(group =>
    group.setores?.map(setor => ({
      categoria: group.categoria,
      ...setor,
    }))
  )

  const normalizedSearch = normalizeText(search)

  const filtered = flattened.filter(item => {
    const normalizedSetor = normalizeText(item.setor)

    return normalizedSetor.includes(normalizedSearch)
  })

  const grouped = Object.values(
    filtered.reduce(
      (acc, item) => {
        if (!acc[item.categoria]) {
          acc[item.categoria] = { categoria: item.categoria, setores: [] }
        }
        acc[item.categoria].setores.push(item)
        return acc
      },
      {} as Record<string, { categoria: string; setores: SetoresProps[] }>
    )
  )

  const getCleanPhoneNumber = (phone: string) => {
    return phone.replace(/[^0-9]/g, '')
  }

  return (
    <section className="min-h-screen w-full bg-slate-50 py-12 md:py-16 dark:bg-slate-900">
      <div className="mx-auto w-full max-w-6xl px-4">
        <h1 className="mb-8 text-center font-bold text-3xl text-slate-900 md:text-4xl dark:text-slate-100">
          Telefones Úteis
        </h1>

        <div className="relative mx-auto mb-10 w-full max-w-lg">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-5 w-5 text-slate-400" />
          </span>
          <input
            type="search"
            placeholder="Busque por nome..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white p-3 pl-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        <ul className="space-y-12">
          {grouped.length > 0 ? (
            grouped.map((group, idx) => (
              <div key={String(idx)} className="w-full">
                <h2 className="mb-6 border-slate-200 border-b pb-3 font-bold text-2xl text-blue-900 dark:border-slate-700 dark:text-blue-300">
                  {group.categoria}
                </h2>

                <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.setores?.map((setor, setorIdx) => (
                    <li
                      key={String(setorIdx)}
                      className="flex w-full flex-col rounded-lg bg-white p-5 shadow-md ring ring-gray-400/50 transition-shadow hover:shadow-lg hover:ring-blue-300 dark:border dark:border-slate-700 dark:bg-slate-800"
                    >
                      <div className="mb-4 font-semibold text-lg text-slate-900 dark:text-slate-100">
                        {setor.setor}
                      </div>
                      <ul className="flex w-full flex-1 flex-col space-y-3">
                        {setor.telefones?.map((tel, phoneIdx) => (
                          <li key={String(phoneIdx)} className="flex w-full">
                            {tel.isWhatsApp ? (
                              <Link
                                href={`https://wa.me/55${getCleanPhoneNumber(tel.phone)}`}
                                rel="noopener noreferrer"
                                target="_blank"
                                className="flex w-full flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-green-700"
                              >
                                <Whatsapp className="h-5 w-5" />
                                <span>{formatPhoneNumber(tel.phone)}</span>
                              </Link>
                            ) : (
                              <Link
                                href={`tel:${getCleanPhoneNumber(tel.phone)}`}
                                rel="noopener noreferrer"
                                className="flex w-full flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                              >
                                <Phone className="h-5 w-5" />
                                <span>{formatPhoneNumber(tel.phone)}</span>
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div className="w-full rounded-lg bg-white p-12 text-center text-slate-500 shadow-md dark:bg-slate-800 dark:text-slate-400">
              Nenhum resultado encontrado para &quot;{search}&quot;.
            </div>
          )}
        </ul>

        <p className="flex items-center justify-center gap-2 pt-12 text-center text-slate-500 text-xs dark:text-slate-400">
          <InfoCircle className="size-5 min-w-5" />
          Informações obtidas publicamente de serviços da cidade de
          Carangola/MG.
        </p>
      </div>
    </section>
  )
}
