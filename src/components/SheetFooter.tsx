import type { ReactNode } from 'react'

/** Action d'une sheet haute, fixe en bas : le contenu défile dessous. Se place par rapport à la Bottom sheet. */
export function SheetFooter({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-10 bg-background-surface/75 p-16 backdrop-blur-[8px]">{children}</div>
  )
}
