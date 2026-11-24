import { accentStyle, type HabitColor } from '../lib/habitColors'

/** Remplit sa colonne de la grille. */
type ColorDotProps = {
  color: HabitColor
  selected?: boolean
  onSelect?: () => void
}

export function ColorDot({ color, selected = false, onSelect }: ColorDotProps) {
  return (
    <button
      type="button"
      aria-label={color}
      aria-pressed={selected}
      onClick={onSelect}
      style={accentStyle(color)}
      className={`aspect-square w-full rounded-full bg-background-accent focus-ring ${selected ? 'color-dot-ring' : ''}`}
    />
  )
}
