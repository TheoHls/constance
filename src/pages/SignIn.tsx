import { useState, type FormEvent, type ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import background from '../assets/background-visual.jpg'
import { Button } from '../components/Button'
import { TextInput } from '../components/TextInput'

/** Phase 4 : aucun e-mail n'est envoyé. `?expired` montre le lien expiré. */
export function SignIn() {
  const [params, setParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const expired = params.has('expired')
  const valid = /^\S+@\S+\.\S+$/.test(email.trim())

  const send = (event: FormEvent) => {
    event.preventDefault()
    if (!valid) return
    setParams({}, { replace: true })
    setSent(true)
  }

  return (
    <main
      style={{ backgroundImage: `url(${background})` }}
      className="flex min-h-dvh flex-col justify-end bg-cover bg-top px-8 pt-8 pb-40"
    >
      {sent ? (
        <div className="flex flex-col gap-32 p-24">
          <Intro title="Check your email">
            We sent a sign-in link to {email.trim()}. Open it on this phone to continue.
          </Intro>
          <div className="flex flex-col gap-8">
            <Button label="Resend link" kind="secondary" fullWidth />
            <Button label="Use another email" kind="ghost" fullWidth onClick={() => setSent(false)} />
          </div>
        </div>
      ) : (
        <form noValidate onSubmit={send} className="flex flex-col gap-32 p-24">
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
            onChange={setEmail}
            error={expired}
            helper={expired ? 'This link has expired. Send a new one.' : undefined}
          />
          <Button type="submit" label={expired ? 'Send me a new link' : 'Send me a link'} fullWidth disabled={!valid} />
        </form>
      )}
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
