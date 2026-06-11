import 'dotenv/config'
import { connectDB } from '../db/mongoose'
import { app } from '../app'

// Connect on cold start; mongoose pool reuses it on warm invocations
connectDB().catch((err) => console.error('[Vercel] DB init failed:', err))

export default app
