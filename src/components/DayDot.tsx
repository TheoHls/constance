import { NoteIcon } from './NoteIcon'

type DayDotProps = {
  size: 'S' | 'M' | 'L' | 'M + note'
  /** inactive : Heatmap seulement, avant la création de l'habitude ou après aujourd'hui. */
  habit: 'done' | 'not done' | 'inactive'
  today?: boolean
}

const sizeClasses: Record<DayDotProps['size'], string> = {
  S: 'size-[8px]',
  M: 'size-[12px]',
  'M + note': 'size-[12px]',
  L: 'size-[16px]',
}

export function DayDot({ size, habit, today = false }: DayDotProps) {
  const done = habit === 'done'
  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-clip rounded-full ${sizeClasses[size]} ${
        done ? 'bg-background-accent' : 'bg-background-elevated'
      } ${habit === 'inactive' ? 'opacity-60' : ''} ${today ? 'today-ring' : ''}`}
    >
      {size === 'M + note' && <NoteIcon color={done ? 'dark' : 'light'} />}
    </span>
  )
}
