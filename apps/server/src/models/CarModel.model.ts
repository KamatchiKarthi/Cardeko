import { Schema, Types, model } from 'mongoose'

import type { ICarModel } from '@cardeko/types'

const carModelSchema = new Schema<ICarModel>(
  {
    make: { type: String, ref: 'CarMake', required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    bodyType: {
      type: String,
      required: true,
      enum: ['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'truck', 'van', 'wagon', 'minivan', 'crossover'],
    },
    segment: {
      type: String,
      required: true,
      enum: ['micro', 'economy', 'compact', 'mid-size', 'full-size', 'luxury', 'sports', 'electric'],
    },
    description: { type: String },
    thumbnail: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Compound unique: same model name can't repeat under same make
carModelSchema.index({ make: 1, slug: 1 }, { unique: true })
carModelSchema.index({ bodyType: 1, segment: 1 })
carModelSchema.index({ name: 'text', description: 'text' })

export const CarModel = model<ICarModel>('CarModel', carModelSchema)
