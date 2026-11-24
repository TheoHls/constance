import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Lu avant createClient, qui retire ?code= de l'adresse.
const params = new URLSearchParams(window.location.search)
const hash = new URLSearchParams(window.location.hash.slice(1))

/** Retour d'un lien d'e-mail : refusé par Supabase, ou à échanger contre une session. */
export const linkRefused = params.has('error_code') || hash.has('error_code')
export const linkReturned = linkRefused || params.has('code')

/** null sans variables d'environnement : mode démo, sans connexion. */
export const supabase =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      })
    : null

/** Adresse de l'app, à autoriser dans Supabase (Redirect URLs). */
export const appUrl = new URL(import.meta.env.BASE_URL, window.location.origin).href
