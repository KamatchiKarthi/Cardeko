import type { NextFunction, Request, Response } from 'express'
import type { ZodSchema } from 'zod'

import { AppError } from './errorHandler'

// ── Zod error formatter ───────────────────────────────────────────────────────

function formatErrors(result: ReturnType<ZodSchema['safeParse']>): string {
  if (result.success) return ''
  return result.error.errors
    .map((e) => {
      const field = e.path.length ? e.path.join('.') : 'value'
      return `${field}: ${e.message}`
    })
    .join('; ')
}

// ── Middleware factories ───────────────────────────────────────────────────────

/**
 * Validates req.query against a Zod schema.
 * Replaces req.query with the parsed (coerced + defaulted) result.
 */
export const validateQuery =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query)
    if (!result.success)
      return next(new AppError(400, formatErrors(result)))
      // Store parsed/transformed data so controllers get typed defaults
    ;(req as Request & { parsedQuery: unknown }).parsedQuery = result.data
    next()
  }

/**
 * Validates req.body against a Zod schema.
 * Replaces req.body with the parsed (trimmed + defaulted) result.
 */
export const validateBody =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) return next(new AppError(400, formatErrors(result)))
    req.body = result.data
    next()
  }

/**
 * Validates a single route param against a Zod schema.
 * Usage: validateParam('id', mongoIdSchema)
 */
export const validateParam =
  (param: string, schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params[param])
    if (!result.success) return next(new AppError(400, formatErrors(result)))
    next()
  }
