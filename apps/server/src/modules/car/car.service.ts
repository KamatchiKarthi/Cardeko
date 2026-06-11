import type { FilterQuery, SortOrder } from 'mongoose'

import { AppError } from '../../middleware/errorHandler'
import { Review } from '../review/review.model'
import { Car } from './car.model'
import type { ICar } from './car.model'
import type {
  CollectionQuery,
  GetAllCarsQuery,
  PopularBrandsQuery,
  RecommendQuery,
} from './car.schema'

// ── Projections ───────────────────────────────────────────────────────────────

export const LIST_SELECT =
  'make model variant year slug priceExShowroom priceOnRoad bodyType segment ' +
  'fuelType transmission seatingCapacity engineDisplacementCc mileageCombinedKmpl mileageCityKmpl ' +
  'powerBhp torqueNm safetyRatingStars airbagCount tags popularityScore colors images launchedAt'

// ── Constants ─────────────────────────────────────────────────────────────────

const SORT_MAP: Record<string, Record<string, SortOrder>> = {
  price_asc: { priceExShowroom: 1 },
  price_desc: { priceExShowroom: -1 },
  rating: { safetyRatingStars: -1, popularityScore: -1 },
  newest: { year: -1, popularityScore: -1 },
  popularity: { popularityScore: -1 },
  mileage: { mileageCombinedKmpl: -1, popularityScore: -1 },
}

const PREMIUM_THRESHOLD = 2_000_000 // ≥ ₹20 lakhs
const BUDGET_THRESHOLD = 1_000_000 // ≤ ₹10 lakhs

// ── Helpers ───────────────────────────────────────────────────────────────────

const daysAgo = (n: number) => new Date(Date.now() - n * 24 * 60 * 60 * 1000)
const toSkip = (page: number, size: number) => (page - 1) * size

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
    page,
    pageSize,
    make,
    model,
    bodyType,
    bodyTypes,
    segment,
    fuelType,
    fuelTypes,
    transmission,
    priceMin,
    priceMax,
    seatingCapacity,
    seatingCapacities,
    safetyStarsMin,
    sortBy,
    q,
  } = params

  const filter: FilterQuery<ICar> = { isActive: true }

  if (q) filter.$text = { $search: q }
  if (make) filter.make = { $regex: make, $options: 'i' }
  if (model) filter.model = { $regex: model, $options: 'i' }
  if (bodyTypes?.length) {
    filter.bodyType = { $in: bodyTypes }
  } else if (bodyType) {
    filter.bodyType = bodyType
  }
  if (segment) filter.segment = segment
  if (fuelTypes?.length) {
    filter.fuelType = { $in: fuelTypes }
  } else if (fuelType) {
    filter.fuelType = fuelType
  }
  if (transmission) filter.transmission = transmission

  if (seatingCapacities?.length) {
    filter.seatingCapacity = { $in: seatingCapacities }
  } else if (seatingCapacity !== undefined) {
    filter.seatingCapacity = seatingCapacity
  }
  if (safetyStarsMin !== undefined) filter.safetyRatingStars = { $gte: safetyStarsMin }

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
      throw new AppError(
        503,
        'Text search is unavailable. Use make, model, or other filters instead.'
      )
    }
    throw err
  }
}

export async function getTrendingCars({ limit }: CollectionQuery) {
  const recent = await Car.find({ isActive: true, updatedAt: { $gte: daysAgo(7) } })
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
    $or: [{ priceExShowroom: { $gte: PREMIUM_THRESHOLD } }, { segment: 'luxury' }],
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

export async function getUpcomingLaunches({ limit }: CollectionQuery) {
  const now = new Date()
  const pickedIds: string[] = []

  const scheduled = await Car.find({ isActive: true, launchedAt: { $gte: now } })
    .sort({ launchedAt: 1 })
    .limit(limit)
    .select(LIST_SELECT)
    .lean()

  const picked = [...scheduled]
  picked.forEach((car) => pickedIds.push(String(car._id)))

  if (picked.length < limit) {
    const tagged = await Car.find({
      isActive: true,
      tags: 'future',
      _id: { $nin: pickedIds },
    })
      .sort({ popularityScore: -1 })
      .limit(limit - picked.length)
      .select(LIST_SELECT)
      .lean()

    picked.push(...tagged)
    tagged.forEach((car) => pickedIds.push(String(car._id)))
  }

  if (picked.length < limit) {
    const newest = await Car.find({ isActive: true, _id: { $nin: pickedIds } })
      .sort({ year: -1, popularityScore: -1 })
      .limit(limit - picked.length)
      .select(LIST_SELECT)
      .lean()

    picked.push(...newest)
  }

  return picked
}

const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i

export async function getCarById(idOrSlug: string) {
  const filter = OBJECT_ID_PATTERN.test(idOrSlug)
    ? { _id: idOrSlug, isActive: true }
    : { slug: idOrSlug.toLowerCase(), isActive: true }

  const car = await Car.findOne(filter).select('-__v').lean()
  if (!car) throw new AppError(404, 'Car not found')

  // Non-blocking — view tracking failure must never block a read request
  Car.updateOne({ _id: car._id }, { $inc: { popularityScore: 1 } }).catch((err) =>
    console.error(`[popularity] increment failed for car ${String(car._id)}:`, err)
  )

  return car
}

// ── Recommendation scoring ────────────────────────────────────────────────────

const MAX_SCORE = 105 // 30+25+25+15+10

/** Maps use-case → relevant body types + fuel types used to filter candidates */
const USE_CASE_BODY: Record<string, string[]> = {
  'daily-commute': ['hatchback', 'sedan', 'crossover'],
  family: ['suv', 'minivan', 'crossover'],
  'off-road': ['suv'],
  highway: ['sedan', 'suv', 'crossover'],
  city: ['hatchback', 'sedan', 'crossover'],
  cargo: ['suv', 'minivan', 'truck', 'van'],
  luxury: ['sedan', 'suv', 'coupe'],
}

/** Maps priority → field used for scoring bonus */
const PRIORITY_FIELD: Record<string, keyof ICar> = {
  safety: 'safetyRatingStars',
  mileage: 'mileageCombinedKmpl',
  performance: 'powerBhp',
  comfort: 'seatingCapacity',
  features: 'airbagCount',
  value: 'popularityScore',
}

function scoreCarForUser(car: ICar, params: RecommendQuery): number {
  let score = 0

  // Budget match — 30 pts
  if (params.budgetMax !== undefined || params.budgetMin !== undefined) {
    const min = params.budgetMin ?? 0
    const max = params.budgetMax ?? Infinity
    if (car.priceExShowroom >= min && car.priceExShowroom <= max) {
      score += 30
    }
  } else {
    score += 30 // no budget constraint → full points
  }

  // Fuel match — 25 pts
  if (params.fuelType) {
    if (car.fuelType === params.fuelType) score += 25
  } else {
    score += 25
  }

  // Use-case match — 25 pts
  if (params.useCase) {
    const allowedBodies = USE_CASE_BODY[params.useCase] ?? []
    if (allowedBodies.includes(car.bodyType)) score += 25
  } else {
    score += 25
  }

  // Seating match — 15 pts
  if (params.seating !== undefined) {
    if (car.seatingCapacity >= params.seating) score += 15
  } else {
    score += 15
  }

  // Priority match — 10 pts (car is in top-half of realistic range for that field)
  if (params.priority) {
    const field = PRIORITY_FIELD[params.priority]
    const thresholds: Record<string, number> = {
      safety: 4,
      mileage: 18,
      performance: 130,
      comfort: 5,
      features: 4,
      value: 700,
    }
    const val = field !== undefined ? (car[field] as number | undefined) : undefined
    if (val !== undefined && val >= (thresholds[params.priority] ?? 0)) score += 10
  } else {
    score += 10
  }

  return score
}

export interface RecommendResult {
  car: Partial<ICar> & { _id: unknown }
  score: number
  matchPercent: number
}

export async function getRecommendations(params: RecommendQuery): Promise<RecommendResult[]> {
  // Build a loose pre-filter to reduce candidates — full scoring done in JS
  const filter: FilterQuery<ICar> = { isActive: true }

  const priceFilter: { $gte?: number; $lte?: number } = {}
  if (params.budgetMin !== undefined) priceFilter.$gte = params.budgetMin * 0.85
  if (params.budgetMax !== undefined) priceFilter.$lte = params.budgetMax * 1.15
  if (Object.keys(priceFilter).length > 0) filter.priceExShowroom = priceFilter
  if (params.fuelType) filter.fuelType = params.fuelType
  if (params.seating) filter.seatingCapacity = { $gte: params.seating }

  // Fetch candidate pool (up to 200) — scoring is fast in-process
  const candidates = await Car.find(filter)
    .select(
      LIST_SELECT +
        ' fuelType bodyType seatingCapacity safetyRatingStars mileageCombinedKmpl powerBhp airbagCount'
    )
    .limit(200)
    .lean()

  const scored: RecommendResult[] = candidates
    .map((car) => {
      const s = scoreCarForUser(car as ICar, params)
      return { car, score: s, matchPercent: Math.round((s / MAX_SCORE) * 100) }
    })
    .filter((r) => r.score > 0)

  scored.sort(
    (a, b) => b.score - a.score || (b.car.popularityScore ?? 0) - (a.car.popularityScore ?? 0)
  )

  return scored.slice(0, 5)
}

const NCAP_AGENCIES = ['GLOBAL NCAP', 'BHARAT NCAP', 'EURO NCAP'] as const

interface BrandAccumulator {
  make: string
  models: Map<string, number>
  startingPrice: number
  totalPopularity: number
}

function toBrandSlug(make: string): string {
  return make
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
}

export async function getPopularBrands({ bodyType, limit }: PopularBrandsQuery) {
  const filter: FilterQuery<ICar> = { isActive: true }
  if (bodyType) filter.bodyType = bodyType

  const cars = await Car.find(filter).select('make model priceExShowroom popularityScore').lean()

  const brandMap = new Map<string, BrandAccumulator>()

  for (const car of cars) {
    const existing = brandMap.get(car.make)
    if (!existing) {
      brandMap.set(car.make, {
        make: car.make,
        models: new Map([[car.model, car.popularityScore]]),
        startingPrice: car.priceExShowroom,
        totalPopularity: car.popularityScore,
      })
      continue
    }

    const modelPopularity = existing.models.get(car.model) ?? 0
    if (car.popularityScore > modelPopularity) {
      existing.models.set(car.model, car.popularityScore)
    }

    existing.startingPrice = Math.min(existing.startingPrice, car.priceExShowroom)
    existing.totalPopularity += car.popularityScore
  }

  return Array.from(brandMap.values())
    .map((brand) => ({
      make: brand.make,
      slug: toBrandSlug(brand.make),
      modelCount: brand.models.size,
      startingPrice: brand.startingPrice,
      topModels: Array.from(brand.models.entries())
        .sort((left, right) => right[1] - left[1])
        .slice(0, 3)
        .map(([modelName]) => modelName),
      totalPopularity: brand.totalPopularity,
    }))
    .sort((left, right) => right.totalPopularity - left.totalPopularity)
    .slice(0, limit)
}

export async function getHomeStats() {
  const [totalCars, fiveStarSafetyCount, totalReviews, priceBounds] = await Promise.all([
    Car.countDocuments({ isActive: true }),
    Car.countDocuments({
      isActive: true,
      safetyRatingStars: 5,
      safetyRatingAgency: { $in: NCAP_AGENCIES },
    }),
    Review.countDocuments({ isActive: true }),
    Car.aggregate<{ min: number; max: number }>([
      { $match: { isActive: true } },
      {
        $group: { _id: null, min: { $min: '$priceExShowroom' }, max: { $max: '$priceExShowroom' } },
      },
    ]),
  ])

  const bounds = priceBounds[0]

  return {
    totalCars,
    priceRangeMinLakhs: Math.floor((bounds?.min ?? 500_000) / 100_000),
    priceRangeMaxLakhs: Math.ceil((bounds?.max ?? 5_000_000) / 100_000),
    fiveStarSafetyCount,
    totalReviews,
  }
}

/** Lightweight check used by review service — does NOT increment popularity. */
export async function assertCarExists(id: string): Promise<void> {
  const exists = await Car.exists({ _id: id, isActive: true })
  if (!exists) throw new AppError(404, 'Car not found')
}
