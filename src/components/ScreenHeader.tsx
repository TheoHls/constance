import type { ReactNode } from 'react'

/** Barre du haut d'un écran, sous la barre de statut de l'iPhone. */
export function ScreenHeader({ children }: { children: ReactNode }) {
  return (
    <header className="pt-[env(safe-area-inset-top)]">
      <div className="flex items-center justify-between p-16">{children}</div>
    </header>
  )
}
