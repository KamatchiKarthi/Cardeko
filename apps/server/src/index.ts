import 'dotenv/config'

import app from './app'
import { env } from './config/env'
import { disconnectDB } from './db/mongoose'

async function bootstrap() {
  const server = app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`)
  })

  const shutdown = async (signal: string) => {
    console.log(`\n${signal} received — shutting down gracefully...`)
    if (env.NODE_ENV === 'development') {
      process.exit(0)
    }
    server.close(async () => {
      await disconnectDB()
      process.exit(0)
    })
    // Force exit if graceful shutdown takes too long
    setTimeout(() => process.exit(1), 10_000).unref()
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err)
    shutdown('uncaughtException')
  })
  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled rejection:', reason)
    shutdown('unhandledRejection')
  })
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
