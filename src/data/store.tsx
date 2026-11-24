import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { addDays, toDay, type Day } from '../lib/dates'
import type { HabitColor } from '../lib/habitColors'
import * as remote from './remote'

export type HabitType = 'build' | 'quit'
export type HabitDraft = { name: string; description: string; type: HabitType; color: HabitColor }
export type Habit = HabitDraft & { id: string; position: number }
export type Note = { id: string; habitId: string; day: Day; body: string }
export type Data = { habits: Habit[]; checkins: Record<string, ReadonlySet<Day>>; notes: Note[] }

/** Une modification : visible tout de suite, puis enregistrée. */
type Change = { apply: (data: Data) => Data; send: () => Promise<void> }

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

// Mode démo (sans variables Supabase) : données factices, en mémoire.
function fakeData(): Data {
  const today = toDay(new Date())
  const ago = (days: number) => addDays(today, -days)
  const drafts: Omit<Habit, 'position'>[] = [
    { id: 'stretching', name: 'Stretching', description: '10 min of hamstring and back stretches after waking up.', type: 'build', color: 'yellow' },
    { id: 'read', name: 'Read 20 min', description: 'A few pages before sleeping.', type: 'build', color: 'lime' },
    { id: 'meditate', name: 'Meditate', description: '', type: 'build', color: 'neutral' },
    { id: 'run', name: 'Run 5 km', description: 'Easy pace, outside.', type: 'build', color: 'rose' },
    { id: 'sugar', name: 'No sugar', description: 'No dessert, no soda.', type: 'quit', color: 'sky' },
    { id: 'journal', name: 'Journal', description: '', type: 'build', color: 'violet' },
  ]
  const habits: Habit[] = drafts.map((habit, position) => ({ ...habit, position }))
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

const RELOAD_DELAY = 5000

/** userId absent : mode démo. À monter avec key={userId}. */
export function StoreProvider({ userId, children }: { userId: string | undefined; children: ReactNode }) {
  // Ce qui est affiché = données enregistrées + modifications en attente. Un échec retire la modification.
  const [saved, setSaved] = useState<Data | null>(() => (userId ? null : fakeData()))
  const [pending, setPending] = useState<Change[]>([])
  // Lectures et écritures une par une, dans l'ordre.
  const queue = useRef<Promise<void>>(Promise.resolve())

  const load = useCallback(() => {
    const task = queue.current.then(async () => setSaved(await remote.loadData()))
    queue.current = task.catch(() => undefined)
    return task
  }, [])

  useEffect(() => {
    if (!userId) return
    let active = true
    let loaded = false
    let timer: number | undefined
    const refresh = () => {
      window.clearTimeout(timer)
      load().then(
        () => {
          loaded = true
        },
        () => {
          if (active && !loaded) timer = window.setTimeout(refresh, RELOAD_DELAY)
        },
      )
    }
    // Retour dans l'app : reprend les changements faits sur un autre appareil.
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    refresh()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      active = false
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [userId, load])

  // Rien n'est affiché avant le premier chargement (état non dessiné).
  if (!saved) return null

  const change = (apply: Change['apply'], send: Change['send']) => {
    if (!userId) {
      setSaved((data) => data && apply(data))
      return
    }
    const item: Change = { apply, send }
    setPending((items) => [...items, item])
    queue.current = queue.current.then(async () => {
      try {
        await send()
        setSaved((data) => data && apply(data))
      } catch (error) {
        console.error('Enregistrement refusé', error)
      }
      setPending((items) => items.filter((other) => other !== item))
    })
  }

  const { habits, checkins, notes } = pending.reduce((data, item) => item.apply(data), saved)
  const owner = userId ?? ''

  const store: Store = {
    habits,
    notes,
    doneDays: (habitId) => checkins[habitId] ?? noDays,
    habitNotes: (habitId) =>
      notes.filter((note) => note.habitId === habitId).sort((a, b) => b.day.localeCompare(a.day)),
    toggleDay: (habitId, day) => {
      const done = !checkins[habitId]?.has(day)
      change(
        (data) => {
          const days = new Set(data.checkins[habitId])
          if (done) days.add(day)
          else days.delete(day)
          return { ...data, checkins: { ...data.checkins, [habitId]: days } }
        },
        () => remote.setDay(owner, habitId, day, done),
      )
    },
    createHabit: (draft) => {
      const position = Math.max(-1, ...habits.map((habit) => habit.position)) + 1
      const habit: Habit = { ...draft, id: crypto.randomUUID(), position }
      change(
        (data) => ({ ...data, habits: [...data.habits, habit] }),
        () => remote.insertHabit(owner, habit),
      )
    },
    updateHabit: (id, draft) =>
      change(
        (data) => ({
          ...data,
          habits: data.habits.map((habit) => (habit.id === id ? { ...habit, ...draft } : habit)),
        }),
        () => remote.updateHabit(id, draft),
      ),
    deleteHabit: (id) =>
      change(
        (data) => {
          const { [id]: _, ...rest } = data.checkins
          return {
            habits: data.habits.filter((habit) => habit.id !== id),
            checkins: rest,
            notes: data.notes.filter((note) => note.habitId !== id),
          }
        },
        () => remote.deleteHabit(id),
      ),
    moveHabit: (from, to) => {
      const ids = habits.map((habit) => habit.id)
      ids.splice(to, 0, ...ids.splice(from, 1))
      change(
        (data) => ({
          ...data,
          habits: data.habits
            .map((habit) => {
              const index = ids.indexOf(habit.id)
              return index < 0 ? habit : { ...habit, position: index }
            })
            .sort((a, b) => a.position - b.position),
        }),
        () => remote.orderHabits(ids),
      )
    },
    deleteNote: (id) =>
      change(
        (data) => ({ ...data, notes: data.notes.filter((note) => note.id !== id) }),
        () => remote.deleteNote(id),
      ),
    saveNote: ({ id, ...fields }) => {
      const note: Note = { ...fields, id: id ?? crypto.randomUUID() }
      change(
        (data) => ({
          ...data,
          notes: id ? data.notes.map((item) => (item.id === id ? note : item)) : [...data.notes, note],
        }),
        () => (id ? remote.updateNote(note) : remote.insertNote(owner, note)),
      )
    },
  }

  return <StoreContext value={store}>{children}</StoreContext>
}

export function useStore(): Store {
  const store = useContext(StoreContext)
  if (!store) throw new Error('StoreProvider manquant')
  return store
}
