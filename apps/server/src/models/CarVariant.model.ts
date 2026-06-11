import { Schema, model } from 'mongoose'

import type { ICarVariant } from '@cardeko/types'

const engineSpecsSchema = new Schema(
  {
    displacement: { type: Number },       // cc
    cylinders: { type: Number },
    powerBhp: { type: Number },
    torqueNm: { type: Number },
    fuelType: {
      type: String,
      required: true,
      enum: ['petrol', 'diesel', 'electric', 'hybrid', 'cng', 'lpg'],
    },
    batteryKwh: { type: Number },         // EVs
    rangeKm: { type: Number },            // EVs
  },
  { _id: false }
)

const dimensionSpecsSchema = new Schema(
  {
    lengthMm: { type: Number },
    widthMm: { type: Number },
    heightMm: { type: Number },
    wheelbaseMm: { type: Number },
    groundClearanceMm: { type: Number },
    kerbWeightKg: { type: Number },
    bootLitres: { type: Number },
    seatingCapacity: { type: Number, required: true },
  },
  { _id: false }
)

const performanceSpecsSchema = new Schema(
  {
    topSpeedKph: { type: Number },
    acceleration0to100Sec: { type: Number },
  },
  { _id: false }
)

const fuelEconomySchema = new Schema(
  {
    cityKmpl: { type: Number },
    highwayKmpl: { type: Number },
    combinedKmpl: { type: Number },
    fuelTankLitres: { type: Number },
  },
  { _id: false }
)

const specsSchema = new Schema(
  {
    engine: { type: engineSpecsSchema, required: true },
    transmission: {
      type: String,
      required: true,
      enum: ['manual', 'automatic', 'amt', 'cvt', 'dct'],
    },
    drivetrain: { type: String, enum: ['fwd', 'rwd', 'awd', '4wd'] },
    dimensions: { type: dimensionSpecsSchema, required: true },
    performance: { type: performanceSpecsSchema },
    fuelEconomy: { type: fuelEconomySchema },
  },
  { _id: false }
)

const featuresSchema = new Schema(
  {
    safety: { type: [String], default: [] },
    comfort: { type: [String], default: [] },
    infotainment: { type: [String], default: [] },
    exterior: { type: [String], default: [] },
    adas: { type: [String], default: [] },
  },
  { _id: false }
)

const carVariantSchema = new Schema<ICarVariant>(
  {
    model: { type: String, ref: 'CarModel', required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    year: { type: Number, required: true },
    priceMin: { type: Number, required: true },
    priceMax: { type: Number, required: true },
    specs: { type: specsSchema, required: true },
    features: { type: featuresSchema, required: true },
    colors: { type: [String], default: [] },
    images: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

// Compound unique: same variant slug per model
carVariantSchema.index({ model: 1, slug: 1 }, { unique: true })
carVariantSchema.index({ model: 1, year: 1 })
// Filter indexes — the most common search paths
carVariantSchema.index({ 'specs.engine.fuelType': 1 })
carVariantSchema.index({ 'specs.transmission': 1 })
carVariantSchema.index({ priceMin: 1, priceMax: 1 })
carVariantSchema.index({ year: -1 })

export const CarVariant = model<ICarVariant>('CarVariant', carVariantSchema)
