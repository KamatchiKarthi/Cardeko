import type { Request, Response } from 'express'

import { getParam, getQuery } from '../../utils/request'
import * as reviewService from './review.service'
import type { CreateReviewDto, PaginationQuery } from './review.schema'

// ── Review controllers ────────────────────────────────────────────────────────

export async function getCarReviews(req: Request, res: Response) {
  const query = getQuery<PaginationQuery>(req)
  const result = await reviewService.getCarReviews(getParam(req, 'id'), query)

  type Meta = Record<string, string>
  let meta: Meta | undefined

  if (result.total === 0) {
    meta = { hint: 'No reviews yet. Be the first to review this car!' }
  } else if (query.page > result.totalPages) {
    meta = { warning: `Page ${query.page} is out of range — total pages: ${result.totalPages}` }
  }

  res.json({
    success: true,
    message: result.total === 0 ? 'No reviews found' : 'Reviews fetched successfully',
    ...result,
    ...(meta && { meta }),
  })
}

export async function createCarReview(req: Request, res: Response) {
  const review = await reviewService.createCarReview(
    getParam(req, 'id'),
    req.body as CreateReviewDto
  )

  // Strip internal fields from the response
  const {
    isActive: _ia,
    __v: _v,
    ...safeReview
  } = review as typeof review & {
    isActive?: boolean
    __v?: number
  }

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    data: safeReview,
  })
}
