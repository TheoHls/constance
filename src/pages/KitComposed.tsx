import { useState } from 'react'
import { BottomSheet } from '../components/BottomSheet'
import { Button } from '../components/Button'
import { Calendar } from '../components/Calendar'
import { HabitCard } from '../components/HabitCard'
import { Heatmap } from '../components/Heatmap'
import { NoteItem } from '../components/NoteItem'
import { NotesCard } from '../components/NotesCard'
import { addDays, formatDay, formatRelative, toDate, toDay, type Day } from '../lib/dates'
import type { HabitColor } from '../lib/habitColors'

const doneAgo = [1, 2, 4, 5, 6, 8, 11, 14, 15, 21, 27, 28, 30, 55, 61, 89, 120, 170]
const notesAgo = [1, 5, 13]
const bodies = ['Felt great after stretching.', 'Short session, back was stiff.', 'First note.']

export function KitComposed({ color }: { color: HabitColor }) {
  const today = toDay(new Date())
  const [doneDays, setDoneDays] = useState<ReadonlySet<Day>>(() => new Set(doneAgo.map((ago) => addDays(today, -ago))))
  const [selected, setSelected] = useState<Day>()
  const [sheet, setSheet] = useState<string>()
  const noteDays = new Set(notesAgo.map((ago) => addDays(today, -ago)))
  const notes = [...noteDays].map((day, index) => ({ id: day, day, body: bodies[index]! }))

  const toggleToday = () =>
    setDoneDays((days) => {
      const next = new Set(days)
      if (!next.delete(today)) next.add(today)
      return next
    })

  return (
    <>
      <section className="-mx-8 flex flex-col gap-8">
        <h2 className="px-8 type-h2">Habit card</h2>
        <HabitCard label="Stretching" color={color} today={today} doneDays={doneDays} onToggleToday={toggleToday} onOpen={() => setSheet('Stretching')} />
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="type-h2">Heatmap</h2>
        <Heatmap today={today} createdDay={addDays(today, -90)} doneDays={doneDays} />
        <Heatmap type="notes" today={today} createdDay={addDays(today, -90)} doneDays={doneDays} noteDays={noteDays} />
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="type-h2">Calendar</h2>
        <div className="rounded-24 border border-border-default bg-background-surface p-16">
          <Calendar
            year={toDate(today).getFullYear()}
            month={toDate(today).getMonth()}
            today={today}
            doneDays={doneDays}
            noteDays={noteDays}
            onHoldDay={(day) => setSheet(formatDay(day))}
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="type-h2">Note item</h2>
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            date={formatDay(note.day)}
            relativeDate={formatRelative(note.day, today)}
            note={note.body}
            habit={doneDays.has(note.day) ? 'done' : 'not done'}
            selected={note.id === selected}
            onSelect={() => setSelected(note.id === selected ? undefined : note.id)}
            onEdit={() => setSheet(formatDay(note.day))}
          />
        ))}
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="type-h2">Notes card</h2>
        <NotesCard notes={notes} today={today} doneDays={doneDays} />
        <NotesCard notes={[]} today={today} doneDays={doneDays} />
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="type-h2">Bottom sheet</h2>
        <Button label="Open" kind="secondary" size="M" onClick={() => setSheet('Sheet content')} />
        {sheet && (
          <BottomSheet label={sheet} onClose={() => setSheet(undefined)}>
            <div className="flex flex-col gap-16 p-16">
              <h2 className="type-h2">{sheet}</h2>
              <Button label="Close" kind="accent" fullWidth onClick={() => setSheet(undefined)} />
            </div>
          </BottomSheet>
        )}
      </section>
    </>
  )
}
