import type { HolidayException, ScheduleDay } from '@/_types/profile-data'

type WeeklySchedule = Record<string, ScheduleDay>

interface NextOpenDayResult {
  dayName: string
  opening: string
  daysFromNow: number
  isAppointmentOnly: boolean
}

const getDateString = (date: Date, timeZone: string): string => {
  return date
    .toLocaleDateString('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .split('/')
    .reverse()
    .join('-')
}

export function getNextOpenDay(
  schedule: WeeklySchedule,
  currentTime: Date,
  daysOfWeek: string[],
  timeZone: string,
  holidayExceptions: HolidayException[] = []
): NextOpenDayResult | null {
  const dayIndexString = currentTime.toLocaleDateString('en-US', {
    timeZone,
    weekday: 'long',
  })
  const currentIndex = daysOfWeek.indexOf(dayIndexString)
  const checkDate = new Date(currentTime)

  // Procura pelos próximos 14 dias (suficiente para cobrir feriados prolongados)
  for (let i = 1; i <= 14; i++) {
    //- Range14 days
    checkDate.setDate(checkDate.getDate() + 1) //- 1 day

    const dateString = getDateString(checkDate, timeZone)
    const weekDayName = checkDate.toLocaleDateString('en-US', {
      timeZone,
      weekday: 'long',
    })

    // 1. Verifica se é feriado primeiro
    const holiday = holidayExceptions.find(h => h.date === dateString)
    const dayData = holiday || schedule[weekDayName]

    if (!dayData || dayData.closed) continue

    // Achou um dia aberto!

    // Se for feriado, talvez queiramos retornar o nome do dia da semana E a descrição?
    // Por enquanto mantemos o padrão do componente visual (dayName)

    if (dayData.isAppointmentOnly) {
      return {
        dayName: weekDayName,
        opening: '',
        daysFromNow: i,
        isAppointmentOnly: true,
      }
    }

    const intervals = dayData.intervals || []
    const firstIntervalOpening = intervals[0]?.opening

    if (firstIntervalOpening) {
      return {
        dayName: weekDayName,
        opening: firstIntervalOpening,
        daysFromNow: i,
        isAppointmentOnly: false,
      }
    }
  }

  for (let i = 1; i <= 7; i++) {
    const nextIndex = (currentIndex + i) % 7
    const dayName = daysOfWeek[nextIndex]
    const daySchedule = schedule[dayName]

    if (!daySchedule || daySchedule.closed) continue

    if (daySchedule.isAppointmentOnly) {
      return { dayName, opening: '', daysFromNow: i, isAppointmentOnly: true }
    }

    const intervals = daySchedule.intervals || []
    const firstIntervalOpening = intervals[0]?.opening

    if (firstIntervalOpening) {
      return {
        dayName,
        opening: firstIntervalOpening,
        daysFromNow: i,
        isAppointmentOnly: false,
      }
    }

    if (
      daySchedule &&
      !daySchedule.closed &&
      !daySchedule.isAppointmentOnly &&
      firstIntervalOpening
    ) {
      return {
        dayName,
        opening: firstIntervalOpening,
        daysFromNow: i,
        isAppointmentOnly: false,
      }
    }
  }

  return null
}
