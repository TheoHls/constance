import {
  Add01Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  Cancel01Icon,
  Delete02Icon,
  PencilEdit01Icon,
  Search01Icon,
  Settings01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

/** Mêmes noms que les composants Icon/* de Figma. */
export const icons = {
  Search: Search01Icon,
  Settings: Settings01Icon,
  Add: Add01Icon,
  Close: Cancel01Icon,
  'Chevron left': ArrowLeft01Icon,
  'Chevron right': ArrowRight01Icon,
  'Chevron down': ArrowDown01Icon,
  Calendar: Calendar03Icon,
  Edit: PencilEdit01Icon,
  Trash: Delete02Icon,
}

export type IconName = keyof typeof icons

/** Icône décorative, colorée par le parent avec text-text-icon-*. Le trait reste à 2 px à toutes les tailles. */
export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  return <HugeiconsIcon icon={icons[name]} size={size} strokeWidth={2} absoluteStrokeWidth aria-hidden />
}
