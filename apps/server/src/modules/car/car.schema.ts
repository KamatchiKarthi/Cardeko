import { z } from 'zod'

// ── Shared ────────────────────────────────────────────────────────────────────

/** 24-char hex MongoDB ObjectId */
export const mongoIdSchema = z
  .string({ required_error: 'ID is required' })
  .regex(/^[a-f\d]{24}$/i, 'Invalid ID — must be a 24-character hex string')

/** MongoDB ObjectId or URL slug */
export const carIdOrSlugSchema = z.union([
  mongoIdSchema,
  z
    .string()
    .min(2, 'Slug is too short')
    .max(120, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i, 'Invalid car slug'),
])

/** Trim + escape regex meta-chars to prevent injection */
const safeString = (label: string) =>
  z
    .string()
    .trim()
    .max(100, `${label} must be 100 characters or fewer`)
    .transform((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

// ── Enum constants ────────────────────────────────────────────────────────────

export const BODY_TYPES = [
  'sedan',
  'suv',
  'hatchback',
  'coupe',
  'convertible',
  'truck',
  'van',
  'wagon',
  'crossover',
  'minivan',
] as const

export const SEGMENTS = [
  'micro',
  'economy',
  'compact',
  'mid-size',
  'full-size',
  'luxury',
  'sports',
  'electric',
] as const

export const FUEL_TYPES = ['petrol', 'diesel', 'electric', 'hybrid', 'cng', 'lpg'] as const
export const TRANSMISSIONS = ['manual', 'automatic', 'amt', 'cvt', 'dct'] as const
export const SORT_OPTIONS = [
  'price_asc',
  'price_desc',
  'rating',
  'newest',
  'popularity',
  'mileage',
] as const

const csvBodyTypes = z
  .string()
  .optional()
  .transform((value) => {
    if (!value) return undefined
    const parts = value
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
    return parts.length > 0 ? parts : undefined
  })
  .pipe(z.array(z.enum(BODY_TYPES)).optional())

const csvFuelTypes = z
  .string()
  .optional()
  .transform((value) => {
    if (!value) return undefined
    const parts = value
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
    return parts.length > 0 ? parts : undefined
  })
  .pipe(z.array(z.enum(FUEL_TYPES)).optional())

const csvSeating = z
  .string()
  .optional()
  .transform((value) => {
    if (!value) return undefined
    const parts = value
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
    return parts.length > 0 ? parts : undefined
  })
  .pipe(z.array(z.coerce.number().int().min(2).max(9)).optional())

// ── Collection query (trending / popular / premium / budget) ──────────────────

export const collectionQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
})

export type CollectionQuery = z.infer<typeof collectionQuerySchema>

// ── Popular brands query ──────────────────────────────────────────────────────

export const popularBrandsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(30).default(12),
  bodyType: z.enum(BODY_TYPES).optional(),
})

export type PopularBrandsQuery = z.infer<typeof popularBrandsQuerySchema>

// ── Get all cars query ────────────────────────────────────────────────────────

export const getAllCarsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(50).default(12),
    make: safeString('make').optional(),
    model: safeString('model').optional(),
    bodyType: z.enum(BODY_TYPES).optional(),
    bodyTypes: csvBodyTypes,
    segment: z.enum(SEGMENTS).optional(),
    fuelType: z.enum(FUEL_TYPES).optional(),
    fuelTypes: csvFuelTypes,
    transmission: z.enum(TRANSMISSIONS).optional(),
    priceMin: z.coerce.number().min(0).optional(),
    priceMax: z.coerce.number().min(0).optional(),
    seatingCapacity: z.coerce.number().int().min(2).max(9).optional(),
    seatingCapacities: csvSeating,
    safetyStarsMin: z.coerce.number().min(0).max(5).optional(),
    sortBy: z.enum(SORT_OPTIONS).default('popularity'),
    q: z.string().trim().max(200).optional(),
  })
  .refine((d) => d.priceMin === undefined || d.priceMax === undefined || d.priceMin <= d.priceMax, {
    message: 'priceMin must be ≤ priceMax',
    path: ['priceMin'],
  })

export type GetAllCarsQuery = z.infer<typeof getAllCarsQuerySchema>

// ── Recommendation query ──────────────────────────────────────────────────────

export const USE_CASES = [
  'daily-commute',
  'family',
  'off-road',
  'highway',
  'city',
  'cargo',
  'luxury',
] as const

export const PRIORITIES = [
  'safety',
  'mileage',
  'performance',
  'comfort',
  'features',
  'value',
] as const

export const recommendQuerySchema = z.object({
  budgetMin: z.coerce.number().min(0).optional(),
  budgetMax: z.coerce.number().min(0).optional(),
  useCase: z.enum(USE_CASES).optional(),
  fuelType: z.enum(FUEL_TYPES).optional(),
  seating: z.coerce.number().int().min(2).max(9).optional(),
  priority: z.enum(PRIORITIES).optional(),
})

export type RecommendQuery = z.infer<typeof recommendQuerySchema>
