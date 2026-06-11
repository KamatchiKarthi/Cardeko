import { Schema, model } from 'mongoose'

export interface ICar {
  // Identity
  make: string
  model: string
  variant: string
  year: number
  slug: string

  // Pricing (INR)
  priceExShowroom: number
  priceOnRoad?: number

  // Core specs
  bodyType:
    | 'sedan'
    | 'suv'
    | 'hatchback'
    | 'coupe'
    | 'convertible'
    | 'truck'
    | 'van'
    | 'wagon'
    | 'crossover'
    | 'minivan'
  segment:
    | 'micro'
    | 'economy'
    | 'compact'
    | 'mid-size'
    | 'full-size'
    | 'luxury'
    | 'sports'
    | 'electric'
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng' | 'lpg'
  transmission: 'manual' | 'automatic' | 'amt' | 'cvt' | 'dct'
  drivetrain: 'fwd' | 'rwd' | 'awd' | '4wd'
  seatingCapacity: number

  // Engine & performance
  engineDisplacementCc?: number
  powerBhp?: number
  torqueNm?: number
  acceleration0to100Sec?: number
  topSpeedKph?: number
  batteryKwh?: number
  electricRangeKm?: number

  // Fuel economy
  mileageCityKmpl?: number
  mileageHighwayKmpl?: number
  mileageCombinedKmpl?: number
  fuelTankLitres?: number

  // Dimensions
  lengthMm?: number
  widthMm?: number
  heightMm?: number
  wheelbaseMm?: number
  groundClearanceMm?: number
  kerbWeightKg?: number
  bootSpaceLitres?: number

  // Safety
  safetyRatingStars?: number
  safetyRatingAgency?: 'GLOBAL NCAP' | 'BHARAT NCAP' | 'EURO NCAP' | 'IIHS' | 'NHTSA'
  safetyRatingYear?: number
  airbagCount?: number

  // Features
  features: string[]
  adasFeatures: string[]

  // Discovery
  tags: string[]
  popularityScore: number
  colors: string[]
  images: string[]

  // Status
  isActive: boolean
  launchedAt?: Date
  discontinuedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const carSchema = new Schema<ICar>(
  {
    make: { type: String, required: true, trim: true, index: true },
    model: { type: String, required: true, trim: true, index: true },
    variant: { type: String, required: true, trim: true },
    year: { type: Number, required: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },

    priceExShowroom: { type: Number, required: true },
    priceOnRoad: { type: Number },

    bodyType: {
      type: String,
      required: true,
      index: true,
      enum: [
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
      ],
    },
    segment: {
      type: String,
      required: true,
      index: true,
      enum: [
        'micro',
        'economy',
        'compact',
        'mid-size',
        'full-size',
        'luxury',
        'sports',
        'electric',
      ],
    },
    fuelType: {
      type: String,
      required: true,
      index: true,
      enum: ['petrol', 'diesel', 'electric', 'hybrid', 'cng', 'lpg'],
    },
    transmission: {
      type: String,
      required: true,
      index: true,
      enum: ['manual', 'automatic', 'amt', 'cvt', 'dct'],
    },
    drivetrain: { type: String, default: 'fwd', enum: ['fwd', 'rwd', 'awd', '4wd'] },
    seatingCapacity: { type: Number, required: true, index: true },

    engineDisplacementCc: { type: Number },
    powerBhp: { type: Number },
    torqueNm: { type: Number },
    acceleration0to100Sec: { type: Number },
    topSpeedKph: { type: Number },
    batteryKwh: { type: Number },
    electricRangeKm: { type: Number },

    mileageCityKmpl: { type: Number },
    mileageHighwayKmpl: { type: Number },
    mileageCombinedKmpl: { type: Number },
    fuelTankLitres: { type: Number },

    lengthMm: { type: Number },
    widthMm: { type: Number },
    heightMm: { type: Number },
    wheelbaseMm: { type: Number },
    groundClearanceMm: { type: Number },
    kerbWeightKg: { type: Number },
    bootSpaceLitres: { type: Number },

    safetyRatingStars: { type: Number, min: 0, max: 5, index: true },
    safetyRatingAgency: {
      type: String,
      enum: ['GLOBAL NCAP', 'BHARAT NCAP', 'EURO NCAP', 'IIHS', 'NHTSA'],
    },
    safetyRatingYear: { type: Number },
    airbagCount: { type: Number },

    features: { type: [String], default: [] },
    adasFeatures: { type: [String], default: [] },

    tags: { type: [String], default: [], index: true },
    popularityScore: { type: Number, default: 0, index: true },
    colors: { type: [String], default: [] },
    images: { type: [String], default: [] },

    isActive: { type: Boolean, default: true, index: true },
    launchedAt: { type: Date },
    discontinuedAt: { type: Date },
  },
  { timestamps: true }
)

carSchema.index({ priceExShowroom: 1, fuelType: 1 })
carSchema.index({ bodyType: 1, priceExShowroom: 1 })
carSchema.index({ make: 1, model: 1, year: -1 })
carSchema.index({ segment: 1, popularityScore: -1 })
carSchema.index({ safetyRatingStars: -1, priceExShowroom: 1 })
carSchema.index({ make: 'text', model: 'text', variant: 'text', tags: 'text', features: 'text' })

export const Car = model<ICar>('Car', carSchema)
