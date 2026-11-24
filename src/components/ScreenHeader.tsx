import type { ReactNode } from 'react'

/** Barre du haut d'un écran, sous la barre de statut de l'iPhone. */
export function ScreenHeader({ children }: { children: ReactNode }) {
  return (
    <header className="pt-[env(safe-area-inset-top)]">
      {/* Le contenu qui défile ne passe pas sous l'heure. */}
      <div className="fixed inset-x-0 top-0 z-20 h-[env(safe-area-inset-top)] bg-background-default" />
      <div className="flex items-center justify-between p-16">{children}</div>
    </header>
  )
}
