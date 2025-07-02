import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      // Make env variables available to the client
      __DATABASE_URL__: JSON.stringify(env.VITE_DATABASE_URL),
    },
    // Expose env variables that start with VITE_
    envPrefix: 'VITE_',
    // Exclude Prisma Client from browser bundle
    optimizeDeps: {
      exclude: ['@prisma/client']
    },
    // Configure external dependencies for server-side only
    build: {
      rollupOptions: {
        external: ['@prisma/client']
      }
    }
  }
})
