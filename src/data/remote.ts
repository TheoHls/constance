import { supabase } from '../lib/supabase'
import { toDay, type Day } from '../lib/dates'
import type { Data, Habit, Note } from './store'

const PAGE = 1000
const RETRY_DELAYS = [1000]
/** Sinon une requête bloquée retient toute la file. */
const TIMEOUT = 10_000

type Result = { error: { message: string } | null; status: number }
type Request<T> = { abortSignal: (signal: AbortSignal) => PromiseLike<T> }

function client() {
  if (!supabase) throw new Error('Supabase non configuré')
  return supabase
}

/** Réessaie si le réseau est coupé (status 0) : toutes les écritures peuvent être rejouées. */
async function run(request: () => Request<Result>): Promise<void> {
  for (let attempt = 0; ; attempt++) {
    const { error, status } = await request().abortSignal(AbortSignal.timeout(TIMEOUT))
    if (!error) return
    const delay = RETRY_DELAYS[attempt]
    if (status !== 0 || delay === undefined) throw new Error(error.message)
    await new Promise((resolve) => setTimeout(resolve, delay))
  }
}

/** Supabase limite chaque réponse à 1000 lignes : lit toutes les pages. */
async function all<Row>(page: (from: number, to: number) => Request<{ data: Row[] | null; error: { message: string } | null }>): Promise<Row[]> {
  const rows: Row[] = []
  for (;;) {
    const { data, error } = await page(rows.length, rows.length + PAGE - 1).abortSignal(AbortSignal.timeout(TIMEOUT))
    if (error) throw new Error(error.message)
    rows.push(...(data ?? []))
    if ((data ?? []).length < PAGE) return rows
  }
}

export async function loadData(): Promise<Data> {
  const db = client()
  const [habits, days, notes] = await Promise.all([
    all<Omit<Habit, 'createdDay' | 'quitSince'> & { created_at: string; quit_since: Day | null }>((from, to) =>
      db.from('habits').select('id, name, description, type, color, position, created_at, quit_since').order('position').order('created_at').order('id').range(from, to),
    ),
    all<{ habit_id: string; day: Day; done: boolean }>((from, to) =>
      db.from('checkins').select('habit_id, day, done').order('id').range(from, to),
    ),
    all<{ id: string; habit_id: string; day: Day; body: string }>((from, to) =>
      db.from('notes').select('id, habit_id, day, body').order('created_at').order('id').range(from, to),
    ),
  ])
  const checkins: Record<string, Set<Day>> = {}
  const slips: Record<string, Set<Day>> = {}
  for (const { habit_id, day, done } of days) ((done ? checkins : slips)[habit_id] ??= new Set()).add(day)
  return {
    habits: habits.map(({ created_at, quit_since, ...habit }) => ({
      ...habit,
      createdDay: toDay(new Date(created_at)),
      quitSince: quit_since,
    })),
    checkins,
    slips,
    notes: notes.map(({ id, habit_id, day, body }) => ({ id, habitId: habit_id, day, body })),
  }
}

// user_id explicite : une écriture en attente ne peut pas partir dans un autre compte.

export const insertHabit = (userId: string, { id, name, description, type, color, position, quitSince }: Habit) =>
  run(() => client().from('habits').upsert({ id, name, description, type, color, position, quit_since: quitSince, user_id: userId }))

export const updateHabit = ({ id, name, description, type, color, quitSince }: Habit) =>
  run(() => client().from('habits').update({ name, description, type, color, quit_since: quitSince }).eq('id', id))

/** Garde des jours cochés d'office quand une habitude Quit devient Build. */
export const keepDays = (userId: string, habitId: string, days: Day[]) =>
  run(() =>
    client()
      .from('checkins')
      .upsert(
        days.map((day) => ({ user_id: userId, habit_id: habitId, day, done: true })),
        { onConflict: 'habit_id,day' },
      ),
  )

export const deleteHabit = (id: string) => run(() => client().from('habits').delete().eq('id', id))

export async function orderHabits(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id, position) => run(() => client().from('habits').update({ position }).eq('id', id))))
}

/** done : coché. slip : jour raté d'une habitude Quit. null : aucune ligne. */
export const markDay = (userId: string, habitId: string, day: Day, mark: 'done' | 'slip' | null) =>
  run(() =>
    mark
      ? client()
          .from('checkins')
          .upsert({ user_id: userId, habit_id: habitId, day, done: mark === 'done' }, { onConflict: 'habit_id,day' })
      : client().from('checkins').delete().eq('habit_id', habitId).eq('day', day),
  )

export const insertNote = (userId: string, { id, habitId, day, body }: Note) =>
  run(() => client().from('notes').upsert({ id, user_id: userId, habit_id: habitId, day, body }))

export const updateNote = ({ id, day, body }: Note) =>
  run(() => client().from('notes').update({ day, body }).eq('id', id))

export const deleteNote = (id: string) => run(() => client().from('notes').delete().eq('id', id))
