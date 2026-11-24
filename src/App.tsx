import { useLayoutEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router'
import { AuthProvider, RequireAuth, useAuth } from './data/auth'
import { StoreProvider } from './data/store'
import { HabitDetail } from './pages/HabitDetail'
import { Home } from './pages/Home'
import { HomeStatus } from './pages/HomeStatus'
import { Kit } from './pages/Kit'
import { Notes } from './pages/Notes'
import { SignIn } from './pages/SignIn'

export function App() {
  const { pathname } = useLocation()
  // Les accolades comptent : scrollTo renvoie une promesse dans les navigateurs récents.
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <AuthProvider>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route element={<SignedInApp />}>
            <Route path="/" element={<Home />} />
            <Route path="/habits/:id" element={<HabitDetail />} />
            <Route path="/habits/:id/notes" element={<Notes />} />
          </Route>
        </Route>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/kit" element={<Kit />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}

function SignedInApp() {
  const { userId } = useAuth()
  return (
    <StoreProvider
      key={userId}
      userId={userId}
      fallback={(status, retry) => <HomeStatus status={status} onRetry={retry} />}
    >
      <Outlet />
    </StoreProvider>
  )
}
