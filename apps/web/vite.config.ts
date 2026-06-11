import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const webDir = fileURLToPath(new URL('.', import.meta.url))
const serverEnvDir = path.resolve(webDir, '../server')

export default defineConfig(({ mode }) => {
  const serverEnv = loadEnv(mode, serverEnvDir, '')
  const apiPort = serverEnv.PORT || '3001'

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: `http://localhost:${apiPort}`,
          changeOrigin: true,
        },
      },
    },
  }
})
