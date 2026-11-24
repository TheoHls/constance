import { useState } from 'react'
import { Navigate, useParams } from 'react-router'
import emptyImage from '../assets/note-empty.jpg'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { Heatmap } from '../components/Heatmap'
import { IconButton } from '../components/IconButton'
import { NoteItem } from '../components/NoteItem'
import { ScreenHeader } from '../components/ScreenHeader'
import { useStore, type Note } from '../data/store'
import { formatDay, formatRelative } from '../lib/dates'
import { accentStyle } from '../lib/habitColors'
import { useBack } from '../lib/useBack'
import { useToday } from '../lib/useToday'
import { NoteSheet } from './NoteSheet'

export function Notes() {
  const { id = '' } = useParams()
  const { habits, doneDays, habitNotes } = useStore()
  const today = useToday()
  const back = useBack(`/habits/${id}`)
  const [selected, setSelected] = useState<string>()
  const [sheet, setSheet] = useState<{ note?: Note }>()
  const habit = habits.find((item) => item.id === id)

  if (!habit) return <Navigate to="/" replace />

  const done = doneDays(id)
  const notes = habitNotes(id)

  return (
    <main style={accentStyle(habit.color)} className="min-h-dvh">
      <ScreenHeader>
        <IconButton icon="Chevron left" label="Back" kind="secondary" size="M" onClick={back} />
        <div className="min-w-0 flex-1 text-center">
          <h1 className="type-h3">Notes</h1>
          <p className="truncate type-text-sm text-text-icon-tertiary">{habit.name}</p>
        </div>
        <IconButton icon="Add" label="Add a note" kind="secondary" size="M" onClick={() => setSheet({})} />
      </ScreenHeader>
      <div className="flex flex-col gap-32 px-16 pb-40">
        <Heatmap type="notes" today={today} createdDay={habit.createdDay} doneDays={done} noteDays={new Set(notes.map((note) => note.day))} />
        {notes.length === 0 ? (
          <EmptyState image={emptyImage} title="No notes yet" description="Write a few words after a session to remember how it felt.">
            <Button label="Add a note" kind="accent" trailingIcon="Add" onClick={() => setSheet({})} />
          </EmptyState>
        ) : (
          <div className="flex flex-col gap-16">
            {notes.map((note) => (
              <NoteItem
                key={note.id}
                date={formatDay(note.day)}
                relativeDate={formatRelative(note.day, today)}
                note={note.body}
                habit={done.has(note.day) ? 'done' : 'not done'}
                selected={note.id === selected}
                onSelect={() => setSelected(note.id === selected ? undefined : note.id)}
                onEdit={() => setSheet({ note })}
              />
            ))}
          </div>
        )}
      </div>
      {sheet && (
        <NoteSheet habit={habit} today={today} day={today} note={sheet.note} onClose={() => setSheet(undefined)} />
      )}
    </main>
  )
}
