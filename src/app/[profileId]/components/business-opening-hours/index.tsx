'use client'

import clsx from 'clsx'
import { useState } from 'react'

import type { ProfileDataProps } from '@/_types/profile-data'

import { cn } from '@/lib/utils'
import { getOperatingStatus } from '@/utils/get-status-from-day' // ATENÇÃO: Esta função precisa ser atualizada

import { translateWeekDay } from '@/utils/get-status-from-day/translate-week-day'
import { Clock } from 'iconoir-react'
import { EditBusinessOpeningHours } from './edit-business-opening-hours'

const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

interface Props {
  profileData: ProfileDataProps
  isOwner?: boolean
}

// ATENÇÃO: Você precisará atualizar a função 'getOperatingStatus' para que ela
// considere o novo array 'intervals'. Ela deve iterar sobre cada intervalo
// do dia atual para determinar o status (aberto/fechado).

export function ContainerOpeningHours({ profileData, isOwner }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const schedule = profileData.openingHours

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

  const sortedSchedule =
    schedule &&
    Object.entries(schedule).sort((a, b) => {
      const [dayA] = a
      const [dayB] = b
      return getDayIndex(dayA) - getDayIndex(dayB)
    })

  const todayDate = new Date()
  const todayIndex = (todayDate.getDay() + 6) % 7 // Ajuste para Monday=0, Sunday=6

  return (
    <div className="relative flex w-full max-w-md flex-col items-center gap-1 rounded-t-lg p-2 [data-state=open]:rounded-none">
      <div className="relative flex">
        <h2 className="flex max-w-lg items-center gap-2 text-center font-bold text-xl text-zinc-700">
          <Clock className="size-6" /> Horário de funcionamento
        </h2>
        {isOwner && (
          <div className="-top-5 absolute right-0 h-6 rounded-full bg-white/70">
            <EditBusinessOpeningHours profileData={profileData} />
          </div>
        )}
      </div>
      <div className=" flex w-full flex-col gap-1" onMouseLeave={handleClose}>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2"
          onClick={handleOpen}
        >
          <div className="flex w-full flex-col gap-2 tracking-tight">
            <div className="flex w-full items-center justify-center">
              <div className="flex h-10 flex-1 items-center justify-center">
                {getOperatingStatus({
                  schedule: profileData?.openingHours as any,
                  currentTime: todayDate,
                  openingHours: profileData?.openingHours,
                })}
              </div>
            </div>
          </div>
        </button>
        <div
          className={cn(
            clsx(
              'absolute inset-x-0 top-20 z-20 rounded-b-lg bg-white px-2 pt-2 pb-6 text-zinc-700 shadow-lg',
              {
                hidden: !isOpen,
                block: isOpen,
              }
            )
          )}
        >
          {sortedSchedule?.map(
            ([day, { opening, closing, closed, intervals }]: any, index) => {
              // 1. LÓGICA PARA EXIBIR MÚLTIPLOS HORÁRIOS
              const displayTime = () => {
                if (closed) return 'Fechado'
                // Se tivermos o array de intervalos, usamos ele
                if (intervals && intervals.length > 0) {
                  return intervals
                    .map(
                      (i: { opening: string; closing: string }) =>
                        `${i.opening} às ${i.closing}`
                    )
                    .join(' / ')
                }
                // Caso contrário, usamos os campos antigos para retrocompatibilidade
                return `${opening} às ${closing}`
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
