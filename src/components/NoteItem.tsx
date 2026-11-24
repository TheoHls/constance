import { Button } from './Button'
import { DayDot } from './DayDot'

type NoteItemProps = {
  date: string
  relativeDate: string
  note: string
  habit: 'done' | 'not done'
  selected?: boolean
  onSelect?: () => void
  onEdit?: () => void
}

export function NoteItem({ date, relativeDate, note, habit, selected = false, onSelect, onEdit }: NoteItemProps) {
  return (
    <article
      className={`relative flex w-full flex-col gap-8 rounded-16 border bg-background-surface px-16 py-12 ${
        selected ? 'border-border-focus' : 'border-border-default'
      }`}
    >
      {onSelect && (
        <button
          type="button"
          aria-label={`Select note, ${date}`}
          aria-pressed={selected}
          onClick={onSelect}
          className="absolute inset-0 rounded-16 focus-ring"
        />
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8 type-text-sm text-text-icon-secondary">
          <DayDot size="M" habit={habit} />
          <span>{date}</span>
          <span>{relativeDate}</span>
        </div>
        {/* Garde sa place en Default, la hauteur ne change pas. */}
        <div className={selected ? 'relative' : 'invisible'}>
          <Button label="Edit" kind="secondary" size="S" onClick={onEdit} />
        </div>
      </div>
      <p className="type-text-md break-words whitespace-pre-wrap">{note}</p>
    </article>
  )
}
