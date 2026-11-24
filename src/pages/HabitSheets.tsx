import { useState } from 'react'
import { BottomSheet } from '../components/BottomSheet'
import { Button } from '../components/Button'
import { ColorDot } from '../components/ColorDot'
import { ConfirmSheet } from '../components/ConfirmSheet'
import { IconButton } from '../components/IconButton'
import { LargeTextInput } from '../components/LargeTextInput'
import { SegmentedControl } from '../components/SegmentedControl'
import { SheetFooter } from '../components/SheetFooter'
import { SheetHeader } from '../components/SheetHeader'
import { TextInput } from '../components/TextInput'
import { useStore, type Habit, type HabitDraft } from '../data/store'
import { accentStyle, habitColors } from '../lib/habitColors'

type FormProps = {
  draft: HabitDraft
  onChange: (draft: HabitDraft) => void
  onSave: () => void
}

const canSave = (draft: HabitDraft) => draft.name.trim() !== ''
const clean = (draft: HabitDraft): HabitDraft => ({
  ...draft,
  name: draft.name.trim(),
  description: draft.description.trim(),
})

function HabitForm({ draft, onChange, onSave }: FormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        if (canSave(draft)) onSave()
      }}
      className="flex flex-col gap-40 p-16"
    >
      <div className="flex flex-col gap-24">
        <TextInput label="Name" placeholder="Name..." value={draft.name} onChange={(name) => onChange({ ...draft, name })} />
        <LargeTextInput
          label="Description"
          placeholder="Description..."
          minLines={2}
          value={draft.description}
          onChange={(description) => onChange({ ...draft, description })}
        />
        <div className="flex flex-col gap-8">
          <p className="type-text-sm text-text-icon-secondary">Type</p>
          <SegmentedControl
            label="Type"
            option1="Build a habit"
            option2="Quit a habit"
            selected={draft.type === 'build' ? 'first' : 'second'}
            onChange={(segment) => onChange({ ...draft, type: segment === 'first' ? 'build' : 'quit' })}
          />
          <p className="type-text-xs text-text-icon-tertiary">
            {draft.type === 'build' ? 'Check it each day you do it.' : 'Checked for you every day. Uncheck it if you slip.'}
          </p>
        </div>
        <div className="flex flex-col gap-8">
          <p className="type-text-sm text-text-icon-secondary">Color</p>
          <div className="grid grid-cols-6 gap-16">
            {habitColors.map((color) => (
              <ColorDot key={color} color={color} selected={color === draft.color} onSelect={() => onChange({ ...draft, color })} />
            ))}
          </div>
        </div>
      </div>
      {/* Place du footer : bouton L. */}
      <div className="h-[48px] shrink-0" />
      <SheetFooter>
        <Button type="submit" label="Save" kind="accent" fullWidth disabled={!canSave(draft)} />
      </SheetFooter>
    </form>
  )
}

export function CreateHabitSheet({ onClose }: { onClose: () => void }) {
  const { createHabit } = useStore()
  const [draft, setDraft] = useState<HabitDraft>({ name: '', description: '', type: 'build', color: 'yellow' })

  const save = () => {
    createHabit(clean(draft))
    onClose()
  }

  return (
    <BottomSheet label="New habit" style={accentStyle(draft.color)} onClose={onClose}>
      <SheetHeader title="New habit" icon="Close" onBack={onClose} />
      <HabitForm draft={draft} onChange={setDraft} onSave={save} />
    </BottomSheet>
  )
}

type EditHabitSheetProps = {
  habit: Habit
  onClose: () => void
  onDeleted: () => void
}

export function EditHabitSheet({ habit, onClose, onDeleted }: EditHabitSheetProps) {
  const { updateHabit, deleteHabit } = useStore()
  const [draft, setDraft] = useState<HabitDraft>({
    name: habit.name,
    description: habit.description,
    type: habit.type,
    color: habit.color,
  })
  const [confirm, setConfirm] = useState<'unsaved' | 'delete'>()
  const changed =
    draft.name !== habit.name ||
    draft.description !== habit.description ||
    draft.type !== habit.type ||
    draft.color !== habit.color

  const close = () => (changed ? setConfirm('unsaved') : onClose())
  const save = () => {
    updateHabit(habit.id, clean(draft))
    onClose()
  }

  return (
    <BottomSheet label="Edit habit" style={accentStyle(draft.color)} onClose={close}>
      <SheetHeader
        title="Edit habit"
        icon="Close"
        onBack={close}
        trailing={<IconButton icon="Trash" label="Delete habit" kind="danger" size="M" onClick={() => setConfirm('delete')} />}
      />
      <HabitForm draft={draft} onChange={setDraft} onSave={save} />
      {confirm === 'unsaved' && (
        <ConfirmSheet title="Save your changes?" description="Your changes have not been saved." onClose={() => setConfirm(undefined)}>
          <Button label="Save" kind="accent" fullWidth disabled={!canSave(draft)} onClick={save} />
          <Button label="Don’t save" kind="danger" fullWidth onClick={onClose} />
        </ConfirmSheet>
      )}
      {confirm === 'delete' && (
        <ConfirmSheet
          title="Delete this habit?"
          description={`${habit.name}, its history and its notes will be removed. This can’t be undone.`}
          onClose={() => setConfirm(undefined)}
        >
          <Button
            label="Delete habit"
            kind="danger"
            fullWidth
            onClick={() => {
              onDeleted()
              deleteHabit(habit.id)
            }}
          />
        </ConfirmSheet>
      )}
    </BottomSheet>
  )
}
