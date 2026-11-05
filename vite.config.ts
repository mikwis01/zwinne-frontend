import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    // Must come before react()
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/pages',
      routeFileIgnorePattern: '^(components|consts|types|utils|hooks)$'
    }),
    react(),
    tailwindcss()
  ],
  resolve: {
    tsconfigPaths: true
  },
  server: {
    port: 3000
  }
})
