import { registerSW } from 'virtual:pwa-register'

/** Une sheet ouverte ou un champ en cours de saisie serait perdu au rechargement. */
const busy = () => document.querySelector('dialog[open], input:focus, textarea:focus') !== null

/** Recharge l'app dès qu'une nouvelle version est prête ; cherche une version à chaque retour dans l'app. */
export function autoUpdate() {
  registerSW({
    immediate: true,
    onNeedReload: () => {
      if (!busy()) {
        window.location.reload()
        return
      }
      const timer = window.setInterval(() => {
        if (busy()) return
        window.clearInterval(timer)
        window.location.reload()
      }, 2000)
    },
    onRegisteredSW: (_url, registration) => {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') registration?.update().catch(() => undefined)
      })
    },
  })
}
