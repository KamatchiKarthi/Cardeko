import { Router } from 'express'

import { validateParam, validateQuery } from '../../middleware/validate'
import { asyncHandler } from '../../utils/asyncHandler'
import { reviewRouter } from '../review/review.routes'
import * as carController from './car.controller'
import { collectionQuerySchema, getAllCarsQuerySchema, mongoIdSchema } from './car.schema'

const router = Router()

// ── Reusable guards ───────────────────────────────────────────────────────────

const validateId    = validateParam('id', mongoIdSchema)
const validateLimit = validateQuery(collectionQuerySchema)

// ── Collection endpoints ──────────────────────────────────────────────────────

/*
 * GET /api/cars
 * Filterable, sortable, paginated car list.
 * Query: page, pageSize, make, model, bodyType, segment, fuelType,
 *        transmission, priceMin, priceMax, seatingCapacity,
 *        safetyStarsMin, sortBy, q
 */
router.get('/', validateQuery(getAllCarsQuerySchema), asyncHandler(carController.getAllCars))

/*
 * GET /api/cars/trending[?limit=10]
 * Top by popularityScore updated in the last 30 days.
 * Falls back to all-time popular when no recent activity.
 */
router.get('/trending', validateLimit, asyncHandler(carController.getTrendingCars))

/*
 * GET /api/cars/popular[?limit=10]
 * All-time top cars by popularityScore.
 */
router.get('/popular', validateLimit, asyncHandler(carController.getPopularCars))

/*
 * GET /api/cars/premium[?limit=10]
 * Cars ≥ ₹25 lakhs ex-showroom or in the luxury segment.
 */
router.get('/premium', validateLimit, asyncHandler(carController.getPremiumCars))

/*
 * GET /api/cars/budget[?limit=10]
 * Cars ≤ ₹10 lakhs ex-showroom.
 */
router.get('/budget', validateLimit, asyncHandler(carController.getBudgetCars))

// ── Document endpoints (:id must follow all named routes) ─────────────────────

/*
 * GET /api/cars/:id
 * Full car detail. Increments popularityScore (non-blocking).
 */
router.get('/:id', validateId, asyncHandler(carController.getCarById))

/*
 * Nested review routes — mounted AFTER /:id so the param is available.
 * GET  /api/cars/:id/reviews
 * POST /api/cars/:id/reviews
 */
router.use('/:id/reviews', validateId, reviewRouter)

export { router as carRouter }
