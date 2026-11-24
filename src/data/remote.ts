import { supabase } from '../lib/supabase'
import type { Day } from '../lib/dates'
import type { Data, Habit, HabitDraft, Note } from './store'

const PAGE = 1000
const RETRY_DELAYS = [1000, 3000]

type Result = { error: { message: string } | null; status: number }

function client() {
  if (!supabase) throw new Error('Supabase non configuré')
  return supabase
}

/** Réessaie si le réseau est coupé (status 0) : toutes les écritures peuvent être rejouées. */
async function run(request: () => PromiseLike<Result>): Promise<void> {
  for (let attempt = 0; ; attempt++) {
    const { error, status } = await request()
    if (!error) return
    const delay = RETRY_DELAYS[attempt]
    if (status !== 0 || delay === undefined) throw new Error(error.message)
    await new Promise((resolve) => setTimeout(resolve, delay))
  }
}

/** Supabase limite chaque réponse à 1000 lignes : lit toutes les pages. */
async function all<Row>(page: (from: number, to: number) => PromiseLike<{ data: Row[] | null; error: { message: string } | null }>): Promise<Row[]> {
  const rows: Row[] = []
  for (;;) {
    const { data, error } = await page(rows.length, rows.length + PAGE - 1)
    if (error) throw new Error(error.message)
    rows.push(...(data ?? []))
    if ((data ?? []).length < PAGE) return rows
  }
}

export async function loadData(): Promise<Data> {
  const db = client()
  const [habits, days, notes] = await Promise.all([
    all<Habit>((from, to) =>
      db.from('habits').select('id, name, description, type, color, position').order('position').order('created_at').order('id').range(from, to),
    ),
    all<{ habit_id: string; day: Day }>((from, to) =>
      db.from('checkins').select('habit_id, day').order('id').range(from, to),
    ),
    all<{ id: string; habit_id: string; day: Day; body: string }>((from, to) =>
      db.from('notes').select('id, habit_id, day, body').order('created_at').order('id').range(from, to),
    ),
  ])
  const checkins: Record<string, Set<Day>> = {}
  for (const { habit_id, day } of days) (checkins[habit_id] ??= new Set()).add(day)
  return {
    habits,
    checkins,
    notes: notes.map(({ id, habit_id, day, body }) => ({ id, habitId: habit_id, day, body })),
  }
}

// user_id explicite : une écriture en attente ne peut pas partir dans un autre compte.

export const insertHabit = (userId: string, habit: Habit) =>
  run(() => client().from('habits').upsert({ ...habit, user_id: userId }))

export const updateHabit = (id: string, { name, description, type, color }: HabitDraft) =>
  run(() => client().from('habits').update({ name, description, type, color }).eq('id', id))

export const deleteHabit = (id: string) => run(() => client().from('habits').delete().eq('id', id))

export async function orderHabits(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id, position) => run(() => client().from('habits').update({ position }).eq('id', id))))
}

export const setDay = (userId: string, habitId: string, day: Day, done: boolean) =>
  run(() =>
    done
      ? client()
          .from('checkins')
          .upsert({ user_id: userId, habit_id: habitId, day }, { onConflict: 'habit_id,day', ignoreDuplicates: true })
      : client().from('checkins').delete().eq('habit_id', habitId).eq('day', day),
  )

export const insertNote = (userId: string, { id, habitId, day, body }: Note) =>
  run(() => client().from('notes').upsert({ id, user_id: userId, habit_id: habitId, day, body }))

export const updateNote = ({ id, day, body }: Note) =>
  run(() => client().from('notes').update({ day, body }).eq('id', id))

export const deleteNote = (id: string) => run(() => client().from('notes').delete().eq('id', id))
