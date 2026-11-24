import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../data/auth'
import { Button } from './Button'
import { ConfirmSheet } from './ConfirmSheet'
import { IconButton } from './IconButton'
import { ScreenHeader } from './ScreenHeader'

type HomeHeaderProps = {
  /** Absent : écran Load error. */
  showAdd?: boolean
  onAdd?: () => void
}

/** Barre du haut de Home, avec Settings = Sign out. */
export function HomeHeader({ showAdd = true, onAdd }: HomeHeaderProps) {
  const navigate = useNavigate()
  const { email, signOut } = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  return (
    <>
      <ScreenHeader>
        <h1 className="type-h1">Constance</h1>
        <div className="flex gap-16">
          {showAdd && <IconButton icon="Add" label="Create a habit" kind="secondary" size="M" onClick={onAdd} />}
          <IconButton icon="Settings" label="Settings" kind="secondary" size="M" onClick={() => setSigningOut(true)} />
        </div>
      </ScreenHeader>
      {signingOut && (
        <ConfirmSheet
          title="Sign out?"
          description={`${email ? `You’re signed in as ${email}. ` : ''}Your habits and notes are kept.`}
          onClose={() => setSigningOut(false)}
        >
          <Button
            label="Sign out"
            kind="danger"
            fullWidth
            onClick={() => void signOut().then(() => navigate('/sign-in', { replace: true }))}
          />
        </ConfirmSheet>
      )}
    </>
  )
}
