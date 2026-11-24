import { useEffect, useState } from 'react'
import { toDay } from './dates'

/** Jour local, mis à jour quand l'app revient au premier plan ou passe minuit. */
export function useToday() {
  const [today, setToday] = useState(() => toDay(new Date()))

  useEffect(() => {
    const update = () => setToday(toDay(new Date()))
    const timer = window.setInterval(update, 60_000)
    document.addEventListener('visibilitychange', update)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  return today
}
