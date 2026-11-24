import type { ReactNode } from 'react'
import { BottomSheet } from './BottomSheet'
import { Button } from './Button'

type ConfirmSheetProps = {
  title: string
  description: string
  onClose: () => void
  /** Actions au-dessus de Cancel. */
  children: ReactNode
}

export function ConfirmSheet({ title, description, onClose, children }: ConfirmSheetProps) {
  return (
    <BottomSheet label={title} onClose={onClose}>
      <div className="flex flex-col gap-40 p-16">
        <div className="flex flex-col gap-16 text-center">
          <h2 className="type-h2">{title}</h2>
          <p className="type-text-md break-words text-text-icon-secondary">{description}</p>
        </div>
        <div className="flex flex-col gap-16">
          {children}
          <Button label="Cancel" kind="secondary" fullWidth onClick={onClose} />
        </div>
      </div>
    </BottomSheet>
  )
}
