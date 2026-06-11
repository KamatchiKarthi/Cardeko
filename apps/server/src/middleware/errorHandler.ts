import type { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { Error as MongooseError } from 'mongoose'

// ── AppError ──────────────────────────────────────────────────────────────────

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string
  ) {
    super(message)
    this.name = 'AppError'
    Error.captureStackTrace(this, this.constructor)
  }
}

// ── MongoDB error helpers ─────────────────────────────────────────────────────

function isCastError(err: unknown): err is MongooseError.CastError {
  return err instanceof MongooseError.CastError
}

function isValidationError(err: unknown): err is MongooseError.ValidationError {
  return err instanceof MongooseError.ValidationError
}

function isDuplicateKeyError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: unknown }).code === 11000
  )
}

// ── Error handler ─────────────────────────────────────────────────────────────

export const errorHandler: ErrorRequestHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  const isDev = process.env.NODE_ENV === 'development'
  const stack = isDev && err instanceof Error ? { stack: err.stack } : {}

  // Known application error
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...stack,
    })
  }

  // Invalid MongoDB ObjectId  → 400
  if (isCastError(err) && err.kind === 'ObjectId') {
    return res.status(400).json({
      success: false,
      message: `Invalid ID format: '${err.value}'`,
    })
  }

  // Mongoose schema validation failed  → 422
  if (isValidationError(err)) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }))
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    })
  }

  // MongoDB duplicate key  → 409
  if (isDuplicateKeyError(err)) {
    const keyError = err as { keyValue?: Record<string, unknown> }
    const field = keyError.keyValue ? Object.keys(keyError.keyValue)[0] : 'field'
    return res.status(409).json({
      success: false,
      message: `Duplicate value for '${field}'. This record already exists.`,
    })
  }

  // Unhandled error  → 500
  if (err instanceof Error) {
    console.error('[Unhandled error]', err)
    return res.status(500).json({
      success: false,
      message: isDev ? err.message : 'Internal Server Error',
      ...stack,
    })
  }

  return res.status(500).json({ success: false, message: 'Internal Server Error' })
}

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' })
}
