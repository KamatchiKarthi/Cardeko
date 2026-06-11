import { Schema, model } from 'mongoose'

export interface IReview {
  car: string
  user: string
  ratings: {
    overall: number
    comfort?: number
    performance?: number
    fuelEfficiency?: number
    valueForMoney?: number
    maintenance?: number
  }
  title: string
  body: string
  pros: string[]
  cons: string[]
  ownershipMonths?: number
  kmDriven?: number
  verified: boolean
  helpfulCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ratingsSchema = new Schema(
  {
    overall:        { type: Number, required: true, min: 1, max: 5 },
    comfort:        { type: Number, min: 1, max: 5 },
    performance:    { type: Number, min: 1, max: 5 },
    fuelEfficiency: { type: Number, min: 1, max: 5 },
    valueForMoney:  { type: Number, min: 1, max: 5 },
    maintenance:    { type: Number, min: 1, max: 5 },
  },
  { _id: false }
)

const reviewSchema = new Schema<IReview>(
  {
    car:             { type: String, ref: 'Car', required: true, index: true },
    user:            { type: String, required: true, index: true },
    ratings:         { type: ratingsSchema, required: true },
    title:           { type: String, required: true, trim: true, maxlength: 150 },
    body:            { type: String, required: true, trim: true, maxlength: 5000 },
    pros:            { type: [String], default: [] },
    cons:            { type: [String], default: [] },
    ownershipMonths: { type: Number, min: 0 },
    kmDriven:        { type: Number, min: 0 },
    verified:        { type: Boolean, default: false },
    helpfulCount:    { type: Number, default: 0 },
    isActive:        { type: Boolean, default: true },
  },
  { timestamps: true }
)

reviewSchema.index({ car: 1, user: 1 }, { unique: true })
reviewSchema.index({ car: 1, 'ratings.overall': -1 })
reviewSchema.index({ car: 1, createdAt: -1 })
reviewSchema.index({ title: 'text', body: 'text' })

export const Review = model<IReview>('Review', reviewSchema)
