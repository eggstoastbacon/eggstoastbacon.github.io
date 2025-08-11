import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// User/Org site: base must bee '/'
export default defineConfig({
  plugins: [react()],
  base: '/',
})
