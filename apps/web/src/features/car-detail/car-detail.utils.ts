import type {
  BodyType,
  FuelType,
  ICar,
  ICarReview,
  IReviewRatings,
  QuizAnswers,
  UseCase,
} from '@cardeko/types'

import { FUEL_TYPE_LABELS } from '@/utils/car.utils'

const USE_CASE_BODY: Record<UseCase, BodyType[]> = {
  'daily-commute': ['hatchback', 'sedan', 'crossover'],
  family: ['suv', 'minivan', 'crossover'],
  'off-road': ['suv'],
  highway: ['sedan', 'suv', 'crossover'],
  city: ['hatchback', 'sedan', 'crossover'],
  cargo: ['suv', 'minivan', 'truck', 'van'],
  luxury: ['sedan', 'suv', 'coupe'],
}

const BODY_TYPE_LABELS: Record<BodyType, string> = {
  sedan: 'Sedan',
  suv: 'SUV',
  hatchback: 'Hatchback',
  coupe: 'Coupe',
  convertible: 'Convertible',
  truck: 'Truck',
  van: 'Van',
  wagon: 'Wagon',
  minivan: 'MUV',
  crossover: 'Crossover',
}

export interface CarDetailBadge {
  label: string
  variant: 'success' | 'accent' | 'warning' | 'default'
}

export interface CarSpecRow {
  label: string
  value: string
}

export interface CarSpecSection {
  title: string
  rows: CarSpecRow[]
}

export function getCarDetailBadge(car: ICar): CarDetailBadge {
  if (car.safetyRatingStars && car.safetyRatingStars >= 5) {
    return { label: '5★ Safety', variant: 'success' }
  }
  if (car.popularityScore >= 800) {
    return { label: 'Popular pick', variant: 'accent' }
  }
  if (car.tags.length > 0) {
    return {
      label: car.tags[0]
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      variant: 'default',
    }
  }
  return { label: BODY_TYPE_LABELS[car.bodyType], variant: 'default' }
}

export function computeCarDetailMatchPercent(car: ICar, quizAnswers: QuizAnswers | null): number {
  if (!quizAnswers) {
    return Math.min(95, Math.max(60, Math.round((car.popularityScore / 1000) * 100)))
  }

  let score = 0
  let maxScore = 0

  if (quizAnswers.budget) {
    maxScore += 30
    const { budgetMin, budgetMax } = quizAnswers.budget
    if (car.priceExShowroom >= budgetMin && car.priceExShowroom <= budgetMax) score += 30
  }

  if (quizAnswers.fuelType) {
    maxScore += 25
    if (car.fuelType === quizAnswers.fuelType) score += 25
  }

  if (quizAnswers.useCase) {
    maxScore += 25
    const allowedBodies = USE_CASE_BODY[quizAnswers.useCase] ?? []
    if (allowedBodies.includes(car.bodyType)) score += 25
  }

  if (quizAnswers.seating) {
    maxScore += 15
    if (car.seatingCapacity >= quizAnswers.seating) score += 15
  }

  if (quizAnswers.priority) {
    maxScore += 10
    const priorityMet = isPriorityMet(car, quizAnswers.priority)
    if (priorityMet) score += 10
  }

  if (maxScore === 0) {
    return Math.min(95, Math.max(60, Math.round((car.popularityScore / 1000) * 100)))
  }

  return Math.min(99, Math.round((score / maxScore) * 100))
}

function isPriorityMet(car: ICar, priority: NonNullable<QuizAnswers['priority']>): boolean {
  switch (priority) {
    case 'safety':
      return (car.safetyRatingStars ?? 0) >= 4
    case 'mileage':
      return (car.mileageCombinedKmpl ?? 0) >= 18
    case 'performance':
      return (car.powerBhp ?? 0) >= 130
    case 'comfort':
      return car.seatingCapacity >= 5
    case 'features':
      return (car.airbagCount ?? 0) >= 4
    case 'value':
      return car.popularityScore >= 700
    default:
      return false
  }
}

export function getWhyMatchedBullets(car: ICar, quizAnswers: QuizAnswers | null): string[] {
  const bullets: string[] = []

  if (quizAnswers?.budget) {
    const { budgetMin, budgetMax } = quizAnswers.budget
    if (car.priceExShowroom >= budgetMin && car.priceExShowroom <= budgetMax) {
      bullets.push(`Priced within your ${quizAnswers.budget.label} budget range`)
    }
  }

  if (quizAnswers?.fuelType && car.fuelType === quizAnswers.fuelType) {
    bullets.push(`Matches your preferred ${FUEL_TYPE_LABELS[car.fuelType]} fuel type`)
  }

  if (quizAnswers?.useCase) {
    const allowedBodies = USE_CASE_BODY[quizAnswers.useCase] ?? []
    if (allowedBodies.includes(car.bodyType)) {
      bullets.push(`Body type suits your ${quizAnswers.useCase.replace('-', ' ')} use case`)
    }
  }

  if (quizAnswers?.seating && car.seatingCapacity >= quizAnswers.seating) {
    bullets.push(`Offers ${car.seatingCapacity} seats — meets your seating need`)
  }

  if (car.safetyRatingStars && car.safetyRatingStars >= 4) {
    bullets.push(`${car.safetyRatingStars}-star ${car.safetyRatingAgency ?? 'NCAP'} safety rating`)
  }

  const mileage = car.mileageCombinedKmpl ?? car.mileageCityKmpl
  if (mileage && mileage >= 18) {
    bullets.push(`Strong fuel efficiency at ${mileage} kmpl combined`)
  }

  if (bullets.length === 0) {
    bullets.push(
      `${BODY_TYPE_LABELS[car.bodyType]} with competitive specs in the ${car.segment} segment`,
      `Ex-showroom price positioned well for the ${car.year} model year`,
      `${car.features.length} convenience and safety features included`
    )
  }

  return bullets.slice(0, 3)
}

export interface ReviewStarBucket {
  star: number
  count: number
  percent: number
}

export interface ReviewCategoryScore {
  key: string
  label: string
  average: number
}

export interface OwnerSentimentTag {
  label: string
  count: number
}

export interface ReviewSummary {
  averageOverall: number
  totalReviews: number
  starBuckets: ReviewStarBucket[]
  categoryScores: ReviewCategoryScore[]
  likedTags: OwnerSentimentTag[]
  dislikedTags: OwnerSentimentTag[]
}

const REVIEW_CATEGORY_FIELDS: {
  key: keyof IReviewRatings
  label: string
}[] = [
  { key: 'fuelEfficiency', label: 'Mileage' },
  { key: 'comfort', label: 'Comfort' },
  { key: 'performance', label: 'Features' },
  { key: 'maintenance', label: 'Service' },
  { key: 'valueForMoney', label: 'Value' },
]

function averageRatingValues(
  reviews: ICarReview[],
  pick: (ratings: IReviewRatings) => number | null
): number {
  const values = reviews
    .map((review) => pick(review.ratings))
    .filter((value): value is number => value !== null && value > 0)

  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function buildStarBuckets(reviews: ICarReview[], totalReviews: number): ReviewStarBucket[] {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

  for (const review of reviews) {
    const rounded = Math.min(5, Math.max(1, Math.round(review.ratings.overall)))
    counts[rounded] += 1
  }

  return [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: counts[star],
    percent: totalReviews > 0 ? Math.round((counts[star] / totalReviews) * 100) : 0,
  }))
}

function buildSentimentTags(
  reviews: ICarReview[],
  field: 'pros' | 'cons',
  limit: number
): OwnerSentimentTag[] {
  const tagCounts = new Map<string, number>()

  for (const review of reviews) {
    for (const tag of review[field]) {
      const trimmed = tag.trim()
      if (trimmed) tagCounts.set(trimmed, (tagCounts.get(trimmed) ?? 0) + 1)
    }
  }

  return [...tagCounts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }))
}

export function buildReviewSummary(reviews: ICarReview[], totalReviews: number): ReviewSummary {
  const averageOverall = averageRatingValues(reviews, (ratings) => ratings.overall)

  const categoryScores = REVIEW_CATEGORY_FIELDS.map(({ key, label }) => ({
    key,
    label,
    average: averageRatingValues(reviews, (ratings) => {
      const value = ratings[key]
      return typeof value === 'number' ? value : null
    }),
  })).filter((category) => category.average > 0)

  return {
    averageOverall,
    totalReviews,
    starBuckets: buildStarBuckets(reviews, totalReviews),
    categoryScores,
    likedTags: buildSentimentTags(reviews, 'pros', 10),
    dislikedTags: buildSentimentTags(reviews, 'cons', 10),
  }
}

export function aggregateReviewProsCons(reviews: ICarReview[]): { pros: string[]; cons: string[] } {
  const prosCount = new Map<string, number>()
  const consCount = new Map<string, number>()

  for (const review of reviews) {
    for (const pro of review.pros) {
      const trimmed = pro.trim()
      if (trimmed) prosCount.set(trimmed, (prosCount.get(trimmed) ?? 0) + 1)
    }
    for (const con of review.cons) {
      const trimmed = con.trim()
      if (trimmed) consCount.set(trimmed, (consCount.get(trimmed) ?? 0) + 1)
    }
  }

  const sortByCount = (entries: [string, number][]) =>
    entries.sort((left, right) => right[1] - left[1]).map(([text]) => text)

  return {
    pros: sortByCount([...prosCount.entries()]).slice(0, 6),
    cons: sortByCount([...consCount.entries()]).slice(0, 6),
  }
}

export function formatReviewDate(dateValue: string): string {
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatMileageStat(car: ICar): string {
  const mileage = car.mileageCombinedKmpl ?? car.mileageCityKmpl
  if (!mileage) return '—'
  if (car.fuelType === 'electric') return `${mileage} km`
  return `${mileage} kmpl`
}

export function formatPowerStat(car: ICar): string {
  if (!car.powerBhp) return '—'
  return `${car.powerBhp} BHP`
}

export function formatSafetyStat(car: ICar): string {
  if (!car.safetyRatingStars) return '—'
  return `${car.safetyRatingStars}★`
}

export function formatSeatingStat(car: ICar): string {
  return `${car.seatingCapacity} seats`
}

function formatTransmission(value: string): string {
  return value.toUpperCase()
}

function formatDrivetrain(value: string): string {
  return value.toUpperCase()
}

function formatPrice(priceInr: number): string {
  const lakhs = priceInr / 100_000
  if (lakhs >= 100) return `₹${(lakhs / 100).toFixed(2)} Cr`
  return `₹${lakhs.toFixed(2)} L`
}

function addRow(rows: CarSpecRow[], label: string, value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') return
  rows.push({ label, value: String(value) })
}

export function buildCarSpecSections(car: ICar): CarSpecSection[] {
  const sections: CarSpecSection[] = []

  const overview: CarSpecRow[] = []
  addRow(overview, 'Make', car.make)
  addRow(overview, 'Model', car.model)
  addRow(overview, 'Variant', car.variant)
  addRow(overview, 'Year', car.year)
  addRow(overview, 'Body type', BODY_TYPE_LABELS[car.bodyType])
  addRow(overview, 'Segment', car.segment)
  if (overview.length > 0) sections.push({ title: 'Overview', rows: overview })

  const pricing: CarSpecRow[] = []
  addRow(pricing, 'Ex-showroom', formatPrice(car.priceExShowroom))
  if (car.priceOnRoad) addRow(pricing, 'On-road', formatPrice(car.priceOnRoad))
  if (pricing.length > 0) sections.push({ title: 'Pricing', rows: pricing })

  const powertrain: CarSpecRow[] = []
  addRow(powertrain, 'Fuel type', FUEL_TYPE_LABELS[car.fuelType as FuelType])
  addRow(powertrain, 'Transmission', formatTransmission(car.transmission))
  addRow(powertrain, 'Drivetrain', formatDrivetrain(car.drivetrain))
  addRow(powertrain, 'Engine', car.engineDisplacementCc ? `${car.engineDisplacementCc} cc` : null)
  addRow(powertrain, 'Power', car.powerBhp ? `${car.powerBhp} BHP` : null)
  addRow(powertrain, 'Torque', car.torqueNm ? `${car.torqueNm} Nm` : null)
  addRow(
    powertrain,
    '0–100 km/h',
    car.acceleration0to100Sec ? `${car.acceleration0to100Sec} sec` : null
  )
  addRow(powertrain, 'Top speed', car.topSpeedKph ? `${car.topSpeedKph} km/h` : null)
  if (powertrain.length > 0) sections.push({ title: 'Engine & performance', rows: powertrain })

  if (car.fuelType === 'electric' || car.batteryKwh) {
    const electric: CarSpecRow[] = []
    addRow(electric, 'Battery', car.batteryKwh ? `${car.batteryKwh} kWh` : null)
    addRow(electric, 'Electric range', car.electricRangeKm ? `${car.electricRangeKm} km` : null)
    if (electric.length > 0) sections.push({ title: 'Electric', rows: electric })
  }

  const efficiency: CarSpecRow[] = []
  addRow(efficiency, 'City mileage', car.mileageCityKmpl ? `${car.mileageCityKmpl} kmpl` : null)
  addRow(
    efficiency,
    'Highway mileage',
    car.mileageHighwayKmpl ? `${car.mileageHighwayKmpl} kmpl` : null
  )
  addRow(
    efficiency,
    'Combined mileage',
    car.mileageCombinedKmpl ? `${car.mileageCombinedKmpl} kmpl` : null
  )
  addRow(efficiency, 'Fuel tank', car.fuelTankLitres ? `${car.fuelTankLitres} L` : null)
  if (efficiency.length > 0) sections.push({ title: 'Mileage & fuel', rows: efficiency })

  const dimensions: CarSpecRow[] = []
  addRow(dimensions, 'Length', car.lengthMm ? `${car.lengthMm} mm` : null)
  addRow(dimensions, 'Width', car.widthMm ? `${car.widthMm} mm` : null)
  addRow(dimensions, 'Height', car.heightMm ? `${car.heightMm} mm` : null)
  addRow(dimensions, 'Wheelbase', car.wheelbaseMm ? `${car.wheelbaseMm} mm` : null)
  addRow(
    dimensions,
    'Ground clearance',
    car.groundClearanceMm ? `${car.groundClearanceMm} mm` : null
  )
  addRow(dimensions, 'Kerb weight', car.kerbWeightKg ? `${car.kerbWeightKg} kg` : null)
  addRow(dimensions, 'Boot space', car.bootSpaceLitres ? `${car.bootSpaceLitres} L` : null)
  addRow(dimensions, 'Seating capacity', `${car.seatingCapacity} seats`)
  if (dimensions.length > 0) sections.push({ title: 'Dimensions & capacity', rows: dimensions })

  const safety: CarSpecRow[] = []
  addRow(safety, 'Safety rating', car.safetyRatingStars ? `${car.safetyRatingStars} / 5` : null)
  addRow(safety, 'Rating agency', car.safetyRatingAgency ?? null)
  addRow(safety, 'Test year', car.safetyRatingYear ?? null)
  addRow(safety, 'Airbags', car.airbagCount ?? null)
  if (safety.length > 0) sections.push({ title: 'Safety', rows: safety })

  if (car.features.length > 0) {
    sections.push({
      title: 'Features',
      rows: car.features.map((feature, index) => ({
        label: `Feature ${index + 1}`,
        value: feature,
      })),
    })
  }

  if (car.adasFeatures.length > 0) {
    sections.push({
      title: 'ADAS',
      rows: car.adasFeatures.map((feature, index) => ({
        label: `ADAS ${index + 1}`,
        value: feature,
      })),
    })
  }

  if (car.tags.length > 0) {
    sections.push({
      title: 'Tags',
      rows: car.tags.map((tag) => ({ label: 'Tag', value: tag })),
    })
  }

  const meta: CarSpecRow[] = []
  addRow(meta, 'Popularity score', car.popularityScore)
  addRow(meta, 'Launched', car.launchedAt ? formatReviewDate(car.launchedAt) : null)
  addRow(meta, 'Colors available', car.colors.length > 0 ? car.colors.join(', ') : null)
  if (meta.length > 0) sections.push({ title: 'Additional info', rows: meta })

  return sections
}
