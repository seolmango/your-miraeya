import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'Android >= 6', 'iOS >= 10', 'Chrome >= 49'],
    }),
  ],
  base: process.env.GITHUB_PAGES ? '/your-miraeya/' : '/',
})
