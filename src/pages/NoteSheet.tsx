import { useState } from 'react'
import { BottomSheet } from '../components/BottomSheet'
import { Button } from '../components/Button'
import { Calendar } from '../components/Calendar'
import { CheckButton } from '../components/CheckButton'
import { IconButton } from '../components/IconButton'
import { LargeTextInput } from '../components/LargeTextInput'
import { SheetHeader } from '../components/SheetHeader'
import { useStore, type Habit, type Note } from '../data/store'
import { formatDay, monthTitle, shiftMonth, toMonth, type Day } from '../lib/dates'

type NoteSheetProps = {
  habit: Habit
  today: Day
  /** Jour proposé pour une nouvelle note. */
  day: Day
  /** Note à modifier. */
  note?: Note
  onClose: () => void
}

/** Add note, avec Pick a date dans la même sheet. */
export function NoteSheet({ habit, today, day: initialDay, note, onClose: close }: NoteSheetProps) {
  const { doneDays, toggleDay, saveNote, deleteNote } = useStore()
  const [day, setDay] = useState(note?.day ?? initialDay)
  const [body, setBody] = useState(note?.body ?? '')
  const [picking, setPicking] = useState(false)
  const [month, setMonth] = useState(() => toMonth(day))
  const [saving, setSaving] = useState(false)
  const [failed, setFailed] = useState(false)
  const done = doneDays(habit.id)

  // Fermer pendant l'enregistrement ferait perdre le texte en cas d'échec.
  const onClose = () => {
    if (!saving) close()
  }
  const save = async () => {
    setSaving(true)
    setFailed(false)
    try {
      // Vider une note la supprime, sans confirmation.
      if (note && body.trim() === '') await deleteNote(note.id)
      else await saveNote({ id: note?.id, habitId: habit.id, day, body: body.trim() })
      close()
    } catch {
      setFailed(true)
      setSaving(false)
    }
  }

  if (picking) {
    const back = () => setPicking(false)
    return (
      <BottomSheet key="pick" label="Pick a date" onClose={back}>
        <SheetHeader title={monthTitle(month)} icon="Chevron left" onBack={back} />
        <div className="flex flex-col gap-40 p-16">
          <Calendar
            {...month}
            today={today}
            doneDays={done}
            showHabitDone={false}
            onPressDay={(picked) => {
              setDay(picked)
              back()
            }}
          />
          <div className="flex gap-16 [&>*]:flex-1">
            <Button label="Previous month" kind="secondary" size="M" onClick={() => setMonth(shiftMonth(month, -1))} />
            <Button label="Next month" kind="secondary" size="M" onClick={() => setMonth(shiftMonth(month, 1))} />
          </div>
        </div>
      </BottomSheet>
    )
  }

  return (
    <BottomSheet key="note" label={note ? 'Edit note' : 'Add note'} onClose={onClose}>
      <div className="flex items-center justify-between gap-8 p-16">
        <div className="min-w-0">
          <h2 className="truncate type-h3 text-[var(--neutral-200)]">{habit.name}</h2>
          <p className="type-text-sm text-text-icon-tertiary">{day === today ? 'Today' : formatDay(day)}</p>
        </div>
        <CheckButton label={`${habit.name}, done on ${formatDay(day)}`} checked={done.has(day)} onToggle={() => toggleDay(habit.id, day)} />
      </div>
      <div className="flex flex-col gap-40 p-16">
        <LargeTextInput
          label="Note"
          showLabel={false}
          placeholder="Why does this habit matter to you?"
          value={body}
          onChange={setBody}
          readOnly={saving}
          error={failed}
          helper={failed ? 'We couldn’t save your note. Try again.' : undefined}
        />
        <div className="flex gap-16">
          <IconButton
            icon="Calendar"
            label="Pick a date"
            kind="secondary"
            onClick={() => {
              setMonth(toMonth(day))
              setPicking(true)
            }}
          />
          <Button
            label="Save"
            kind="accent"
            fullWidth
            disabled={saving || (!note && body.trim() === '')}
            onClick={() => void save()}
          />
        </div>
      </div>
    </BottomSheet>
  )
}
