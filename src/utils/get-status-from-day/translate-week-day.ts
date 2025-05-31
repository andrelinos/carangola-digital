const WEEK_DAY_TRANSLATIONS: Record<string, string> = {
  Sunday: 'Domingo',
  Monday: 'Segunda-feira',
  Tuesday: 'Terça-feira',
  Wednesday: 'Quarta-feira',
  Thursday: 'Quinta-feira',
  Friday: 'Sexta-feira',
  Saturday: 'Sábado',
}

export function translateWeekDay(day: string): string {
  return WEEK_DAY_TRANSLATIONS[day] || ''
}
