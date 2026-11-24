import { useLocation } from 'react-router'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { HabitCardLoading } from '../components/HabitCard'
import { HomeHeader } from '../components/HomeHeader'
import type { LoadStatus } from '../data/store'

/** Home · Loading et Home · Load error. Le chargement n'est dessiné que pour Home. */
export function HomeStatus({ status, onRetry }: { status: LoadStatus; onRetry: () => void }) {
  const { pathname } = useLocation()

  if (status === 'loading' && pathname !== '/') return null

  return (
    <main className="min-h-dvh">
      <HomeHeader showAdd={status === 'loading'} />
      {status === 'loading' ? (
        <div className="flex flex-col gap-8 p-8" role="status" aria-label="Loading">
          <HabitCardLoading />
          <HabitCardLoading />
          <HabitCardLoading />
        </div>
      ) : (
        <div className="px-16 pt-40 pb-120">
          <EmptyState title="You’re offline" description={'Check your connection\nand try again.'}>
            <Button label="Try again" onClick={onRetry} />
          </EmptyState>
        </div>
      )}
    </main>
  )
}
