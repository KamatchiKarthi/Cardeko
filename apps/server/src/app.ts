import cors from 'cors'
import express from 'express'
import helmet from 'helmet'

import { env } from './config/env'
import { connectDB } from './db/mongoose'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import { apiRouter } from './router'

const app = express()

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet())
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api', apiRouter)

// ── Fallback handlers (must be last) ─────────────────────────────────────────
app.use(notFoundHandler)
app.use(errorHandler)

// Connect to DB on module load — Vercel loads this file as the Lambda handler.
// mongoose pools the connection so warm invocations reuse it without reconnecting.
connectDB().catch((err) => console.error('[App] DB init error:', err))

export { app }
export default app
module.exports = app
