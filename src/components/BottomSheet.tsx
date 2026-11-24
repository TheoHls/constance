import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react'

const CLOSE_DISTANCE = 80
/** px par ms */
const CLOSE_VELOCITY = 0.5

type BottomSheetProps = {
  /** Lu par les lecteurs d'écran. */
  label: string
  /** Équivalent de Cancel : fond, Échap ou poignée glissée vers le bas. */
  onClose: () => void
  /** Accent de l'habitude, s'il diffère de celui de l'écran. */
  style?: CSSProperties
  /** Slot Content */
  children: ReactNode
}

/** Monté uniquement quand il est ouvert. Reste dans la colonne de 390 px sur le web. */
export function BottomSheet({ label, style: accent, onClose, children }: BottomSheetProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const drag = useRef<{ y: number; lastY: number; lastTime: number; velocity: number }>(undefined)
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    const element = dialog.current
    element?.showModal()
    // Sinon le navigateur met le focus (et son contour) sur le premier bouton.
    element?.focus()
    return () => element?.close()
  }, [])

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { y: event.clientY, lastY: event.clientY, lastTime: event.timeStamp, velocity: 0 }
    setDragging(true)
  }

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current
    if (!current) return
    const elapsed = event.timeStamp - current.lastTime
    if (elapsed > 0) current.velocity = (event.clientY - current.lastY) / elapsed
    current.lastY = event.clientY
    current.lastTime = event.timeStamp
    setOffset(Math.max(0, event.clientY - current.y))
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const current = drag.current
    if (!current) return
    drag.current = undefined
    setDragging(false)
    const distance = event.clientY - current.y
    const flicked = current.velocity > CLOSE_VELOCITY && event.timeStamp - current.lastTime < 100
    // Si le parent garde la sheet ouverte, elle revient en place.
    setOffset(0)
    if (event.type === 'pointerup' && distance > 0 && (distance > CLOSE_DISTANCE || flicked)) onClose()
  }

  return (
    <dialog
      ref={dialog}
      tabIndex={-1}
      style={accent}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="mx-auto flex h-dvh max-h-none w-full max-w-none flex-col justify-end bg-background-overlay p-8 pb-40 backdrop-blur-[8px] text-text-icon-default outline-none backdrop:bg-transparent sm:max-w-[390px]"
    >
      <div
        style={offset > 0 ? { transform: `translateY(${offset}px)` } : undefined}
        className={`flex max-h-full w-full flex-col overflow-clip rounded-40 border border-border-strong bg-background-surface sheet-slide-up ${
          dragging ? '' : 'transition-transform'
        }`}
      >
        <div
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="flex shrink-0 cursor-grab touch-none justify-center p-16"
        >
          <span className="h-[5px] w-[40px] rounded-full bg-border-strong" />
        </div>
        <div className="no-scrollbar min-h-0 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </dialog>
  )
}
