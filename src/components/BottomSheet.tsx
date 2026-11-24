import { useEffect, useRef, type ReactNode } from 'react'

type BottomSheetProps = {
  /** Lu par les lecteurs d'écran. */
  label: string
  onClose: () => void
  /** Slot Content */
  children: ReactNode
}

/** Monté uniquement quand il est ouvert. Reste dans la colonne de 390 px sur le web. */
export function BottomSheet({ label, onClose, children }: BottomSheetProps) {
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const element = dialog.current
    element?.showModal()
    // Sinon le navigateur met le focus (et son contour) sur le premier bouton.
    element?.focus()
    return () => element?.close()
  }, [])

  return (
    <dialog
      ref={dialog}
      tabIndex={-1}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="mx-auto flex h-dvh max-h-none w-full max-w-none flex-col justify-end bg-background-overlay text-text-icon-default outline-none backdrop:bg-transparent sm:max-w-[390px]"
    >
      <div className="flex max-h-full w-full flex-col overflow-y-auto rounded-40 border border-border-strong bg-background-surface sheet-slide-up">
        <div className="flex shrink-0 justify-center p-16">
          <span className="h-[5px] w-[40px] rounded-full bg-border-strong" />
        </div>
        {children}
      </div>
    </dialog>
  )
}
