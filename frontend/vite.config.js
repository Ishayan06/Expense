import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175
  },
  build: {
    outDir: 'dist' // 🔥 Vercel expects this folder
  }
})
