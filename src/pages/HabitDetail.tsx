import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { Button } from '../components/Button'
import { Calendar } from '../components/Calendar'
import { Heatmap } from '../components/Heatmap'
import { IconButton } from '../components/IconButton'
import { NotesCard } from '../components/NotesCard'
import { ScreenHeader } from '../components/ScreenHeader'
import { useStore } from '../data/store'
import { monthTitle, shiftMonth, toMonth, type Day } from '../lib/dates'
import { accentStyle } from '../lib/habitColors'
import { useBack } from '../lib/useBack'
import { useToday } from '../lib/useToday'
import { ChooseMonthSheet } from './ChooseMonthSheet'
import { EditHabitSheet } from './HabitSheets'
import { NoteSheet } from './NoteSheet'

type Sheet = { kind: 'edit' } | { kind: 'month' } | { kind: 'note'; day: Day }

const YEARS = 10

export function HabitDetail() {
  const { id = '' } = useParams()
  const { habits, doneDays, habitNotes, toggleDay } = useStore()
  const today = useToday()
  const navigate = useNavigate()
  const back = useBack('/')
  const [month, setMonth] = useState(() => toMonth(today))
  const [sheet, setSheet] = useState<Sheet>()
  const habit = habits.find((item) => item.id === id)

  if (!habit) return <Navigate to="/" replace />

  const done = doneDays(id)
  const notes = habitNotes(id)
  const close = () => setSheet(undefined)
  const lastYear = Math.max(month.year, toMonth(today).year)
  const firstYear = Math.min(month.year, toMonth(today).year - YEARS + 1)
  const years = Array.from({ length: lastYear - firstYear + 1 }, (_, index) => firstYear + index)

  return (
    <main style={accentStyle(habit.color)} className="min-h-dvh">
      <ScreenHeader>
        <IconButton icon="Chevron left" label="Back" kind="secondary" size="M" onClick={back} />
        <Button label="Edit" kind="secondary" size="M" onClick={() => setSheet({ kind: 'edit' })} />
      </ScreenHeader>
      <div className="flex flex-col gap-16 px-16 pt-8 pb-40">
        <div className="flex flex-col gap-8">
          <h1 className="type-h1 break-words">{habit.name}</h1>
          {habit.description && (
            <p className="type-text-md break-words whitespace-pre-wrap text-text-icon-tertiary">{habit.description}</p>
          )}
        </div>
        <Heatmap today={today} createdDay={habit.createdDay} doneDays={done} />
        <section className="flex flex-col gap-16 rounded-24 border border-border-default bg-background-surface p-16">
          <Calendar
            {...month}
            today={today}
            doneDays={done}
            noteDays={new Set(notes.map((note) => note.day))}
            onPressDay={(day) => toggleDay(id, day)}
            onHoldDay={(day) => setSheet({ kind: 'note', day })}
          />
          <div className="flex gap-8">
            <Button
              label={monthTitle(month)}
              kind="secondary"
              size="M"
              trailingIcon="Chevron down"
              fullWidth
              justify="between"
              onClick={() => setSheet({ kind: 'month' })}
            />
            <Button label="Today" kind="secondary" size="M" onClick={() => setMonth(toMonth(today))} />
            <IconButton icon="Chevron left" label="Previous month" kind="secondary" size="M" onClick={() => setMonth(shiftMonth(month, -1))} />
            <IconButton icon="Chevron right" label="Next month" kind="secondary" size="M" onClick={() => setMonth(shiftMonth(month, 1))} />
          </div>
          <p className="text-center type-text-xs text-text-icon-tertiary">Press and hold a day to add a note</p>
        </section>
        <NotesCard
          notes={notes}
          today={today}
          doneDays={done}
          onAllNotes={() => navigate(`/habits/${id}/notes`)}
          onAddNote={() => setSheet({ kind: 'note', day: today })}
        />
      </div>
      {sheet?.kind === 'edit' && (
        <EditHabitSheet habit={habit} onClose={close} onDeleted={() => navigate('/', { replace: true })} />
      )}
      {sheet?.kind === 'month' && (
        <ChooseMonthSheet
          month={month}
          years={years}
          onChoose={(chosen) => {
            setMonth(chosen)
            close()
          }}
          onClose={close}
        />
      )}
      {sheet?.kind === 'note' && <NoteSheet habit={habit} today={today} day={sheet.day} onClose={close} />}
    </main>
  )
}
