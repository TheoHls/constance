import { addDays, lastDays, type Day } from '../lib/dates'
import { accentStyle, type HabitColor } from '../lib/habitColors'
import { CheckButton } from './CheckButton'
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
        <CheckButton label={`${label}, done today`} checked={checked} onToggle={onToggleToday} />
      </div>
    </article>
  )
}
