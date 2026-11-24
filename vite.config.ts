import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // Nom du repo GitHub : l'app est servie sur https://theohls.github.io/constance/
  base: '/constance/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Constance',
        short_name: 'Constance',
        display: 'standalone',
        theme_color: '#000000',
        background_color: '#000000',
        // Icônes : phase 7
        icons: [],
      },
    }),
  ],
})
