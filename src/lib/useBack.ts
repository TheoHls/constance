import { useNavigate } from 'react-router'

/** Page précédente, ou `fallback` si l'app a été ouverte directement ici. */
export function useBack(fallback: string) {
  const navigate = useNavigate()
  return () => {
    if ((window.history.state?.idx ?? 0) > 0) navigate(-1)
    else navigate(fallback, { replace: true })
  }
}
