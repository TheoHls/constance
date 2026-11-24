import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router'
import background from '../assets/background-visual.jpg'
import { Button } from '../components/Button'
import { TextInput } from '../components/TextInput'
import { useAuth } from '../data/auth'
import { appUrl, supabase } from '../lib/supabase'

const CODE_LENGTH = 6
/** Délai minimal de Supabase entre deux e-mails. */
const RESEND_DELAY = 60_000
/** L'e-mail en attente survit à un passage par l'app Mail. */
const PENDING_KEY = 'constance.sign-in'
const PENDING_TTL = 60 * 60_000

// Textes absents de Figma.
const SEND_ERROR = 'We couldn’t send the email. Try again later.'
const NETWORK_ERROR = 'Something went wrong. Try again.'

type Pending = { email: string; sentAt: number }

function readPending(): Pending | null {
  try {
    const pending = JSON.parse(localStorage.getItem(PENDING_KEY) ?? 'null') as Pending | null
    return pending && Date.now() - pending.sentAt < PENDING_TTL ? pending : null
  } catch {
    return null
  }
}

function writePending(pending: Pending | null) {
  try {
    if (pending) localStorage.setItem(PENDING_KEY, JSON.stringify(pending))
    else localStorage.removeItem(PENDING_KEY)
  } catch {
    // Stockage indisponible : l'écran marche quand même.
  }
}

/** Un e-mail inconnu crée un compte. Mode démo : n'envoie rien. */
async function sendEmail(email: string): Promise<boolean> {
  if (!supabase) return true
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: appUrl, shouldCreateUser: true },
  })
  return !error
}

export function SignIn() {
  const { loading, signedIn, linkExpired } = useAuth()
  const [params] = useSearchParams()
  const [pending, setPending] = useState(readPending)
  const [resent, setResent] = useState(false)
  const expired = !resent && (linkExpired || params.has('expired'))
  const [email, setEmail] = useState(pending?.email ?? '')
  const [sendError, setSendError] = useState(false)
  const [busy, setBusy] = useState(false)
  const valid = /^\S+@\S+\.\S+$/.test(email.trim())

  if (loading) return null
  if (supabase && signedIn) return <Navigate to="/" replace />

  const send = async () => {
    const address = email.trim()
    setBusy(true)
    const sent = await sendEmail(address)
    setBusy(false)
    setSendError(!sent)
    if (!sent) return
    const next = { email: address, sentAt: Date.now() }
    writePending(next)
    setPending(next)
    setResent(true)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (valid && !busy) void send()
  }

  if (pending && !expired) {
    return (
      <Screen>
        <EnterCode
          pending={pending}
          resend={send}
          resendFailed={sendError}
          onAnotherEmail={() => {
            writePending(null)
            setPending(null)
            setSendError(false)
          }}
        />
      </Screen>
    )
  }

  return (
    <Screen>
      <form noValidate onSubmit={submit} className="flex flex-col gap-32 p-24">
        <Intro title="Constance">
          Sign in once with your email. No password: we send you a link, and you stay signed in on this phone.
        </Intro>
        <TextInput
          label="Email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          placeholder="you@email.com"
          value={email}
          onChange={(value) => {
            setEmail(value)
            setSendError(false)
          }}
          error={expired || sendError}
          helper={sendError ? SEND_ERROR : expired ? 'This link has expired. Send a new one.' : undefined}
        />
        <Button
          type="submit"
          label={expired ? 'Send me a new link' : 'Send me a link'}
          fullWidth
          disabled={!valid || busy}
        />
      </form>
    </Screen>
  )
}

type EnterCodeProps = {
  pending: Pending
  resend: () => Promise<void>
  resendFailed: boolean
  onAnotherEmail: () => void
}

function EnterCode({ pending, resend, resendFailed, onAnotherEmail }: EnterCodeProps) {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string>()
  const [busy, setBusy] = useState(false)
  const [waiting, setWaiting] = useState(true)
  const complete = code.length === CODE_LENGTH

  useEffect(() => {
    const left = pending.sentAt + RESEND_DELAY - Date.now()
    setWaiting(left > 0)
    if (left <= 0) return
    const timer = window.setTimeout(() => setWaiting(false), left)
    return () => window.clearTimeout(timer)
  }, [pending.sentAt])

  const verify = async (event: FormEvent) => {
    event.preventDefault()
    if (!complete || busy) return
    setBusy(true)
    const failure = supabase
      ? (await supabase.auth.verifyOtp({ email: pending.email, token: code, type: 'email' })).error
      : null
    setBusy(false)
    if (failure) {
      const wrongCode = failure.status !== undefined && failure.status >= 400 && failure.status < 500 && failure.status !== 429
      setError(wrongCode ? 'This code is wrong or has expired. Try again.' : NETWORK_ERROR)
      return
    }
    writePending(null)
    navigate('/', { replace: true })
  }

  return (
    <form noValidate onSubmit={verify} className="flex flex-col gap-32 p-24">
      <Intro title="Check your email">
        We sent a 6-digit code to {pending.email}. Enter it below, or open the link in the email.
      </Intro>
      <TextInput
        label="Code"
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="6-digit code"
        value={code}
        onChange={(value) => {
          setCode(value.replace(/\D/g, '').slice(0, CODE_LENGTH))
          setError(undefined)
        }}
        error={error !== undefined || resendFailed}
        helper={error ?? (resendFailed ? SEND_ERROR : undefined)}
      />
      <div className="flex flex-col gap-16">
        <Button type="submit" label="Continue" fullWidth disabled={!complete || busy} />
        <Button
          label="Resend email"
          kind="secondary"
          fullWidth
          disabled={waiting || busy}
          onClick={() => {
            setCode('')
            setError(undefined)
            setBusy(true)
            void resend().finally(() => setBusy(false))
          }}
        />
        <Button label="Use another email" kind="ghost" fullWidth onClick={onAnotherEmail} />
      </div>
    </form>
  )
}

function Screen({ children }: { children: ReactNode }) {
  return (
    <main
      style={{ backgroundImage: `url(${background})` }}
      className="flex min-h-dvh flex-col justify-end bg-cover bg-top px-8 pt-8 pb-40"
    >
      {children}
    </main>
  )
}

function Intro({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-12 text-center">
      <h1 className="type-h1">{title}</h1>
      <p className="type-text-md break-words text-text-icon-secondary">{children}</p>
    </div>
  )
}
