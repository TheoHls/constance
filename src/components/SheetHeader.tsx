import type { ReactNode } from 'react'
import { IconButton } from './IconButton'

type SheetHeaderProps = {
  title: string
  icon: 'Close' | 'Chevron left'
  onBack: () => void
  /** Bouton de droite, sinon un espace de même largeur. */
  trailing?: ReactNode
}

export function SheetHeader({ title, icon, onBack, trailing }: SheetHeaderProps) {
  return (
    <div className="flex items-center justify-between p-16">
      <IconButton icon={icon} label={icon === 'Close' ? 'Close' : 'Back'} kind="secondary" size="M" onClick={onBack} />
      <h2 className="type-h2">{title}</h2>
      {trailing ?? <span className="size-[40px]" />}
    </div>
  )
}
