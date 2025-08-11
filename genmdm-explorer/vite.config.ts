import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// User/Org site: base must be '/'
export default defineConfig({
  plugins: [react()],
  base: '/',
})
