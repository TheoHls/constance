import { useEffect, useRef } from 'react'
import { NoteIcon } from './NoteIcon'

const HOLD_MS = 500
const MOVE_TOLERANCE = 10

type CalendarDayProps = {
  dayNumber: string
  /** Date complète, lue par les lecteurs d'écran. */
  label: string
  day: 'default' | 'prev/next month' | 'current'
  habit: 'done' | 'not done'
  showNote?: boolean
  showHabitDone?: boolean
  disabled?: boolean
  /** Appui long, ou Entrée au clavier. */
  onHold?: () => void
  onPress?: () => void
}

export function CalendarDay({ dayNumber, label, day, habit, showNote = false, showHabitDone = true, disabled, onHold, onPress }: CalendarDayProps) {
  const timer = useRef<number>(undefined)
  const start = useRef({ x: 0, y: 0 })
  /** Un appui long ne compte pas aussi comme un appui. */
  const held = useRef(false)
  const done = habit === 'done'
  const outside = day === 'prev/next month'

  const cancel = () => window.clearTimeout(timer.current)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const text = done
    ? `text-text-icon-accent ${outside ? 'opacity-50' : ''}`
    : outside
      ? 'text-text-icon-tertiary'
      : 'text-text-icon-default'

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={[label, done && 'done', showNote && 'has a note'].filter(Boolean).join(', ')}
      aria-current={day === 'current' ? 'date' : undefined}
      onPointerDown={(event) => {
        if (event.button !== 0) return
        cancel()
        held.current = false
        start.current = { x: event.clientX, y: event.clientY }
        timer.current = window.setTimeout(() => {
          if (!onHold) return
          held.current = true
          onHold()
        }, HOLD_MS)
      }}
      onPointerMove={(event) => {
        if (Math.hypot(event.clientX - start.current.x, event.clientY - start.current.y) > MOVE_TOLERANCE) cancel()
      }}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(event) => event.preventDefault()}
      onClick={() => {
        if (!held.current) onPress?.()
        held.current = false
      }}
      onKeyDown={(event) => {
        held.current = false
        if (event.key !== 'Enter' || !onHold) return
        // Sinon Entrée déclenche aussi l'appui. Espace reste l'appui.
        event.preventDefault()
        if (!event.repeat) onHold()
      }}
      className={`flex min-w-0 flex-1 flex-col items-center gap-4 overflow-clip rounded-12 p-6 select-none [-webkit-touch-callout:none] focus-ring ${
        done ? 'bg-background-accent/20' : 'bg-background-surface'
      } ${day === 'current' ? 'current-day-ring' : ''}`}
    >
      <span className="flex h-[6px] w-full items-center justify-end">{showNote && <NoteIcon color="light" />}</span>
      <span className={`type-text-lg ${text}`}>{dayNumber}</span>
      <span className="flex h-[6px] items-center">
        {done && showHabitDone && <span className="size-[6px] rounded-full bg-background-accent" />}
      </span>
    </button>
  )
}
