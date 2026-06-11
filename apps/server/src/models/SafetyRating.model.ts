import { Schema, model } from 'mongoose'

import type { ISafetyRating } from '@cardeko/types'

const safetyRatingSchema = new Schema<ISafetyRating>(
  {
    variant: { type: String, ref: 'CarVariant', required: true },
    agency: {
      type: String,
      required: true,
      enum: ['GLOBAL NCAP', 'BHARAT NCAP', 'EURO NCAP', 'IIHS', 'NHTSA'],
    },
    testYear: { type: Number, required: true },
    overallStars: { type: Number, required: true, min: 0, max: 5 },
    adultOccupantPct: { type: Number, min: 0, max: 100 },
    childOccupantPct: { type: Number, min: 0, max: 100 },
    pedestrianPct: { type: Number, min: 0, max: 100 },
    safetyAssistPct: { type: Number, min: 0, max: 100 },
    testedVariantLabel: { type: String },
    reportUrl: { type: String },
  },
  { timestamps: true }
)

// A variant can only have one rating per agency per year
safetyRatingSchema.index({ variant: 1, agency: 1, testYear: 1 }, { unique: true })
safetyRatingSchema.index({ overallStars: -1 })

export const SafetyRating = model<ISafetyRating>('SafetyRating', safetyRatingSchema)
