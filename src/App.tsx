import { Route, Routes } from 'react-router'

// Page provisoire de la phase 0, remplacée par les vrais écrans en phase 4.
function Hello() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-black text-white">
      <h1>Hello</h1>
    </main>
  )
}

export function App() {
  return (
    <Routes>
      <Route path="*" element={<Hello />} />
    </Routes>
  )
}
