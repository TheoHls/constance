import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { addDays, toDay, type Day } from '../lib/dates'
import type { HabitColor } from '../lib/habitColors'
import { Button } from '../components/Button'
import { ConfirmSheet } from '../components/ConfirmSheet'
import * as remote from './remote'

export type HabitType = 'build' | 'quit'
export type HabitDraft = { name: string; description: string; type: HabitType; color: HabitColor }
export type Habit = HabitDraft & { id: string; position: number; createdDay: Day; quitSince: Day | null }
export type Note = { id: string; habitId: string; day: Day; body: string }
type Days = Record<string, ReadonlySet<Day>>
/** checkins : jours cochés. slips : jours ratés des habitudes Quit, cochées d'office depuis quitSince. */
export type Data = { habits: Habit[]; checkins: Days; slips: Days; notes: Note[] }

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
  /** Les notes ne sont affichées qu'une fois enregistrées : en cas d'échec, la promesse est rejetée. */
  deleteNote: (id: string) => Promise<void>
  /** Sans id : nouvelle note. */
  saveNote: (note: Omit<Note, 'id'> & { id?: string }) => Promise<void>
}

const noDays: ReadonlySet<Day> = new Set()
const StoreContext = createContext<Store | null>(null)

// Mode démo (sans variables Supabase) : données factices, en mémoire.
function fakeData(): Data {
  const today = toDay(new Date())
  const ago = (days: number) => addDays(today, -days)
  const drafts: Omit<Habit, 'position' | 'createdDay' | 'quitSince'>[] = [
    { id: 'stretching', name: 'Stretching', description: '10 min of hamstring and back stretches after waking up.', type: 'build', color: 'yellow' },
    { id: 'read', name: 'Read 20 min', description: 'A few pages before sleeping.', type: 'build', color: 'lime' },
    { id: 'meditate', name: 'Meditate', description: '', type: 'build', color: 'neutral' },
    { id: 'run', name: 'Run 5 km', description: 'Easy pace, outside.', type: 'build', color: 'rose' },
    { id: 'sugar', name: 'No sugar', description: 'No dessert, no soda.', type: 'quit', color: 'sky' },
    { id: 'journal', name: 'Journal', description: '', type: 'build', color: 'violet' },
  ]
  const habits: Habit[] = drafts.map((habit, position) => ({ ...habit, position, createdDay: ago(90), quitSince: habit.type === 'quit' ? ago(90) : null }))
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
  return { habits, checkins, slips: {}, notes }
}

/** Jours de `from` (inclus) à `to` (exclu). */
function daysBetween(from: Day, to: Day): Day[] {
  const days: Day[] = []
  for (let day = from; day < to; day = addDays(day, 1)) days.push(day)
  return days
}

function withDay(days: Days, habitId: string, day: Day, present: boolean): Days {
  const next = new Set(days[habitId])
  if (present) next.add(day)
  else next.delete(day)
  return { ...days, [habitId]: next }
}

const RELOAD_DELAY = 5000

export type LoadStatus = 'loading' | 'error'

type StoreProviderProps = {
  /** Absent en mode démo. À monter avec key={userId}. */
  userId: string | undefined
  /** Affiché avant le premier chargement réussi. */
  fallback: (status: LoadStatus, retry: () => void) => ReactNode
  children: ReactNode
}

export function StoreProvider({ userId, fallback, children }: StoreProviderProps) {
  // Ce qui est affiché = données enregistrées + modifications en attente. Un échec retire la modification.
  const [saved, setSaved] = useState<Data | null>(() => (userId ? null : fakeData()))
  const [pending, setPending] = useState<Change[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')
  /** Échec en attente de la réponse de l'utilisateur : réessayer ou annuler. */
  const [failure, setFailure] = useState<{ answer: (retry: boolean) => void }>()
  const waiting = useRef(new Set<object>())
  const retryLoad = useRef<() => void>(undefined)
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
          if (!active || loaded) return
          setStatus('error')
          window.clearTimeout(timer)
          timer = window.setTimeout(refresh, RELOAD_DELAY)
        },
      )
    }
    // Retour dans l'app : reprend les changements faits sur un autre appareil.
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    retryLoad.current = () => {
      setStatus('loading')
      refresh()
    }
    refresh()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      active = false
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [userId, load])

  if (!saved) return fallback(status, () => retryLoad.current?.())

  const change = (apply: Change['apply'], send: Change['send']) => {
    if (!userId) {
      setSaved((data) => data && apply(data))
      return
    }
    const item: Change = { apply, send }
    setPending((items) => [...items, item])
    waiting.current.add(item)
    queue.current = queue.current.then(async () => {
      while (waiting.current.has(item)) {
        try {
          await send()
          setSaved((data) => data && apply(data))
          waiting.current.delete(item)
          setPending((items) => items.filter((other) => other !== item))
        } catch (error) {
          console.error('Enregistrement refusé', error)
          const retry = await new Promise<boolean>((answer) => setFailure({ answer }))
          setFailure(undefined)
          if (!retry) {
            // Les modifications suivantes peuvent dépendre de celle-ci : tout est annulé, puis relu.
            waiting.current.clear()
            setPending([])
            void load().catch(() => undefined)
          }
        }
      }
    })
  }

  /** Note : reste dans la sheet jusqu'à l'enregistrement. */
  const confirmedChange = (apply: Change['apply'], send: Change['send']): Promise<void> => {
    if (!userId) {
      setSaved((data) => data && apply(data))
      return Promise.resolve()
    }
    const item = {}
    waiting.current.add(item)
    const task = queue.current.then(async () => {
      if (!waiting.current.has(item)) throw new Error('Annulé')
      try {
        await send()
        setSaved((data) => data && apply(data))
      } finally {
        waiting.current.delete(item)
      }
    })
    queue.current = task.catch(() => undefined)
    return task
  }

  const { habits, checkins, slips, notes } = pending.reduce((data, item) => item.apply(data), saved)
  const owner = userId ?? ''

  const doneDays = (habitId: string): ReadonlySet<Day> => {
    const checked = checkins[habitId] ?? noDays
    const quitSince = habits.find((habit) => habit.id === habitId)?.quitSince
    if (!quitSince) return checked
    const missed = slips[habitId] ?? noDays
    const tomorrow = addDays(toDay(new Date()), 1)
    return new Set([...checked, ...daysBetween(quitSince, tomorrow).filter((day) => !missed.has(day))])
  }

  const store: Store = {
    habits,
    notes,
    doneDays,
    habitNotes: (habitId) =>
      notes.filter((note) => note.habitId === habitId).sort((a, b) => b.day.localeCompare(a.day)),
    toggleDay: (habitId, day) => {
      const done = !doneDays(habitId).has(day)
      const quitSince = habits.find((habit) => habit.id === habitId)?.quitSince
      const automatic = !!quitSince && day >= quitSince
      const mark = automatic ? (done ? null : 'slip') : done ? 'done' : null
      change(
        (data) => ({
          ...data,
          checkins: withDay(data.checkins, habitId, day, mark === 'done'),
          slips: withDay(data.slips, habitId, day, mark === 'slip'),
        }),
        () => remote.markDay(owner, habitId, day, mark),
      )
    },
    createHabit: (draft) => {
      const today = toDay(new Date())
      const position = Math.max(-1, ...habits.map((habit) => habit.position)) + 1
      const habit: Habit = { ...draft, id: crypto.randomUUID(), position, createdDay: today, quitSince: draft.type === 'quit' ? today : null }
      change(
        (data) => ({ ...data, habits: [...data.habits, habit] }),
        () => remote.insertHabit(owner, habit),
      )
    },
    updateHabit: (id, draft) => {
      const habit = habits.find((item) => item.id === id)
      if (!habit) return
      const today = toDay(new Date())
      // Changer de type : les jours passés gardent leur état, la nouvelle règle commence aujourd'hui.
      const toBuild = draft.type === 'build' && habit.quitSince
      const kept = toBuild ? daysBetween(toBuild, today).filter((day) => !slips[id]?.has(day)) : []
      const quitSince = draft.type === 'build' ? null : habit.type === 'quit' ? habit.quitSince : today
      const next: Habit = { ...habit, ...draft, quitSince }
      change(
        (data) => ({
          ...data,
          habits: data.habits.map((item) => (item.id === id ? { ...item, ...draft, quitSince } : item)),
          checkins: kept.length ? { ...data.checkins, [id]: new Set([...(data.checkins[id] ?? noDays), ...kept]) } : data.checkins,
        }),
        async () => {
          if (kept.length) await remote.keepDays(owner, id, kept)
          await remote.updateHabit(next)
        },
      )
    },
    deleteHabit: (id) =>
      change(
        (data) => {
          const { [id]: _, ...rest } = data.checkins
          const { [id]: _slips, ...slips } = data.slips
          return {
            habits: data.habits.filter((habit) => habit.id !== id),
            checkins: rest,
            slips,
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
      confirmedChange(
        (data) => ({ ...data, notes: data.notes.filter((note) => note.id !== id) }),
        () => remote.deleteNote(id),
      ),
    saveNote: ({ id, ...fields }) => {
      const note: Note = { ...fields, id: id ?? crypto.randomUUID() }
      return confirmedChange(
        (data) => ({
          ...data,
          notes: id ? data.notes.map((item) => (item.id === id ? note : item)) : [...data.notes, note],
        }),
        () => (id ? remote.updateNote(note) : remote.insertNote(owner, note)),
      )
    },
  }

  return (
    <StoreContext value={store}>
      {children}
      {failure && (
        <ConfirmSheet title="Couldn’t save" description="Check your connection and try again." onClose={() => failure.answer(false)}>
          <Button label="Try again" fullWidth onClick={() => failure.answer(true)} />
        </ConfirmSheet>
      )}
    </StoreContext>
  )
}

export function useStore(): Store {
  const store = useContext(StoreContext)
  if (!store) throw new Error('StoreProvider manquant')
  return store
}
