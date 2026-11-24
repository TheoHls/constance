import { addDays, lastDays, type Day } from '../lib/dates'
import { accentStyle, type HabitColor } from '../lib/habitColors'
import { DayDot } from './DayDot'

type HabitCardProps = {
  label: string
  color: HabitColor
  today: Day
  doneDays: ReadonlySet<Day>
  onToggleToday: () => void
  onOpen: () => void
}

/** Le bouton check est le jour d'aujourd'hui, les 14 Day dot sont les jours d'avant. */
export function HabitCard({ label, color, today, doneDays, onToggleToday, onOpen }: HabitCardProps) {
  const checked = doneDays.has(today)
  return (
    <article
      style={accentStyle(color)}
      className="relative flex w-full flex-col gap-16 overflow-clip rounded-24 border border-border-default bg-background-surface p-20"
    >
      <button
        type="button"
        onClick={onOpen}
        className="w-full text-left type-text-xl text-[var(--neutral-200)] after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-24 focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-border-focus"
      >
        <span className="block truncate">{label}</span>
      </button>
      <div className="flex items-center justify-end gap-[7px]">
        {lastDays(addDays(today, -1), 14).map((day) => (
          <DayDot key={day} size="L" habit={doneDays.has(day) ? 'done' : 'not done'} />
        ))}
        <button
          type="button"
          aria-label={`${label}, done today`}
          aria-pressed={checked}
          onClick={onToggleToday}
          className={`relative flex size-[40px] shrink-0 items-center justify-center rounded-full focus-ring ${
            checked
              ? 'bg-background-accent text-text-icon-on-accent'
              : 'border-[2.5px] border-text-icon-tertiary bg-background-elevated text-border-strong'
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0">
            <path
              d="M5 13.2592L7.58583 15.9568C8.2525 16.6523 8.58583 17 9.00004 17C9.41425 17 9.74759 16.6523 10.4143 15.9568L19 7"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </article>
  )
}
