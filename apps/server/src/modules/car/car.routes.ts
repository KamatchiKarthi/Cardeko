import { Router } from 'express'

import { validateBody, validateParam, validateQuery } from '../../middleware/validate'
import { asyncHandler } from '../../utils/asyncHandler'
import { reviewRouter } from '../review/review.routes'
import * as carController from './car.controller'
import {
  collectionQuerySchema,
  getAllCarsQuerySchema,
  carIdOrSlugSchema,
  mongoIdSchema,
  popularBrandsQuerySchema,
  recommendQuerySchema,
} from './car.schema'

const router = Router()

// ── Reusable guards ───────────────────────────────────────────────────────────

const validateId = validateParam('id', mongoIdSchema)
const validateCarIdOrSlug = validateParam('id', carIdOrSlugSchema)
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
 * Top by popularityScore updated in the last 7 days.
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
 * Cars ≥ ₹20 lakhs ex-showroom or in the luxury segment.
 */
router.get('/premium', validateLimit, asyncHandler(carController.getPremiumCars))

/*
 * GET /api/cars/budget[?limit=10]
 * Cars ≤ ₹10 lakhs ex-showroom.
 */
router.get('/budget', validateLimit, asyncHandler(carController.getBudgetCars))

/*
 * GET /api/cars/upcoming[?limit=10]
 * Cars with a future launch date, or newest models as fallback.
 */
router.get('/upcoming', validateLimit, asyncHandler(carController.getUpcomingLaunches))

/*
 * GET /api/cars/recommend
 * Personalized car recommendations scored by user preferences.
 * Query: budgetMin, budgetMax, useCase, fuelType, seating, priority
 * Scoring: budget(30) + fuel(25) + useCase(25) + seating(15) + priority(10)
 * Returns top-5 cars sorted by score with matchPercent.
 */
router.get(
  '/recommend',
  validateQuery(recommendQuerySchema),
  asyncHandler(carController.getRecommendations)
)

/*
 * POST /api/cars/recommend
 * Same as GET — accepts quiz preferences in the request body.
 */
router.post(
  '/recommend',
  validateBody(recommendQuerySchema),
  asyncHandler(carController.postRecommendations)
)

/*
 * GET /api/cars/stats
 * Platform summary for home page — car count, price range, NCAP safety, reviews.
 */
router.get('/stats', asyncHandler(carController.getHomeStats))

/*
 * GET /api/cars/brands/popular[?limit=12&bodyType=suv]
 * Brands ranked by total popularity, with top models and starting price.
 */
router.get(
  '/brands/popular',
  validateQuery(popularBrandsQuerySchema),
  asyncHandler(carController.getPopularBrands)
)

// ── Document endpoints (:id must follow all named routes) ─────────────────────

/*
 * GET /api/cars/:id
 * Full car detail. Increments popularityScore (non-blocking).
 */
router.get('/:id', validateCarIdOrSlug, asyncHandler(carController.getCarById))

/*
 * Nested review routes — mounted AFTER /:id so the param is available.
 * GET  /api/cars/:id/reviews
 * POST /api/cars/:id/reviews
 */
router.use('/:id/reviews', validateId, reviewRouter)

export { router as carRouter }
