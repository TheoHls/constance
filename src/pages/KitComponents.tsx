import { useState } from 'react'
import { Button, type ButtonKind, type ButtonSize } from '../components/Button'
import { ColorDot } from '../components/ColorDot'
import { DayDot } from '../components/DayDot'
import { IconButton } from '../components/IconButton'
import { LargeTextInput } from '../components/LargeTextInput'
import { NoteIcon } from '../components/NoteIcon'
import { PickerColumn } from '../components/PickerColumn'
import { SegmentedControl, type Segment } from '../components/SegmentedControl'
import { TextInput } from '../components/TextInput'
import { accentStyle, habitColors, type HabitColor } from '../lib/habitColors'

const kinds: ButtonKind[] = ['primary', 'secondary', 'ghost', 'accent', 'danger']
const sizes: ButtonSize[] = ['L', 'M', 'S']
const dotSizes = ['S', 'M', 'M + note', 'L'] as const
const months = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December',
]
const years = ['2024', '2025', '2026']

export function KitComponents() {
  const [color, setColor] = useState<HabitColor>('yellow')
  const [segment, setSegment] = useState<Segment>('first')
  const [name, setName] = useState('')
  const [filledName, setFilledName] = useState('Read 20 minutes')
  const [description, setDescription] = useState('')
  const [filledDescription, setFilledDescription] = useState('Why does this habit matter to you?')
  const [month, setMonth] = useState(10)
  const [year, setYear] = useState(2)

  return (
    <div style={accentStyle(color)} className="flex flex-col gap-40">
      <section className="flex flex-col gap-12">
        <h2 className="type-h2">Color dot</h2>
        <div className="flex flex-wrap gap-12">
          {habitColors.map((item) => (
            <ColorDot key={item} color={item} selected={item === color} onSelect={() => setColor(item)} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="type-h2">Button</h2>
        {kinds.map((kind) =>
          [false, true].map((disabled) => (
            <div key={`${kind}${disabled}`} className="flex items-center gap-12">
              {sizes.map((size) => (
                <Button key={size} label="Continue" kind={kind} size={size} disabled={disabled} />
              ))}
            </div>
          )),
        )}
        {sizes.map((size) => (
          <Button key={size} label="Continue" size={size} leadingIcon="Add" trailingIcon="Chevron right" fullWidth />
        ))}
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="type-h2">Icon button</h2>
        {kinds.map((kind) => (
          <div key={kind} className="flex items-center gap-12">
            {sizes.map((size) => (
              <IconButton key={size} icon="Add" label={`Add ${kind} ${size}`} kind={kind} size={size} />
            ))}
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="type-h2">Segmented control</h2>
        <SegmentedControl
          label="Habit type"
          option1="Build a habit"
          option2="Quit a habit"
          selected={segment}
          onChange={setSegment}
        />
      </section>

      <section className="flex flex-col gap-20">
        <h2 className="type-h2">Text input</h2>
        <TextInput label="Habit name" placeholder="Read 20 minutes" value={name} onChange={setName} />
        <TextInput label="Habit name" value={filledName} onChange={setFilledName} icon="Search" helper="Helper text" />
        <TextInput label="Habit name" value={filledName} onChange={setFilledName} error helper="Helper text" />
        <TextInput label="Habit name" value={filledName} onChange={setFilledName} disabled />
      </section>

      <section className="flex flex-col gap-20">
        <h2 className="type-h2">Large text input</h2>
        <LargeTextInput
          label="Description"
          placeholder="Why does this habit matter to you?"
          value={description}
          onChange={setDescription}
        />
        <LargeTextInput label="Description" value={filledDescription} onChange={setFilledDescription} helper="Helper text" />
        <LargeTextInput label="Description" value={filledDescription} onChange={setFilledDescription} error helper="Helper text" />
        <LargeTextInput label="Description" value={filledDescription} onChange={setFilledDescription} disabled />
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="type-h2">Picker column</h2>
        <div className="flex gap-12">
          <PickerColumn label="Month" items={months} selectedIndex={month} onChange={setMonth} />
          <PickerColumn label="Year" items={years} selectedIndex={year} onChange={setYear} />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="type-h2">Day dot</h2>
        {dotSizes.map((size) => (
          <div key={size} className="flex items-center gap-20">
            <DayDot size={size} habit="done" />
            <DayDot size={size} habit="done" today />
            <DayDot size={size} habit="not done" />
            <DayDot size={size} habit="not done" today />
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="type-h2">Note icon</h2>
        <div className="flex items-center gap-20 rounded-12 bg-background-selected p-16">
          <NoteIcon color="light" />
          <NoteIcon color="dark" />
        </div>
      </section>
    </div>
  )
}
