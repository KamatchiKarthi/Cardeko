import { Router } from 'express'

import { validateBody, validateQuery } from '../../middleware/validate'
import { asyncHandler } from '../../utils/asyncHandler'
import * as reviewController from './review.controller'
import { createReviewSchema, paginationQuerySchema } from './review.schema'

/**
 * mergeParams: true — inherits :id from the parent car router so
 * reviewController can read req.params.id without any extra wiring.
 */
const router = Router({ mergeParams: true })

/*
 * GET /api/cars/:id/reviews?page=1&pageSize=10&sortBy=newest|rating
 * Paginated list of reviews for a car.
 */
router.get(
  '/',
  validateQuery(paginationQuerySchema),
  asyncHandler(reviewController.getCarReviews)
)

/*
 * POST /api/cars/:id/reviews
 * Submit a review. One review per user per car (DB unique index).
 * Returns 409 if the user has already reviewed this car.
 */
router.post(
  '/',
  validateBody(createReviewSchema),
  asyncHandler(reviewController.createCarReview)
)

export { router as reviewRouter }
