import type { CSSProperties } from 'react'

/** Teintes proposées dans le Color dot, dans l'ordre Tailwind. */
export const habitColors = [
  'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan',
  'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose',
] as const

export type HabitColor = (typeof habitColors)[number]

/** Accent = teinte /300 (Yellow /200), on-accent = /950. À poser sur le conteneur de l'habitude. */
export function accentStyle(color: HabitColor): CSSProperties {
  return {
    '--accent': `var(--${color}-${color === 'yellow' ? 200 : 300})`,
    '--accent-on': `var(--${color}-950)`,
  } as CSSProperties
}
