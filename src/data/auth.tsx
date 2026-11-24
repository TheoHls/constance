import type { Session } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { Navigate, Outlet } from 'react-router'
import { linkRefused, linkReturned, supabase } from '../lib/supabase'

type Auth = {
  /** En cours de lecture de la session enregistrée. */
  loading: boolean
  /** Connecté, ou mode démo. */
  signedIn: boolean
  /** Le lien ouvert est expiré, déjà utilisé, ou demandé depuis un autre navigateur. */
  linkExpired: boolean
  /** Absent en mode démo. */
  email: string | undefined
  signOut: () => Promise<void>
}

const AuthContext = createContext<Auth | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(supabase !== null)
  const [linkExpired, setLinkExpired] = useState(supabase !== null && linkRefused)

  useEffect(() => {
    if (!supabase) return
    let active = true
    // Attend la fin de l'échange du lien.
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setLinkExpired(!data.session && linkReturned)
      setLoading(false)
      if (linkReturned) window.history.replaceState(window.history.state, '', window.location.pathname)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next))
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext
      value={{
        loading,
        signedIn: supabase === null || session !== null,
        linkExpired,
        email: session?.user.email,
        // Cet appareil seulement, marche aussi hors ligne.
        signOut: async () => {
          await supabase?.auth.signOut({ scope: 'local' })
        },
      }}
    >
      {children}
    </AuthContext>
  )
}

export function useAuth(): Auth {
  const auth = useContext(AuthContext)
  if (!auth) throw new Error('AuthProvider manquant')
  return auth
}

/** Écrans réservés à l'utilisateur connecté. */
export function RequireAuth() {
  const { loading, signedIn } = useAuth()
  if (loading) return null
  return signedIn ? <Outlet /> : <Navigate to="/sign-in" replace />
}
