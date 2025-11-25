// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,     // importante en Windows
    },
    hmr: {
      overlay: false        // evita errores falsos
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})