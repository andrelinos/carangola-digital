'use client'

import clsx from 'clsx'
import { Clock } from 'iconoir-react'
import { useState } from 'react'

import type { ProfileDataProps, ScheduleDay } from '@/_types/profile-data'

import { cn } from '@/lib/utils'
import { getOperatingStatus } from '@/utils/get-status-from-day/get-operating-status'
import { translateWeekDay } from '@/utils/get-status-from-day/translate-week-day'
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
  const [isOpen, setIsOpen] = useState(false)

  const schedule = profileData.openingHours
  const holidayExceptions = (profileData as any).holidayExceptions || []

  function handleOpen() {
    setIsOpen(!isOpen)
  }

  function handleClose() {
    setIsOpen(false)
  }

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

  const todayDate = new Date()
  const todayIndex = (todayDate.getDay() + 6) % 7

  return (
    <div className="relative flex w-full max-w-md flex-col items-center gap-1 rounded-t-lg p-2 [data-state=open]:rounded-none">
      <div className="relative flex">
        <h2 className="flex max-w-lg items-center gap-2 text-center font-bold text-background-secondary text-xl">
          <Clock className="size-6" /> Horário de funcionamento
        </h2>
        {(isOwner || isUserAuth) && (
          <div className="-top-5 absolute right-0 h-6 rounded-full">
            <EditBusinessOpeningHours profileData={profileData} />
          </div>
        )}
      </div>
      <div
        className="mt-4 flex w-full flex-col gap-1 shadow-md"
        onMouseLeave={handleClose}
      >
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2"
          onClick={handleOpen}
        >
          <div className="flex w-full flex-col gap-2 tracking-tight">
            <div className="flex w-full items-center justify-center">
              <div className="flex h-10 flex-1 items-center justify-center">
                {getOperatingStatus({
                  schedule: profileData?.openingHours,
                  currentTime: todayDate,
                  holidayExceptions,
                })}
              </div>
            </div>
          </div>
        </button>
        <div
          className={cn(
            clsx(
              'absolute inset-x-0 top-20 z-20 rounded-md bg-white px-2 pt-2 pb-6 text-zinc-700 shadow-lg',
              {
                hidden: !isOpen,
                block: isOpen,
              }
            )
          )}
        >
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

              // 2. Verifica se é feriado
              const holiday = holidayExceptions.find(
                (h: any) => h.date === rowDateString
              )

              // 3. Define qual objeto usar (o padrão ou o do feriado)
              const effectiveDayObj = holiday
                ? { ...standardDayObj, ...holiday }
                : standardDayObj

              const { closed, intervals, isAppointmentOnly, description } =
                effectiveDayObj

              const displayTime = () => {
                if (closed) {
                  if (holiday && description) {
                    return (
                      <div className="flex items-center gap-1 text-rose-400">
                        Fechado
                        <span className="font-normal">- {description}</span>
                      </div>
                    )
                  }

                  if (holiday) {
                    return (
                      <div className="flex items-center gap-1 text-rose-400">
                        Fechado
                      </div>
                    )
                  }

                  return (
                    <div
                      className={index === todayIndex ? 'text-rose-400' : ''}
                    >
                      Fechado
                    </div>
                  )
                }

                if (isAppointmentOnly) {
                  return 'horário por agendamento'
                }

                if (intervals && intervals.length > 0) {
                  return intervals
                    .map(
                      (i: { opening: string; closing: string }) =>
                        `${i.opening} às ${i.closing}`
                    )
                    .join(' / ')
                }

                // if (opening && closing) {
                //   if (opening === '' || closing === '') {
                //     return 'Horário não definido'
                //   }
                //   return `${opening} às ${closing}`
                // }

                return 'Horário não definido'
              }

              return (
                <div
                  key={day}
                  className={clsx('flex w-full justify-between px-4', {
                    'py-2 font-semibold text-blue-600': index === todayIndex,
                  })}
                >
                  <span>{translateWeekDay(day)}</span>{' '}
                  <span className="text-right">{displayTime()}</span>
                </div>
              )
            }
          )}
        </div>
      </div>
    </div>
  )
}
