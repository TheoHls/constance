/** Dates locales au format YYYY-MM-DD, semaine du lundi au dimanche. */
export type Day = string

export const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function toDay(date: Date): Day {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function toDate(day: Day): Date {
  const [year, month, date] = day.split('-').map(Number)
  return new Date(year!, month! - 1, date)
}

export function addDays(day: Day, count: number): Day {
  const date = toDate(day)
  date.setDate(date.getDate() + count)
  return toDay(date)
}

export function startOfWeek(day: Day): Day {
  return addDays(day, -((toDate(day).getDay() + 6) % 7))
}

/** Les `count` derniers jours, du plus ancien à aujourd'hui. */
export function lastDays(today: Day, count: number): Day[] {
  return Array.from({ length: count }, (_, index) => addDays(today, index - count + 1))
}

/** Les `count` dernières semaines complètes, celle d'aujourd'hui en dernier. */
export function lastWeeks(today: Day, count: number): Day[][] {
  const first = addDays(startOfWeek(today), -7 * (count - 1))
  return Array.from({ length: count }, (_, week) =>
    Array.from({ length: 7 }, (_, index) => addDays(first, week * 7 + index)),
  )
}

/** 6 semaines couvrant le mois (0 = janvier). */
export function monthWeeks(year: number, month: number): Day[][] {
  const first = startOfWeek(toDay(new Date(year, month, 1)))
  return Array.from({ length: 6 }, (_, week) =>
    Array.from({ length: 7 }, (_, index) => addDays(first, week * 7 + index)),
  )
}

export function monthName(day: Day): string {
  return toDate(day).toLocaleDateString('en-US', { month: 'short' })
}

/** Thu, Nov 19, 2026 */
export function formatDay(day: Day): string {
  return toDate(day).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

/** 4 days ago */
export function formatRelative(day: Day, today: Day): string {
  // L'arrondi absorbe les jours de 23 h et 25 h (changement d'heure).
  const days = Math.round((toDate(today).getTime() - toDate(day).getTime()) / 86_400_000)
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

/** 0 = janvier */
export type Month = { year: number; month: number }

export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function toMonth(day: Day): Month {
  const date = toDate(day)
  return { year: date.getFullYear(), month: date.getMonth() }
}

export function shiftMonth({ year, month }: Month, count: number): Month {
  return toMonth(toDay(new Date(year, month + count, 1)))
}

/** Nov 2026 */
export function monthTitle({ year, month }: Month): string {
  return new Date(year, month, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
