import { Schema, model } from 'mongoose'

import type { ICarMake } from '@cardeko/types'

const carMakeSchema = new Schema<ICarMake>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    logo: { type: String },
    country: { type: String, required: true, trim: true },
    founded: { type: Number },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

carMakeSchema.index({ slug: 1 })
carMakeSchema.index({ name: 'text' })

export const CarMake = model<ICarMake>('CarMake', carMakeSchema)
