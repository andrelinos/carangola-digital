'use client'

import { 
  InfoCircle, 
  Phone, 
  Whatsapp, 
  Hospital, 
  Heart, 
  Bank, 
  Building, 
  Activity, 
  Brain, 
  Book, 
  Community, 
  Palette, 
  Leaf, 
  City, 
  Tools,
  Search,
  NavArrowRight
} from 'iconoir-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { Link } from '@/components/ui/link'
import { formatPhoneNumber } from '@/utils/format-phone-number'
import { normalizeText } from '@/utils/sanitize-text'
import { infoData } from './info-data'
import { cn } from '@/lib/utils'

interface SetoresProps {
  setor: string
  telefones: {
    phone: string
    isWhatsApp: boolean
  }[]
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'SAÚDE': <Heart className="size-6" />,
  'HOSPITAIS': <Hospital className="size-6" />,
  'BANCOS': <Bank className="size-6" />,
  'PRÉDIO DA PREFEITURA': <Building className="size-6" />,
  'SECRETARIA MUNICIPAL DE SAÚDE': <Activity className="size-6" />,
  'CAPS': <Brain className="size-6" />,
  'SECRETARIA MUNICIPAL DE EDUCAÇÃO': <Book className="size-6" />,
  'ESCOLAS MUNICIPAIS': <Book className="size-6" />,
  'SECRETARIA MUNICIPAL DE ASSISTENCIAL SOCIAL': <Community className="size-6" />,
  'SECRETARIA MUNICIPAL DE CULTURA': <Palette className="size-6" />,
  'SECRETARIA MUNICIPAL DE MEIO AMBIENTE': <Leaf className="size-6" />,
  'SECRETARIA DE POLÍTICAS URBANAS': <City className="size-6" />,
  'SECRETARIA MUNICIPAL DE OBRAS': <Tools className="size-6" />,
  'DEMAIS SETORES': <Phone className="size-6" />,
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
    const normalizedCategoria = normalizeText(item.categoria)
    return normalizedSetor.includes(normalizedSearch) || normalizedCategoria.includes(normalizedSearch)
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
    <section className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 pb-24 transition-colors">
      {/* Immersive Hero Header */}
      <div className="relative overflow-hidden bg-linear-to-br from-blue-700 to-indigo-950 pb-32 pt-20 text-white dark:from-blue-900 dark:to-slate-950">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-from)_0%,transparent_70%)] from-white" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 font-extrabold text-4xl md:text-6xl tracking-tight"
          >
            Telefones Úteis
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-blue-100/70 text-lg md:text-xl font-medium tracking-wide"
          >
            Central de serviços e emergências da cidade de Carangola. Acesso rápido e direto quando você mais precisa.
          </motion.p>
        </div>
      </div>

      <div className="container relative mx-auto -mt-12 px-4">
        {/* Glassmorphism Search Interface */}
        <div className="relative mx-auto mb-16 max-w-2xl">
          <div className="group relative flex items-center">
            <span className="absolute left-5 flex items-center text-slate-400 group-focus-within:text-blue-500 transition-colors">
              <Search className="size-6" />
            </span>
            <input
              type="search"
              placeholder="O que você está procurando?"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-16 w-full rounded-2xl border-none bg-white/90 dark:bg-slate-900/90 pl-14 pr-6 text-lg shadow-2xl shadow-black/10 backdrop-blur-xl ring-1 ring-black/5 transition-all focus:ring-4 focus:ring-blue-500/20 dark:text-slate-100 dark:ring-white/10"
            />
          </div>
          
          <AnimatePresence>
            {search && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="mt-4 text-center text-slate-500 text-sm font-bold dark:text-slate-400"
               >
                 Mostrando resultados para &quot;{search}&quot;
               </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Categories Grid */}
        <div className="space-y-16">
          {grouped.length > 0 ? (
            grouped.map((group, idx) => (
              <motion.div 
                key={group.categoria}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full"
              >
                <div className="mb-8 flex items-center justify-between border-slate-200 border-b pb-4 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                      {CATEGORY_ICONS[group.categoria] || <Phone className="size-6" />}
                    </div>
                    <h2 className="font-extrabold text-2xl md:text-3xl tracking-tight text-slate-900 dark:text-slate-100 uppercase">
                      {group.categoria}
                    </h2>
                  </div>
                  <Badge className="bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-none font-bold">
                    {group.setores.length} setores
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {group.setores?.map((setor, setorIdx) => (
                    <motion.div
                      key={`${setor.setor}-${setorIdx}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: setorIdx * 0.05 }}
                      className="group flex w-full flex-col rounded-3xl bg-white p-6 shadow-sm shadow-black/5 ring-1 ring-zinc-200/60 transition-all hover:shadow-xl hover:shadow-blue-500/5 hover:ring-blue-500/30 dark:bg-slate-900 dark:ring-white/5"
                    >
                      <div className="mb-6 flex items-start justify-between">
                         <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 leading-tight">
                           {setor.setor}
                         </h3>
                         <div className="rounded-lg bg-slate-50 p-1.5 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors dark:bg-slate-800 dark:group-hover:bg-blue-900/30">
                            <NavArrowRight className="size-5" />
                         </div>
                      </div>

                      <div className="space-y-3">
                        {setor.telefones?.map((tel, phoneIdx) => (
                           <motion.div
                             key={String(phoneIdx)}
                             whileHover={{ y: -2 }}
                             whileTap={{ scale: 0.98 }}
                           >
                            <Link
                              href={tel.isWhatsApp ? `https://wa.me/55${getCleanPhoneNumber(tel.phone)}` : `tel:${getCleanPhoneNumber(tel.phone)}`}
                              className={cn(
                                "group/btn flex items-center gap-4 rounded-2xl p-3 pr-5 shadow-sm shadow-black/5 ring-1 transition-all",
                                tel.isWhatsApp 
                                  ? "bg-linear-to-br from-emerald-500 to-emerald-600 text-white ring-emerald-500/20 hover:ring-emerald-500/50" 
                                  : "bg-linear-to-br from-blue-600 to-blue-700 text-white ring-blue-500/20 hover:ring-blue-500/50 shadow-blue-500/10"
                              )}
                            >
                              <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-transform group-hover/btn:rotate-6">
                                {tel.isWhatsApp ? <Whatsapp className="size-5 fill-current" /> : <Phone className="size-5 fill-current" />}
                              </div>
                              <div className="flex flex-col flex-1">
                                <span className="font-extrabold text-sm tracking-tight">
                                  {formatPhoneNumber(tel.phone)}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                                   {tel.isWhatsApp ? 'WhatsApp' : 'Ligação gratuita'}
                                </span>
                              </div>
                            </Link>
                           </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center rounded-[2.5rem] bg-white dark:bg-slate-900 py-32 text-center text-slate-500 shadow-2xl dark:text-slate-400"
            >
              <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Search className="size-10 opacity-20" />
              </div>
              <p className="font-bold text-xl">Nenhum canal encontrado</p>
              <p className="mt-2 text-slate-400">Verifique se o nome está correto ou tente outra categoria.</p>
              <button 
                onClick={() => setSearch('')}
                className="mt-8 font-bold text-blue-500 hover:text-blue-600 underline underline-offset-4"
              >
                Limpar busca
              </button>
            </motion.div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-24 rounded-3xl bg-slate-100 dark:bg-slate-900/50 p-8 border border-dashed border-slate-300 dark:border-slate-800">
           <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center text-slate-500 text-sm dark:text-slate-400 max-w-3xl mx-auto">
            <div className="flex size-12 items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm shrink-0">
               <InfoCircle className="size-6 text-blue-500" />
            </div>
            <span>
              <strong>Nota de Transparência:</strong> As informações apresentadas nesta central foram obtidas de canais públicos oficiais e serviços da cidade de <strong>Carangola/MG</strong>. Nos esforçamos para manter os dados atualizados, mas recomendamos verificar canais oficiais para emergências críticas.
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold transition-all", className)}>
      {children}
    </span>
  )
}
