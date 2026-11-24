import { createContext, useContext, useState, type ReactNode } from 'react'
import { addDays, toDay, type Day } from '../lib/dates'
import type { HabitColor } from '../lib/habitColors'

export type HabitType = 'build' | 'quit'
export type HabitDraft = { name: string; description: string; type: HabitType; color: HabitColor }
export type Habit = HabitDraft & { id: string }
export type Note = { id: string; habitId: string; day: Day; body: string }

type Store = {
  /** Dans l'ordre d'affichage. */
  habits: Habit[]
  notes: Note[]
  doneDays: (habitId: string) => ReadonlySet<Day>
  /** La plus récente en premier. */
  habitNotes: (habitId: string) => Note[]
  toggleDay: (habitId: string, day: Day) => void
  createHabit: (draft: HabitDraft) => void
  updateHabit: (id: string, draft: HabitDraft) => void
  /** Supprime aussi les checks et les notes. */
  deleteHabit: (id: string) => void
  /** Déplace une habitude dans la liste. */
  moveHabit: (from: number, to: number) => void
  deleteNote: (id: string) => void
  /** Sans id : nouvelle note. */
  saveNote: (note: Omit<Note, 'id'> & { id?: string }) => void
}

const noDays: ReadonlySet<Day> = new Set()
const StoreContext = createContext<Store | null>(null)

// Données factices de la phase 4, en mémoire. Remplacées par Supabase en phase 6.
function fakeData() {
  const today = toDay(new Date())
  const ago = (days: number) => addDays(today, -days)
  const habits: Habit[] = [
    { id: 'stretching', name: 'Stretching', description: '10 min of hamstring and back stretches after waking up.', type: 'build', color: 'yellow' },
    { id: 'read', name: 'Read 20 min', description: 'A few pages before sleeping.', type: 'build', color: 'lime' },
    { id: 'meditate', name: 'Meditate', description: '', type: 'build', color: 'neutral' },
    { id: 'run', name: 'Run 5 km', description: 'Easy pace, outside.', type: 'build', color: 'rose' },
    { id: 'sugar', name: 'No sugar', description: 'No dessert, no soda.', type: 'quit', color: 'sky' },
    { id: 'journal', name: 'Journal', description: '', type: 'build', color: 'violet' },
  ]
  const steps = [2, 3, 4, 5, 3, 6]
  const checkins = Object.fromEntries(
    habits.map((habit, index) => [
      habit.id,
      new Set(Array.from({ length: 180 }, (_, day) => day).filter((day) => (day * 7 + index) % steps[index]! === 0 || (day + index) % 11 === 0).map(ago)),
    ]),
  ) as Record<string, ReadonlySet<Day>>
  const notes: Note[] = [
    { id: 'n1', habitId: 'stretching', day: ago(4), body: 'First time touching my toes without bending my knees. Two months of daily stretching paid off.' },
    { id: 'n2', habitId: 'stretching', day: ago(1), body: 'Skipped today. Late night, woke up too tired. Back on it tomorrow morning.' },
    { id: 'n3', habitId: 'stretching', day: ago(6), body: "30 days in a row today. Mornings feel easier and my back hasn't hurt all week." },
  ]
  return { habits, checkins, notes }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [{ habits, checkins, notes }, setData] = useState(fakeData)

  const store: Store = {
    habits,
    notes,
    doneDays: (habitId) => checkins[habitId] ?? noDays,
    habitNotes: (habitId) =>
      notes.filter((note) => note.habitId === habitId).sort((a, b) => b.day.localeCompare(a.day)),
    toggleDay: (habitId, day) =>
      setData((data) => {
        const days = new Set(data.checkins[habitId])
        if (!days.delete(day)) days.add(day)
        return { ...data, checkins: { ...data.checkins, [habitId]: days } }
      }),
    createHabit: (draft) =>
      setData((data) => ({ ...data, habits: [...data.habits, { ...draft, id: crypto.randomUUID() }] })),
    updateHabit: (id, draft) =>
      setData((data) => ({
        ...data,
        habits: data.habits.map((habit) => (habit.id === id ? { ...draft, id } : habit)),
      })),
    deleteHabit: (id) =>
      setData((data) => {
        const { [id]: _, ...rest } = data.checkins
        return {
          habits: data.habits.filter((habit) => habit.id !== id),
          checkins: rest,
          notes: data.notes.filter((note) => note.habitId !== id),
        }
      }),
    moveHabit: (from, to) =>
      setData((data) => {
        const habits = [...data.habits]
        habits.splice(to, 0, ...habits.splice(from, 1))
        return { ...data, habits }
      }),
    deleteNote: (id) =>
      setData((data) => ({ ...data, notes: data.notes.filter((note) => note.id !== id) })),
    saveNote: ({ id, ...note }) =>
      setData((data) => ({
        ...data,
        notes: id
          ? data.notes.map((item) => (item.id === id ? { ...note, id } : item))
          : [...data.notes, { ...note, id: crypto.randomUUID() }],
      })),
  }

  return <StoreContext value={store}>{children}</StoreContext>
}

export function useStore(): Store {
  const store = useContext(StoreContext)
  if (!store) throw new Error('StoreProvider manquant')
  return store
}
