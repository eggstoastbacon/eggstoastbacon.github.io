import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Project under user site subpath: /genmdm-explorer/
export default defineConfig({
  plugins: [react()],
  base: '/genmdm-explorer/',
})
