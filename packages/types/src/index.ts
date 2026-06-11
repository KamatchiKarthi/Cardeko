// ─── Primitives ──────────────────────────────────────────────────────────────

export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'cng' | 'lpg'
export type TransmissionType = 'manual' | 'automatic' | 'amt' | 'cvt' | 'dct'
export type DrivetrainType = 'fwd' | 'rwd' | 'awd' | '4wd'
export type BodyType = 'sedan' | 'suv' | 'hatchback' | 'coupe' | 'convertible' | 'truck' | 'van' | 'wagon' | 'minivan' | 'crossover'
export type CarSegment = 'micro' | 'economy' | 'compact' | 'mid-size' | 'full-size' | 'luxury' | 'sports' | 'electric'
export type SafetyAgency = 'GLOBAL NCAP' | 'BHARAT NCAP' | 'EURO NCAP' | 'IIHS' | 'NHTSA'
export type ReviewRatingKey = 'overall' | 'comfort' | 'performance' | 'fuelEfficiency' | 'valueForMoney' | 'maintenance'

// ─── Car Make ─────────────────────────────────────────────────────────────────

export interface ICarMake {
  _id: string
  name: string        // "Toyota"
  slug: string        // "toyota"
  logo?: string       // CDN URL
  country: string     // "Japan"
  founded?: number    // 1937
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// ─── Car Model ───────────────────────────────────────────────────────────────

export interface ICarModel {
  _id: string
  make: string        // ref → CarMake._id
  name: string        // "Corolla"
  slug: string        // "corolla"
  bodyType: BodyType
  segment: CarSegment
  description?: string
  thumbnail?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// ─── Car Variant ──────────────────────────────────────────────────────────────

export interface IEngineSpecs {
  displacement?: number     // cc
  cylinders?: number
  powerBhp?: number         // brake horsepower
  torqueNm?: number
  fuelType: FuelType
  batteryKwh?: number       // for EVs
  rangeKm?: number          // for EVs
}

export interface IDimensionSpecs {
  lengthMm?: number
  widthMm?: number
  heightMm?: number
  wheelbaseMm?: number
  groundClearanceMm?: number
  kerbWeightKg?: number
  bootLitres?: number
  seatingCapacity: number
}

export interface IPerformanceSpecs {
  topSpeedKph?: number
  acceleration0to100Sec?: number
}

export interface IFuelEconomy {
  cityKmpl?: number
  highwayKmpl?: number
  combinedKmpl?: number
  fuelTankLitres?: number
}

export interface ICarSpecs {
  engine: IEngineSpecs
  transmission: TransmissionType
  drivetrain?: DrivetrainType
  dimensions: IDimensionSpecs
  performance?: IPerformanceSpecs
  fuelEconomy?: IFuelEconomy
}

export interface ICarFeatures {
  safety: string[]        // ["ABS", "6 Airbags", "ESC", "TPMS"]
  comfort: string[]       // ["Sunroof", "Ventilated Seats"]
  infotainment: string[]  // ["10-inch touchscreen", "Apple CarPlay"]
  exterior: string[]      // ["LED Headlamps", "Alloy Wheels"]
  adas?: string[]         // ["Lane Assist", "Auto Emergency Braking"]
}

export interface ICarVariant {
  _id: string
  model: string           // ref → CarModel._id
  name: string            // "VXI 1.2L AMT"
  slug: string            // "vxi-1-2l-amt"
  year: number            // launch/model year
  priceMin: number        // ex-showroom min (INR)
  priceMax: number        // ex-showroom max (INR)
  specs: ICarSpecs
  features: ICarFeatures
  colors: string[]
  images: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// ─── Safety Rating ────────────────────────────────────────────────────────────

export interface ISafetyRating {
  _id: string
  variant: string           // ref → CarVariant._id
  agency: SafetyAgency
  testYear: number
  overallStars: number      // 0–5
  adultOccupantPct?: number
  childOccupantPct?: number
  pedestrianPct?: number
  safetyAssistPct?: number
  testedVariantLabel?: string  // e.g. "1.5L base petrol"
  reportUrl?: string
  createdAt: Date
  updatedAt: Date
}

// ─── Review ──────────────────────────────────────────────────────────────────

export interface IReviewRatings {
  overall: number           // 1–5
  comfort?: number
  performance?: number
  fuelEfficiency?: number
  valueForMoney?: number
  maintenance?: number
}

export interface IReview {
  _id: string
  variant: string           // ref → CarVariant._id
  user: string              // ref → User._id
  ratings: IReviewRatings
  title: string
  body: string
  pros: string[]
  cons: string[]
  ownershipMonths?: number
  kmDriven?: number
  verified: boolean         // verified owner
  helpfulCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface IUser {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'buyer' | 'seller' | 'admin'
  avatarUrl?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// ─── API Helpers ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ─── Search / Filter ─────────────────────────────────────────────────────────

export interface CarSearchParams {
  make?: string
  model?: string
  bodyType?: BodyType
  segment?: CarSegment
  fuelType?: FuelType
  transmission?: TransmissionType
  yearMin?: number
  yearMax?: number
  priceMin?: number
  priceMax?: number
  seatingCapacity?: number
  safetyStarsMin?: number
  page?: number
  pageSize?: number
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest'
}
