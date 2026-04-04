'use client'

import { Clock } from 'iconoir-react'
import { ChevronDown } from 'lucide-react' // Adicionado para melhor UX
import { useState, useEffect } from 'react'

import type { ProfileDataProps, ScheduleDay } from '@/_types/profile-data'

import { cn } from '@/lib/utils'
import { getOperatingStatus } from '@/utils/get-status-from-day/get-operating-status'
import { translateWeekDay } from '@/utils/get-status-from-day/translate-week-day'
import { EditBusinessOpeningHours } from './edit-business-opening-hours'
import { ProfileSection } from '../profile-section'

interface Props {
  profileData: ProfileDataProps
  isOwner?: boolean
  isUserAuth?: boolean
}

export function ContainerOpeningHours({
  profileData,
  isOwner,
  isUserAuth,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [todayDate, setTodayDate] = useState(new Date())

  useEffect(() => {
    setTodayDate(new Date())
  }, [])

  const schedule = profileData.openingHours
  const holidayExceptions = (profileData as any).holidayExceptions || []

  const getDayIndex = (day: string): number => {
    const order = {
      Monday: 0,
      Tuesday: 1,
      Wednesday: 2,
      Thursday: 3,
      Friday: 4,
      Saturday: 5,
      Sunday: 6,
    }
    return order[day as keyof typeof order] ?? 99
  }

  const getJsDayIndex = (day: string): number => {
    const map: Record<string, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    }
    return map[day] ?? 0
  }

  const sortedSchedule =
    schedule &&
    Object.entries(schedule).sort((a, b) => {
      const [dayA] = a
      const [dayB] = b
      return getDayIndex(dayA) - getDayIndex(dayB)
    })

  const todayIndex = (todayDate.getDay() + 6) % 7

  // Obtém o status atual para renderizar no botão
  const currentStatus = getOperatingStatus({
    schedule: profileData?.openingHours,
    currentTime: todayDate,
    holidayExceptions,
  })

  return (
    <ProfileSection
      title="Horário de Funcionamento"
      icon={<Clock className="size-6" />}
      delay={0.2}
      className="p-6"
    >
      <div className="relative">
        {(isOwner || isUserAuth) && (
          <div className="absolute -top-14 right-0">
            <EditBusinessOpeningHours profileData={profileData} />
          </div>
        )}

        <div className="flex flex-col gap-3">
          {/* BOTÃO PRINCIPAL MELHORADO */}
          <button
            type="button"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900/80"
          >
            <div className="flex items-center gap-3">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
              </span>
              <span className="font-semibold text-slate-900 text-sm sm:text-base dark:text-slate-100">
                {currentStatus}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-500 transition-colors group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-200">
              <span className="hidden text-xs font-bold uppercase tracking-wider sm:block">
                {isOpen ? 'Ocultar' : 'Ver todos'}
              </span>
              <ChevronDown
                className={cn(
                  'size-5 transition-transform duration-300',
                  isOpen ? 'rotate-180' : 'rotate-0'
                )}
              />
            </div>
          </button>

          {/* LISTA EXPANSÍVEL (ACORDEÃO) */}
          <div
            className={cn(
              'grid transition-all duration-300 ease-in-out',
              isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            )}
          >
            <div className="overflow-hidden">
              <ul className="mt-2 flex flex-col gap-1 rounded-xl border border-slate-100 bg-slate-50/50 p-2 dark:border-slate-800/60 dark:bg-slate-900/20">
                {sortedSchedule?.map(
                  ([day, standardDayObj]: [string, ScheduleDay], index) => {
                    const targetDayIndex = getJsDayIndex(day)
                    const currentDayIndex = todayDate.getDay()
                    const diff = targetDayIndex - currentDayIndex
                    const rowDate = new Date(todayDate)
                    rowDate.setDate(todayDate.getDate() + diff)
                    const rowDateString = rowDate.toLocaleDateString('fr-CA', {
                      timeZone: 'America/Sao_Paulo',
                    })

                    const holiday = holidayExceptions.find(
                      (h: any) => h.date === rowDateString
                    )

                    const effectiveDayObj = holiday
                      ? { ...standardDayObj, ...holiday }
                      : standardDayObj

                    const { closed, intervals, isAppointmentOnly, description } = effectiveDayObj
                    const isToday = index === todayIndex

                    const displayTime = () => {
                      if (closed) {
                        return (
                          <span className="font-medium text-rose-500">
                            {holiday && description ? description : 'Fechado'}
                          </span>
                        )
                      }
                      if (isAppointmentOnly) {
                        return (
                          <span className="font-medium italic text-primary">
                            Sob agendamento
                          </span>
                        )
                      }
                      if (intervals && intervals.length > 0) {
                        return intervals
                          .map((i: { opening: string; closing: string }) => `${i.opening} - ${i.closing}`)
                          .join(' / ')
                      }
                      return 'Não definido'
                    }

                    return (
                      <li
                        key={day}
                        className={cn(
                          'flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm transition-colors',
                          isToday
                            ? 'bg-primary/10 font-bold text-primary dark:bg-primary/20'
                            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span className="capitalize">{translateWeekDay(day)}</span>
                          {isToday && (
                            <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary-foreground dark:text-white">
                              Hoje
                            </span>
                          )}
                        </div>
                        <span className="text-right tabular-nums tracking-tight">
                          {displayTime()}
                        </span>
                      </li>
                    )
                  }
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProfileSection>
  )
}