import { z } from 'zod'

// ── Shared ────────────────────────────────────────────────────────────────────

/** 24-char hex MongoDB ObjectId */
export const mongoIdSchema = z
  .string({ required_error: 'ID is required' })
  .regex(/^[a-f\d]{24}$/i, 'Invalid ID — must be a 24-character hex string')

/** Trim + escape regex meta-chars to prevent injection */
const safeString = (label: string) =>
  z
    .string()
    .trim()
    .max(100, `${label} must be 100 characters or fewer`)
    .transform((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

// ── Enum constants ────────────────────────────────────────────────────────────

export const BODY_TYPES = [
  'sedan', 'suv', 'hatchback', 'coupe', 'convertible',
  'truck', 'van', 'wagon', 'crossover', 'minivan',
] as const

export const SEGMENTS = [
  'micro', 'economy', 'compact', 'mid-size',
  'full-size', 'luxury', 'sports', 'electric',
] as const

export const FUEL_TYPES   = ['petrol', 'diesel', 'electric', 'hybrid', 'cng', 'lpg'] as const
export const TRANSMISSIONS = ['manual', 'automatic', 'amt', 'cvt', 'dct'] as const
export const SORT_OPTIONS  = ['price_asc', 'price_desc', 'rating', 'newest', 'popularity'] as const

// ── Collection query (trending / popular / premium / budget) ──────────────────

export const collectionQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
})

export type CollectionQuery = z.infer<typeof collectionQuerySchema>

// ── Get all cars query ────────────────────────────────────────────────────────

export const getAllCarsQuerySchema = z
  .object({
    page:            z.coerce.number().int().min(1).default(1),
    pageSize:        z.coerce.number().int().min(1).max(50).default(12),
    make:            safeString('make').optional(),
    model:           safeString('model').optional(),
    bodyType:        z.enum(BODY_TYPES).optional(),
    segment:         z.enum(SEGMENTS).optional(),
    fuelType:        z.enum(FUEL_TYPES).optional(),
    transmission:    z.enum(TRANSMISSIONS).optional(),
    priceMin:        z.coerce.number().min(0).optional(),
    priceMax:        z.coerce.number().min(0).optional(),
    seatingCapacity: z.coerce.number().int().min(2).max(9).optional(),
    safetyStarsMin:  z.coerce.number().min(0).max(5).optional(),
    sortBy:          z.enum(SORT_OPTIONS).default('popularity'),
    q:               z.string().trim().max(200).optional(),
  })
  .refine(
    (d) => d.priceMin === undefined || d.priceMax === undefined || d.priceMin <= d.priceMax,
    { message: 'priceMin must be ≤ priceMax', path: ['priceMin'] }
  )

export type GetAllCarsQuery = z.infer<typeof getAllCarsQuerySchema>
