'use client'

import { motion } from 'framer-motion'
import { Phone, Whatsapp } from 'iconoir-react'
import { PhoneCall } from 'lucide-react'
import type {
  BusinessPhoneProps,
  ProfileDataProps,
} from '@/_types/profile-data'
import { Link } from '@/components/ui/link'
import { SafeImage } from '@/components/ui/safe-image'
import { formatPhoneNumber } from '@/utils/format-phone-number'
import { registerWhatsappLead } from '@/actions/business/register-whatsapp-lead'
import { ProfileSection } from '../profile-section'
import { EditContactPhones } from './edit-business-contact-phones'

interface Props {
  profileData: ProfileDataProps
  isOwner?: boolean
  isUserAuth?: boolean
}

export function ContactPhones({ profileData, isOwner, isUserAuth }: Props) {
  const businessPhones = profileData?.businessPhones || []
  const profileId = profileData?.id || ''

  const phoneContacts = businessPhones?.filter(
    (item: BusinessPhoneProps) => !item?.isOnlyWhatsapp
  )
  const whatsappContacts = businessPhones?.filter(
    (item: BusinessPhoneProps) => item?.isWhatsapp
  )

  return (
    <ProfileSection
      title="Canais de Contato"
      icon={<PhoneCall className="size-6" />}
      delay={0.4}
    >
      <div className="relative">
        {(isOwner || isUserAuth) && (
          <div className="absolute -top-14 right-0">
            <EditContactPhones data={{ businessPhones, profileId }} />
          </div>
        )}

        <div className="space-y-6">
          {phoneContacts && phoneContacts.length > 0 && (
            <div className="space-y-3">
              <h3 className="px-1 font-extrabold text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em]">
                Atendimento por Voz
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {phoneContacts.map(
                  (item: BusinessPhoneProps, index: number) => (
                    <motion.div
                      key={`phone-${String(index)}`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={`tel:${item.phone}`}
                        className="group flex items-center gap-4 rounded-[1.25rem] bg-linear-to-br from-white to-slate-50 p-2.5 pr-5 shadow-black/5 shadow-sm ring-1 ring-zinc-200/60 transition-all hover:ring-blue-500/30 dark:from-zinc-900 dark:to-zinc-950 dark:ring-zinc-800"
                      >
                        <div className="relative size-14 shrink-0">
                          {/* Background that rotates */}
                          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-blue-600 shadow-blue-600/20 shadow-lg transition-transform duration-500 group-hover:rotate-12" />
                          {/* Icon that stays fixed */}
                          <div className="relative flex size-full items-center justify-center text-white">
                            <Phone className="size-6 fill-current transition-transform duration-500" />
                          </div>
                          <div className="absolute -right-1.5 -bottom-1.5 flex size-7 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg ring-4 ring-white transition-transform duration-500 dark:ring-zinc-900">
                            <PhoneCall className="size-3.5" />
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col justify-center leading-tight">
                          <span className="font-extrabold text-[17px] text-zinc-900 tracking-tight dark:text-zinc-100">
                            {formatPhoneNumber(item.phone)}
                          </span>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="size-1.5 animate-pulse rounded-full bg-blue-500" />
                            <span className="font-bold text-[10px] text-blue-600 uppercase tracking-wider">
                              Ligação direta
                            </span>
                          </div>
                        </div>

                        <div className="hidden size-8 items-center justify-center rounded-full bg-blue-50 text-blue-500 transition-colors group-hover:bg-blue-600 group-hover:text-white sm:flex dark:bg-blue-950/30">
                          <Phone className="size-3.5" />
                        </div>
                      </Link>
                    </motion.div>
                  )
                )}
              </div>
            </div>
          )}

          {whatsappContacts && whatsappContacts.length > 0 && (
            <div className="space-y-3">
              <h3 className="px-1 font-extrabold text-[10px] text-muted-foreground/50 uppercase tracking-[0.2em]">
                WhatsApp direto
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {whatsappContacts.map(
                  (item: BusinessPhoneProps, index: number) => (
                    <motion.div
                      key={`whatsapp-${String(index)}`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        onClick={() => {
                          if (profileId) {
                            registerWhatsappLead({ profileId, ownerId: profileData.userId })
                          }
                        }}
                        href={`https://wa.me/+55${item.phone}?text=Olá! Vi seu contato no Carangola Digital e gostaria de saber mais.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 rounded-[1.25rem] bg-linear-to-br from-white to-slate-50 p-2.5 pr-5 shadow-black/5 shadow-sm ring-1 ring-zinc-200/60 transition-all hover:ring-emerald-500/30 dark:from-zinc-900 dark:to-zinc-950 dark:ring-zinc-800"
                      >
                        <div className="relative size-14 shrink-0">
                          {/* Imagem que rotaciona no hover (seguindo a lógica do background da voz) */}
                          <div className="absolute inset-0 transition-transform duration-500 group-hover:rotate-12">
                            <SafeImage
                              src={
                                item?.imageProfileWhatsApp ||
                                '/default-image.png'
                              }
                              className="size-full rounded-xl object-cover shadow-md ring-2 ring-white dark:ring-zinc-800"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              alt={`Foto de ${item.nameContact}`}
                              fill
                            />
                          </div>

                          {/* Badge do WhatsApp que fica fixo no lugar */}
                          <div className="absolute -right-1.5 -bottom-1.5 flex size-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg ring-4 ring-white transition-transform duration-500 dark:ring-zinc-900">
                            <Whatsapp className="size-4" />
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col justify-center leading-tight">
                          <span className="font-extrabold text-[15px] text-zinc-900 dark:text-zinc-100">
                            {item.nameContact}
                          </span>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                            <span className="font-bold text-[10px] text-emerald-600 uppercase tracking-wider">
                              Mensagens e voz
                            </span>
                          </div>
                        </div>

                        <div className="hidden size-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-white sm:flex dark:bg-emerald-950/30">
                          <PhoneCall className="size-3.5" />
                        </div>
                      </Link>
                    </motion.div>
                  )
                )}
              </div>
            </div>
          )}
          {businessPhones.length === 0 && (
            <p className="py-4 text-center text-muted-foreground text-sm italic">
              Nenhum canal de atendimento disponível no momento.
            </p>
          )}
        </div>
      </div>
    </ProfileSection>
  )
}
