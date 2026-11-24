import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from 'react'

const HOLD_MS = 500
const MOVE_TOLERANCE = 10
/** Zone en haut et en bas de l'écran où la page défile pendant le glissement. */
const EDGE = 80
const EDGE_SPEED = 8

type Drag = { from: number; to: number; offset: number; step: number }

/** Appui long sur un élément d'une liste verticale (hauteurs égales), puis glisser pour le déplacer. */
export function useReorder(count: number, gap: number, onMove: (from: number, to: number) => void) {
  const [drag, setDrag] = useState<Drag | null>(null)
  const list = useRef<HTMLElement>(null)
  const hold = useRef<{ timer: number; x: number; y: number }>(undefined)
  const suppressClick = useRef(false)
  // Lu par les écouteurs globaux, posés une seule fois.
  const latest = useRef({ count, onMove })
  latest.current = { count, onMove }
  const stop = useRef<() => void>(undefined)

  const cancelHold = () => {
    window.clearTimeout(hold.current?.timer)
    hold.current = undefined
  }

  useEffect(() => {
    const element = list.current
    // Sinon iOS fait défiler la page au lieu de déplacer la carte.
    const blockScroll = (event: TouchEvent) => {
      if (stop.current && event.cancelable) event.preventDefault()
    }
    element?.addEventListener('touchmove', blockScroll, { passive: false })
    return () => {
      element?.removeEventListener('touchmove', blockScroll)
      window.clearTimeout(hold.current?.timer)
      stop.current?.()
    }
  }, [])

  const start = (from: number, pointerId: number, height: number, startY: number) => {
    const step = height + gap
    const startPage = startY + window.scrollY
    let clientY = startY
    let current: Drag = { from, to: from, offset: 0, step }
    let frame = 0

    const update = () => {
      const offset = clientY + window.scrollY - startPage
      const to = Math.min(latest.current.count - 1, Math.max(0, Math.round(from + offset / step)))
      current = { from, to, offset, step }
      setDrag(current)
    }
    const scroll = () => {
      const before = window.scrollY
      if (clientY < EDGE) window.scrollBy(0, -EDGE_SPEED)
      else if (clientY > window.innerHeight - EDGE) window.scrollBy(0, EDGE_SPEED)
      if (window.scrollY !== before) update()
      frame = requestAnimationFrame(scroll)
    }
    const move = (event: globalThis.PointerEvent) => {
      if (event.pointerId !== pointerId) return
      clientY = event.clientY
      update()
    }
    const end = (event?: globalThis.PointerEvent) => {
      if (event && event.pointerId !== pointerId) return
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', end)
      window.removeEventListener('pointercancel', end)
      stop.current = undefined
      setDrag(null)
      if (event?.type === 'pointerup') {
        // Le clic qui suit le relâchement n'ouvre pas la carte.
        window.setTimeout(() => (suppressClick.current = false))
        if (current.to !== from) latest.current.onMove(from, current.to)
      } else {
        suppressClick.current = false
      }
    }

    suppressClick.current = true
    stop.current = () => end()
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', end)
    window.addEventListener('pointercancel', end)
    frame = requestAnimationFrame(scroll)
    setDrag(current)
  }

  const itemProps = (index: number) => {
    let offset = 0
    if (drag) {
      if (index === drag.from) offset = drag.offset
      else if (index > drag.from && index <= drag.to) offset = -drag.step
      else if (index < drag.from && index >= drag.to) offset = drag.step
    }
    return {
      style: offset ? { transform: `translateY(${offset}px)` } : undefined,
      className: !drag ? '' : index === drag.from ? 'relative z-10' : 'transition-transform',
      onPointerDown: (event: PointerEvent<HTMLDivElement>) => {
        // Le bouton check garde son propre appui.
        if (event.button !== 0 || stop.current || (event.target as Element).closest('[aria-pressed]')) return
        cancelHold()
        const { clientX, clientY, pointerId } = event
        const { height } = event.currentTarget.getBoundingClientRect()
        hold.current = {
          x: clientX,
          y: clientY,
          timer: window.setTimeout(() => {
            hold.current = undefined
            start(index, pointerId, height, clientY)
          }, HOLD_MS),
        }
      },
      onPointerMove: (event: PointerEvent<HTMLDivElement>) => {
        const { current } = hold
        if (current && Math.hypot(event.clientX - current.x, event.clientY - current.y) > MOVE_TOLERANCE) cancelHold()
      },
      onPointerUp: cancelHold,
      onPointerCancel: cancelHold,
      onPointerLeave: cancelHold,
      onContextMenu: (event: MouseEvent) => event.preventDefault(),
      onClickCapture: (event: MouseEvent) => {
        if (!suppressClick.current) return
        event.preventDefault()
        event.stopPropagation()
      },
    }
  }

  return { listRef: list, itemProps }
}
