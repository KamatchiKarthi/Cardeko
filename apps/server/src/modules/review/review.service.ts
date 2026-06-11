import type { SortOrder } from 'mongoose'

import { AppError } from '../../middleware/errorHandler'
import { assertCarExists } from '../car/car.service'
import { Review } from './review.model'
import type { CreateReviewDto, PaginationQuery } from './review.schema'

// ── Sort map ──────────────────────────────────────────────────────────────────

const SORT_MAP: Record<string, Record<string, SortOrder>> = {
  newest: { createdAt: -1 },
  rating: { 'ratings.overall': -1 },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const toSkip = (page: number, size: number) => (page - 1) * size

function isDuplicateKey(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: unknown }).code === 11000
  )
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getCarReviews(carId: string, params: PaginationQuery) {
  await assertCarExists(carId)

  const { page, pageSize, sortBy } = params
  const sort = SORT_MAP[sortBy] ?? SORT_MAP['newest']
  const skip = toSkip(page, pageSize)

  const [data, total] = await Promise.all([
    Review.find({ car: carId, isActive: true })
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .select('-__v -isActive')
      .lean(),
    Review.countDocuments({ car: carId, isActive: true }),
  ])

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function createCarReview(carId: string, dto: CreateReviewDto) {
  await assertCarExists(carId)

  const { userId, ...rest } = dto

  try {
    const review = await Review.create({ ...rest, car: carId, user: userId })
    return review.toObject()
  } catch (err) {
    // Unique index (car + user) is the authoritative duplicate guard
    if (isDuplicateKey(err)) {
      throw new AppError(409, 'You have already submitted a review for this car')
    }
    throw err
  }
}
