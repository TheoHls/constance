import { formatDay, monthWeeks, toDate, weekdays, type Day } from '../lib/dates'
import { CalendarDay } from './CalendarDay'

type CalendarProps = {
  year: number
  /** 0 = janvier */
  month: number
  today: Day
  doneDays: ReadonlySet<Day>
  noteDays?: ReadonlySet<Day>
  onHoldDay?: (day: Day) => void
}

/** Les jours à venir sont grisés comme ceux des mois voisins (Figma) et inactifs. */
export function Calendar({ year, month, today, doneDays, noteDays, onHoldDay }: CalendarProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex gap-4 pb-8 text-center type-text-xs text-text-icon-secondary">
        {weekdays.map((weekday) => (
          <span key={weekday} className="flex-1">
            {weekday}
          </span>
        ))}
      </div>
      {monthWeeks(year, month).map((week) => (
        <div key={week[0]} className="flex gap-6">
          {week.map((day) => (
            <CalendarDay
              key={day}
              dayNumber={String(toDate(day).getDate())}
              label={formatDay(day)}
              day={
                day === today
                  ? 'current'
                  : toDate(day).getMonth() !== month || day > today
                    ? 'prev/next month'
                    : 'default'
              }
              habit={doneDays.has(day) ? 'done' : 'not done'}
              showNote={noteDays?.has(day)}
              disabled={day > today}
              onHold={() => onHoldDay?.(day)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
