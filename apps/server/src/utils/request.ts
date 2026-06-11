import type { Request } from 'express'

import { AppError } from '../middleware/errorHandler'

type ParsedReq = Request & { parsedQuery: unknown }

/**
 * Returns the Zod-parsed query stored by validateQuery().
 * Throws 500 if the middleware was not applied to the route — this is a
 * programmer error, not a user error, so it should never reach production.
 */
export function getQuery<T>(req: Request): T {
  const parsed = (req as ParsedReq).parsedQuery
  if (parsed === undefined) {
    throw new AppError(
      500,
      '[getQuery] parsedQuery is missing — ensure validateQuery() is applied to this route'
    )
  }
  return parsed as T
}

/**
 * Returns a route param by key.
 * Throws 400 if the param is missing (route misconfiguration).
 */
export function getParam(req: Request, key: string): string {
  const value = req.params[key]
  if (!value) throw new AppError(400, `Missing route parameter: ${key}`)
  return value
}
