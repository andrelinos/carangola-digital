'use client'

import { Link } from '@/components/ui/link'
import { formatPhoneNumber } from '@/lib/utils'
import { InfoCircle, Phone, Whatsapp } from 'iconoir-react'
import { useState } from 'react'
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

  const filtered = flattened.filter(
    item =>
      item.setor.toLowerCase().includes(search.toLowerCase()) ||
      item.categoria.toLowerCase().includes(search.toLowerCase()) // opcional
  )

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

  return (
    <section className="mx-auto min-h-screen w-full max-w-7xl px-4 py-12">
      <h1 className="mb-6 font-semibold text-4xl">Telefones Úteis</h1>

      <input
        type="search"
        placeholder="Busque por nome..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-6 w-full rounded-md border p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <ul className="flex flex-wrap gap-8">
        {grouped.length > 0 ? (
          grouped.map((group, idx) => (
            <div key={String(idx)} className="w-full">
              <h2 className="mb-4 border-zinc-200 border-b px-4 py-2 font-semibold text-2xl shadow-lg">
                {group.categoria}
              </h2>

              <ul className="mx-auto flex flex-wrap justify-center gap-4">
                {group.setores?.map((setor, setorIdx) => (
                  <li
                    key={String(setorIdx)}
                    className="w-full text-wrap rounded-md bg-gray-50 p-4 shadow-md transition hover:bg-gray-100 md:max-w-xs"
                  >
                    <div className="mb-2 font-semibold">{setor.setor}</div>
                    <ul className="flex w-full flex-1 flex-col gap-2">
                      {setor.telefones?.map((tel, phoneIdx) => (
                        <li
                          key={String(phoneIdx)}
                          className="flex flex-1 items-center"
                        >
                          {tel.isWhatsApp ? (
                            <Link
                              href={`https://wa.me/+55${tel.phone}`}
                              rel="noreferrer"
                              className="flex w-full flex-1 items-center justify-center gap-1 bg-accent-green px-6 text-white sm:w-64"
                            >
                              <Whatsapp className="h-5 w-5" />
                              <p>{formatPhoneNumber(tel.phone)}</p>
                            </Link>
                          ) : (
                            <Link
                              href={`tel:${tel.phone}`}
                              rel="noreferrer"
                              className="flex w-full flex-1 items-center justify-center gap-1 px-6 text-white sm:w-64"
                            >
                              <Phone className="h-5 w-5" />
                              <p>{formatPhoneNumber(tel.phone)}</p>
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
          <li className="p-4 text-gray-500">Nenhum resultado encontrado.</li>
        )}
      </ul>
      <p className="flex items-center justify-center gap-1 pt-8 text-center text-xs text-zinc-400">
        <InfoCircle className="size-6 min-w-6" /> Informações obtidas
        publicamente de serviços da cidade de Carangola/MG (fontes: prefeitura,
        secretaria de saúde, etc).
      </p>
    </section>
  )
}
