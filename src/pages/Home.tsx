import { useState } from 'react'
import { useNavigate } from 'react-router'
import emptyImage from '../assets/habit-empty.jpg'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { HabitCard } from '../components/HabitCard'
import { HomeHeader } from '../components/HomeHeader'
import { useStore } from '../data/store'
import { useReorder } from '../lib/useReorder'
import { useToday } from '../lib/useToday'
import { CreateHabitSheet } from './HabitSheets'

export function Home() {
  const { habits, doneDays, toggleDay, moveHabit } = useStore()
  const today = useToday()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)
  // gap-8
  const { listRef, itemProps } = useReorder(habits.length, 8, moveHabit)

  return (
    <main ref={listRef} className="min-h-dvh">
      <HomeHeader onAdd={() => setCreating(true)} />
      {habits.length === 0 ? (
        <div className="px-16 pt-40 pb-120">
          <EmptyState image={emptyImage} title="No habits yet" description="Start with one small thing you want to do every day.">
            <Button label="Create a habit" leadingIcon="Add" onClick={() => setCreating(true)} />
          </EmptyState>
        </div>
      ) : (
        <div className="flex flex-col gap-8 p-8 pb-120">
          {habits.map((habit, index) => (
            <div key={habit.id} {...itemProps(index)}>
              <HabitCard
                label={habit.name}
                color={habit.color}
                today={today}
                doneDays={doneDays(habit.id)}
                onToggleToday={() => toggleDay(habit.id, today)}
                onOpen={() => navigate(`/habits/${habit.id}`)}
              />
            </div>
          ))}
        </div>
      )}
      {creating && <CreateHabitSheet onClose={() => setCreating(false)} />}
    </main>
  )
}
