import type { NextFunction, Request, RequestHandler, Response } from 'express'

/**
 * Wraps an async route handler so thrown errors are forwarded to next()
 * instead of crashing the process. Eliminates try/catch boilerplate in controllers.
 */
export const asyncHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
