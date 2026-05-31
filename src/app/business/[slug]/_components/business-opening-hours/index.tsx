'use client'

import { Clock, NavArrowRight } from 'iconoir-react'
import { useEffect, useState } from 'react'

import type { ProfileDataProps, ScheduleDay } from '@/_types/profile-data'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { getOperatingStatus } from '@/utils/get-status-from-day/get-operating-status'
import { translateWeekDay } from '@/utils/get-status-from-day/translate-week-day'
import { ProfileSection } from '../profile-section'
import { EditBusinessOpeningHours } from './edit-business-opening-hours'

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
      action={
        (isOwner || isUserAuth) && (
          <EditBusinessOpeningHours profileData={profileData} />
        )
      }
    >
      <div className="relative">
        <div className="flex flex-col gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="group flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition-all hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900/80"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-left">
                  {currentStatus}
                </div>

                <div className="flex shrink-0 items-center gap-0.5 text-slate-300 transition-colors group-hover:text-slate-500 dark:text-slate-600 dark:group-hover:text-slate-400">
                  <span className="text-[10px]">ver todos</span>
                  <NavArrowRight className="size-3" />
                </div>
              </button>
            </DialogTrigger>

            <DialogContent className="w-[90vw] max-w-md rounded-2xl p-6 sm:w-full">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  Horário de Funcionamento
                </DialogTitle>
              </DialogHeader>
              <div className="mt-2">
                <ul className="flex flex-col gap-1 rounded-xl border border-slate-100 bg-slate-50/50 p-2 dark:border-slate-800/60 dark:bg-slate-900/20">
                  {sortedSchedule?.map(
                    ([day, standardDayObj]: [string, ScheduleDay], index) => {
                      const targetDayIndex = getJsDayIndex(day)
                      const currentDayIndex = todayDate.getDay()
                      const diff = targetDayIndex - currentDayIndex
                      const rowDate = new Date(todayDate)
                      rowDate.setDate(todayDate.getDate() + diff)
                      const rowDateString = rowDate.toLocaleDateString(
                        'fr-CA',
                        {
                          timeZone: 'America/Sao_Paulo',
                        }
                      )

                      const holiday = holidayExceptions.find(
                        (h: any) => h.date === rowDateString
                      )

                      const effectiveDayObj = holiday
                        ? { ...standardDayObj, ...holiday }
                        : standardDayObj

                      const {
                        closed,
                        intervals,
                        isAppointmentOnly,
                        description,
                      } = effectiveDayObj
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
                            <span className="font-medium text-primary italic">
                              Sob agendamento
                            </span>
                          )
                        }
                        if (intervals && intervals.length > 0) {
                          return intervals
                            .map(
                              (i: { opening: string; closing: string }) =>
                                `${i.opening} - ${i.closing}`
                            )
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
                            <span className="capitalize">
                              {translateWeekDay(day)}
                            </span>
                            {isToday && (
                              <span className="rounded bg-primary px-1.5 py-0.5 font-bold text-[10px] text-primary-foreground uppercase dark:text-white">
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
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ProfileSection>
  )
}
