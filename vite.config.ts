import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 'base' устанавливается в './', чтобы пути к ассетам были относительными.
  // Это позволяет сайту работать на https://username.github.io/repo-name/
  base: './', 
})