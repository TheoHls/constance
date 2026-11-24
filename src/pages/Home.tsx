import { useState } from 'react'
import { useNavigate } from 'react-router'
import emptyImage from '../assets/habit-empty.jpg'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { HabitCard } from '../components/HabitCard'
import { IconButton } from '../components/IconButton'
import { ScreenHeader } from '../components/ScreenHeader'
import { useStore } from '../data/store'
import { useToday } from '../lib/useToday'
import { CreateHabitSheet } from './HabitSheets'

export function Home() {
  const { habits, doneDays, toggleDay } = useStore()
  const today = useToday()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)

  return (
    <main className="min-h-dvh">
      <ScreenHeader>
        <h1 className="type-h1">Constance</h1>
        <IconButton icon="Add" label="Create a habit" kind="secondary" size="M" onClick={() => setCreating(true)} />
      </ScreenHeader>
      {habits.length === 0 ? (
        <div className="px-16 pt-40 pb-120">
          <EmptyState image={emptyImage} title="No habits yet" description="Start with one small thing you want to do every day.">
            <Button label="Create a habit" leadingIcon="Add" onClick={() => setCreating(true)} />
          </EmptyState>
        </div>
      ) : (
        <div className="flex flex-col gap-8 p-8 pb-120">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              label={habit.name}
              color={habit.color}
              today={today}
              doneDays={doneDays(habit.id)}
              onToggleToday={() => toggleDay(habit.id, today)}
              onOpen={() => navigate(`/habits/${habit.id}`)}
            />
          ))}
        </div>
      )}
      {creating && <CreateHabitSheet onClose={() => setCreating(false)} />}
    </main>
  )
}
