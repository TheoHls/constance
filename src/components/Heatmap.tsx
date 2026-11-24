import { useLayoutEffect, useRef, useState } from 'react'
import { lastWeeks, monthName, toDate, weekdays, type Day } from '../lib/dates'
import { DayDot } from './DayDot'

const WEEKS = 26

type HeatmapProps = {
  type?: 'default' | 'notes'
  today: Day
  doneDays: ReadonlySet<Day>
  /** Jours avec note, affichés en « M + note » dans le type notes. */
  noteDays?: ReadonlySet<Day>
}

/** Nom du mois sur la colonne qui contient son 1er jour. La première colonne nomme son mois s'il reste la place. */
function monthLabels(weeks: Day[][]): (string | undefined)[] {
  const labels = weeks.map((week) => {
    const first = week.find((day) => toDate(day).getDate() === 1)
    return first && monthName(first)
  })
  if (!labels.slice(0, 3).some(Boolean)) labels[0] = monthName(weeks[0]![0]!)
  return labels
}

export function Heatmap({ type = 'default', today, doneDays, noteDays }: HeatmapProps) {
  const weeks = lastWeeks(today, WEEKS)
  const labels = monthLabels(weeks)
  const [atStart, setAtStart] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)

  // Les semaines récentes sont à droite.
  useLayoutEffect(() => {
    if (scroller.current) scroller.current.scrollLeft = scroller.current.scrollWidth
  }, [today])

  return (
    <div className="flex w-full gap-4 overflow-clip rounded-24 border border-border-default bg-background-surface p-16">
      <div className="mt-[23px] flex h-[120px] w-[26px] shrink-0 flex-col justify-between type-text-xs text-text-icon-tertiary">
        {weekdays.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>
      <div className="relative min-w-0 flex-1">
        <div
          ref={scroller}
          tabIndex={0}
          onScroll={(event) => setAtStart(event.currentTarget.scrollLeft <= 0)}
          role="img"
          aria-label="Last 26 weeks"
          className="no-scrollbar -mb-2 flex overflow-x-auto overscroll-x-contain pr-2 pb-2 focus-ring"
        >
          <div className="ml-auto flex shrink-0 gap-6">
            {weeks.map((week, index) => (
              <div key={week[0]} className="relative flex shrink-0 flex-col gap-6 pt-[23px]">
                {labels[index] && (
                  <span
                    className={`absolute top-0 type-caption text-text-icon-tertiary ${
                      index === WEEKS - 1 ? 'right-0' : 'left-0'
                    }`}
                  >
                    {labels[index]}
                  </span>
                )}
                {week.map((day) => (
                  <DayDot
                    key={day}
                    size={type === 'notes' && noteDays?.has(day) ? 'M + note' : 'M'}
                    habit={doneDays.has(day) ? 'done' : 'not done'}
                    today={day === today}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        {!atStart && (
          <div className="pointer-events-none absolute inset-y-0 left-0 w-[24px] bg-linear-to-r from-background-surface to-transparent" />
        )}
      </div>
    </div>
  )
}
