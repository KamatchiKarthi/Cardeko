import { z } from 'zod'

// ── Pagination ────────────────────────────────────────────────────────────────

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  sortBy: z.enum(['newest', 'rating']).default('newest'),
})

export type PaginationQuery = z.infer<typeof paginationQuerySchema>

// ── Review body ───────────────────────────────────────────────────────────────

/** Strip HTML tags and HTML entities to prevent stored XSS. */
const stripHtml = (s: string) =>
  s
    .replace(/<[^>]*>/g, '')
    .replace(/&[a-z#\d]+;/gi, ' ')
    .trim()

/** Integer-only rating 1–5. */
const intRating = (label: string) =>
  z
    .number({
      required_error: `${label} rating is required`,
      invalid_type_error: `${label} must be a number`,
    })
    .int(`${label} rating must be a whole number (1–5)`)
    .min(1, `${label} must be at least 1`)
    .max(5, `${label} must be at most 5`)

export const createReviewSchema = z
  .object({
    userId: z
      .string({ required_error: 'userId is required' })
      .trim()
      .min(1, 'userId cannot be empty')
      .max(100, 'userId must be 100 characters or fewer'),

    ratings: z.object({
      overall: intRating('overall'),
      comfort: intRating('comfort').optional(),
      performance: intRating('performance').optional(),
      fuelEfficiency: intRating('fuelEfficiency').optional(),
      valueForMoney: intRating('valueForMoney').optional(),
      maintenance: intRating('maintenance').optional(),
    }),

    title: z
      .string({ required_error: 'Title is required' })
      .trim()
      .min(5, 'Title needs at least 5 characters')
      .max(150, 'Title must be 150 characters or fewer')
      .transform(stripHtml),

    body: z
      .string({ required_error: 'Review body is required' })
      .trim()
      .min(20, 'Review body needs at least 20 characters')
      .max(5000, 'Review body must be 5000 characters or fewer')
      .transform(stripHtml),

    pros: z
      .array(
        z
          .string()
          .trim()
          .min(1, 'Pro cannot be empty')
          .max(200, 'Each pro must be 200 characters or fewer')
      )
      .max(10, 'Maximum 10 pros allowed')
      .default([]),

    cons: z
      .array(
        z
          .string()
          .trim()
          .min(1, 'Con cannot be empty')
          .max(200, 'Each con must be 200 characters or fewer')
      )
      .max(10, 'Maximum 10 cons allowed')
      .default([]),

    ownershipMonths: z.number().int().min(0).max(600).optional(),
    kmDriven: z.number().min(0).max(10_000_000).optional(),
  })
  .refine((d) => new Set(d.pros).size === d.pros.length, {
    message: 'Pros list contains duplicate entries',
    path: ['pros'],
  })
  .refine((d) => new Set(d.cons).size === d.cons.length, {
    message: 'Cons list contains duplicate entries',
    path: ['cons'],
  })
  .refine((d) => d.title.length >= 5, {
    message: 'Title is too short after sanitization (min 5 characters)',
    path: ['title'],
  })
  .refine((d) => d.body.length >= 20, {
    message: 'Review body is too short after sanitization (min 20 characters)',
    path: ['body'],
  })

export type CreateReviewDto = z.infer<typeof createReviewSchema>
