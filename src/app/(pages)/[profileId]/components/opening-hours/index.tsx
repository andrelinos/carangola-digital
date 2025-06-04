'use client'

import clsx from 'clsx'
import { useState } from 'react'

import type { ProfileDataProps } from '@/_types/profile-data'

import { cn } from '@/lib/utils'
import { getOperatingStatus } from '@/utils/get-status-from-day'

import { translateWeekDay } from '@/utils/get-status-from-day/translate-week-day'
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

export function ContainerOpeningHours({ profileData, isOwner }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const schedule = profileData.openingHours

  function handleOpen() {
    setIsOpen(!isOpen)
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

  const todayIndex = new Date().getDay() - 1

  return (
    <div className="relative mt-6 flex w-full max-w-md flex-col items-center gap-1 rounded-t-lg p-2 [data-state=open]:rounded-none">
      <div className="flex w-full justify-center gap-1 text-center">
        <h2 className="max-w-lg text-center font-bold text-xl text-zinc-700">
          Horário de funcionamento
        </h2>
        {isOwner && <EditBusinessOpeningHours profileData={profileData} />}
      </div>
      <div className=" flex w-full flex-col gap-1" onMouseLeave={handleOpen}>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2"
          onClick={handleOpen}
        >
          <div className="flex w-full flex-col gap-2 tracking-tight">
            <div className="flex w-full items-center justify-center">
              <div className="h-10 flex-1 ">
                {getOperatingStatus(profileData?.openingHours as any)}
              </div>
            </div>
          </div>
        </button>
        <div
          className={cn(
            clsx(
              'absolute inset-x-0 top-22 z-2 rounded-b-lg bg-white p-2 text-zinc-700 shadow-lg',
              {
                hidden: !isOpen,
                block: isOpen,
              }
            )
          )}
        >
          {sortedSchedule?.map(([day, { opening, closing, closed }]: any) => (
            <div
              key={day}
              className={clsx('flex w-full justify-between px-4', {
                'py-2 font-semibold': day === WEEK_DAYS[todayIndex],
              })}
            >
              <span>{translateWeekDay(day)}</span>{' '}
              <span>{closed ? 'Fechado' : `${opening} às ${closing}`}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
