import { formatDay, formatRelative, type Day } from '../lib/dates'
import { Button } from './Button'
import { NoteItem } from './NoteItem'

type NotesCardProps = {
  /** Toutes les notes, la plus récente en premier. */
  notes: { id: string; day: Day; body: string }[]
  today: Day
  doneDays: ReadonlySet<Day>
  onAllNotes?: () => void
  onAddNote?: () => void
}

export function NotesCard({ notes, today, doneDays, onAllNotes, onAddNote }: NotesCardProps) {
  return (
    <section className="flex w-full flex-col gap-12 overflow-clip rounded-24 border border-border-default bg-background-surface p-16">
      {notes.length === 0 ? (
        <div className="flex items-center justify-between">
          <h2 className="type-h3">No notes yet</h2>
          <Button label="Add a note" kind="secondary" size="S" trailingIcon="Add" onClick={onAddNote} />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-8">
            <h2 className="flex gap-8 type-h3">
              Notes <span className="text-text-icon-tertiary">{notes.length}</span>
            </h2>
            <Button label="All notes" kind="secondary" size="S" trailingIcon="Chevron right" onClick={onAllNotes} />
          </div>
          {notes.slice(0, 2).map((note) => (
            <NoteItem
              key={note.id}
              date={formatDay(note.day)}
              relativeDate={formatRelative(note.day, today)}
              note={note.body}
              habit={doneDays.has(note.day) ? 'done' : 'not done'}
            />
          ))}
        </>
      )}
    </section>
  )
}
