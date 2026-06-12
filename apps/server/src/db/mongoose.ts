import mongoose from 'mongoose'

import { env } from '../config/env'

const MONGOOSE_OPTIONS: mongoose.ConnectOptions = {
  dbName: 'cardeko',
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
}

let lastDBError: string | null = null

export function getLastDBError(): string | null {
  return lastDBError
}

export async function connectDB(): Promise<void> {
  mongoose.connection.on('connected', () =>
    console.log(
      `MongoDB connected → ${mongoose.connection.host} / ${mongoose.connection.db?.databaseName}`
    )
  )
  mongoose.connection.on('error', (err: Error) => console.error('MongoDB error:', err.message))
  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'))
  mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected'))

  try {
    await mongoose.connect(env.MONGODB_URI, MONGOOSE_OPTIONS)
    lastDBError = null
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    lastDBError = message
    if (message.includes('ECONNREFUSED') || message.includes('querySrv')) {
      console.error('\n[DB] Connection refused — check:')
      console.error('  1. MongoDB Atlas → Network Access → IP Whitelist (add 0.0.0.0/0 for dev)')
      console.error('  2. Atlas cluster is not paused (free tier auto-pauses)')
      console.error('  3. MONGODB_URI is correct in .env\n')
    }
    throw err
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect()
  console.log('MongoDB disconnected gracefully')
}

export function getDBStatus(): 'connected' | 'disconnected' | 'connecting' | 'disconnecting' {
  const states: Record<number, 'connected' | 'disconnected' | 'connecting' | 'disconnecting'> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  }
  return states[mongoose.connection.readyState] ?? 'disconnected'
}
