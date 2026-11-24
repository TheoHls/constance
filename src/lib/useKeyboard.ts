import { useEffect, useState } from 'react'

/** Écart minimal entre l'écran et sa partie visible pour parler de clavier. */
const MIN_KEYBOARD = 120

/** Partie de l'écran au-dessus du clavier (iOS ne réduit pas la page). Absent si le clavier est fermé. */
export function useKeyboard(): { top: number; height: number } | undefined {
  const [visible, setVisible] = useState<{ top: number; height: number }>()

  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return
    const update = () => {
      // Page zoomée : ce n'est pas le clavier.
      const open = viewport.scale < 1.01 && document.documentElement.clientHeight - viewport.height > MIN_KEYBOARD
      setVisible(open ? { top: viewport.offsetTop, height: viewport.height } : undefined)
    }
    update()
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    return () => {
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
    }
  }, [])

  return visible
}
