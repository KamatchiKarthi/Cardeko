import type { FilterQuery, SortOrder } from 'mongoose'

import { AppError } from '../../middleware/errorHandler'
import { Car } from './car.model'
import type { ICar } from './car.model'
import type { CollectionQuery, GetAllCarsQuery } from './car.schema'

// ── Projections ───────────────────────────────────────────────────────────────

export const LIST_SELECT =
  'make model variant year slug priceExShowroom priceOnRoad bodyType segment ' +
  'fuelType transmission seatingCapacity mileageCombinedKmpl mileageCityKmpl ' +
  'powerBhp torqueNm safetyRatingStars airbagCount tags popularityScore colors images'

// ── Constants ─────────────────────────────────────────────────────────────────

const SORT_MAP: Record<string, Record<string, SortOrder>> = {
  price_asc:  { priceExShowroom: 1 },
  price_desc: { priceExShowroom: -1 },
  rating:     { safetyRatingStars: -1, popularityScore: -1 },
  newest:     { year: -1, popularityScore: -1 },
  popularity: { popularityScore: -1 },
}

const PREMIUM_THRESHOLD = 2_500_000 // ≥ ₹25 lakhs
const BUDGET_THRESHOLD  = 1_000_000 // ≤ ₹10 lakhs

// ── Helpers ───────────────────────────────────────────────────────────────────

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000)
const toSkip  = (page: number, size: number) => (page - 1) * size

/** MongoDB throws code 27 when $text is used without a text index on the collection. */
function isTextIndexMissing(err: unknown): boolean {
  return (
    err instanceof Error &&
    (err.message.toLowerCase().includes('text index required') ||
      ('code' in err && (err as { code: unknown }).code === 27))
  )
}

// ── Car queries ───────────────────────────────────────────────────────────────

export async function getAllCars(params: GetAllCarsQuery) {
  const {
    page, pageSize, make, model, bodyType, segment,
    fuelType, transmission, priceMin, priceMax,
    seatingCapacity, safetyStarsMin, sortBy, q,
  } = params

  const filter: FilterQuery<ICar> = { isActive: true }

  if (q)            filter.$text           = { $search: q }
  if (make)         filter.make            = { $regex: make,  $options: 'i' }
  if (model)        filter.model           = { $regex: model, $options: 'i' }
  if (bodyType)     filter.bodyType        = bodyType
  if (segment)      filter.segment         = segment
  if (fuelType)     filter.fuelType        = fuelType
  if (transmission) filter.transmission    = transmission

  if (seatingCapacity !== undefined) filter.seatingCapacity   = seatingCapacity
  if (safetyStarsMin  !== undefined) filter.safetyRatingStars = { $gte: safetyStarsMin }

  if (priceMin !== undefined || priceMax !== undefined) {
    filter.priceExShowroom = {
      ...(priceMin !== undefined && { $gte: priceMin }),
      ...(priceMax !== undefined && { $lte: priceMax }),
    }
  }

  const sort = SORT_MAP[sortBy] ?? SORT_MAP['popularity']
  const skip = toSkip(page, pageSize)

  try {
    const [data, total] = await Promise.all([
      Car.find(filter).sort(sort).skip(skip).limit(pageSize).select(LIST_SELECT).lean(),
      Car.countDocuments(filter),
    ])
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
  } catch (err) {
    if (isTextIndexMissing(err)) {
      throw new AppError(503, 'Text search is unavailable. Use make, model, or other filters instead.')
    }
    throw err
  }
}

export async function getTrendingCars({ limit }: CollectionQuery) {
  const recent = await Car.find({ isActive: true, updatedAt: { $gte: daysAgo(30) } })
    .sort({ popularityScore: -1 })
    .limit(limit)
    .select(LIST_SELECT)
    .lean()

  if (recent.length > 0) return recent

  // Fallback: no activity in last 30 days → return all-time popular
  return Car.find({ isActive: true })
    .sort({ popularityScore: -1 })
    .limit(limit)
    .select(LIST_SELECT)
    .lean()
}

export async function getPopularCars({ limit }: CollectionQuery) {
  return Car.find({ isActive: true })
    .sort({ popularityScore: -1 })
    .limit(limit)
    .select(LIST_SELECT)
    .lean()
}

export async function getPremiumCars({ limit }: CollectionQuery) {
  return Car.find({
    isActive: true,
    $or: [
      { priceExShowroom: { $gte: PREMIUM_THRESHOLD } },
      { segment: 'luxury' },
    ],
  })
    .sort({ popularityScore: -1 })
    .limit(limit)
    .select(LIST_SELECT)
    .lean()
}

export async function getBudgetCars({ limit }: CollectionQuery) {
  return Car.find({ isActive: true, priceExShowroom: { $lte: BUDGET_THRESHOLD } })
    .sort({ popularityScore: -1 })
    .limit(limit)
    .select(LIST_SELECT)
    .lean()
}

export async function getCarById(id: string) {
  const car = await Car.findOne({ _id: id, isActive: true }).select('-__v').lean()
  if (!car) throw new AppError(404, 'Car not found')

  // Non-blocking — view tracking failure must never block a read request
  Car.updateOne({ _id: id }, { $inc: { popularityScore: 1 } }).catch((err) =>
    console.error(`[popularity] increment failed for car ${id}:`, err)
  )

  return car
}

/** Lightweight check used by review service — does NOT increment popularity. */
export async function assertCarExists(id: string): Promise<void> {
  const exists = await Car.exists({ _id: id, isActive: true })
  if (!exists) throw new AppError(404, 'Car not found')
}
