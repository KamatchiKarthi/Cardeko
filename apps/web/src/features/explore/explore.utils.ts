import type {
  BodyType,
  CarSearchParams,
  CarSortBy,
  ExploreFilters,
  ExploreSortTab,
  FuelType,
  ICarListItem,
  QuizAnswers,
} from '@cardeko/types'

import {
  EXPLORE_DEFAULT_PRICE_MAX,
  EXPLORE_DEFAULT_PRICE_MIN,
  EXPLORE_PAGE_SIZE,
} from './explore.constants'

const BODY_TYPES: BodyType[] = [
  'sedan',
  'suv',
  'hatchback',
  'coupe',
  'convertible',
  'truck',
  'van',
  'wagon',
  'minivan',
  'crossover',
]

const FUEL_TYPES: FuelType[] = ['petrol', 'diesel', 'electric', 'hybrid', 'cng', 'lpg']

const SORT_TAB_TO_API: Record<ExploreSortTab, CarSortBy> = {
  'best-match': 'popularity',
  price: 'price_asc',
  mileage: 'mileage',
  safety: 'rating',
}

export function exploreSortTabToSortBy(tab: ExploreSortTab): CarSortBy {
  return SORT_TAB_TO_API[tab]
}

export function parseExploreSortTab(value: string | null): ExploreSortTab {
  if (value === 'price' || value === 'price_asc') return 'price'
  if (value === 'mileage') return 'mileage'
  if (value === 'safety' || value === 'rating') return 'safety'
  if (value === 'best-match' || value === 'popularity' || value === 'newest') return 'best-match'
  return 'best-match'
}

function parseCsvBodyTypes(value: string | null): BodyType[] {
  if (!value) return []
  return value
    .split(',')
    .map((part) => part.trim())
    .filter((part): part is BodyType => BODY_TYPES.includes(part as BodyType))
}

function parseCsvFuelTypes(value: string | null): FuelType[] {
  if (!value) return []
  return value
    .split(',')
    .map((part) => part.trim())
    .filter((part): part is FuelType => FUEL_TYPES.includes(part as FuelType))
}

function parseCsvSeating(value: string | null): number[] {
  if (!value) return []
  return value
    .split(',')
    .map((part) => Number.parseInt(part.trim(), 10))
    .filter((seat) => !Number.isNaN(seat) && seat >= 2 && seat <= 9)
}

export function parseExploreFiltersFromSearch(searchParams: URLSearchParams): ExploreFilters {
  const priceMin = Number.parseInt(searchParams.get('priceMin') ?? '', 10)
  const priceMax = Number.parseInt(searchParams.get('priceMax') ?? '', 10)

  return {
    priceMin: Number.isNaN(priceMin) ? EXPLORE_DEFAULT_PRICE_MIN : priceMin,
    priceMax: Number.isNaN(priceMax) ? EXPLORE_DEFAULT_PRICE_MAX : priceMax,
    bodyTypes: parseCsvBodyTypes(searchParams.get('bodyTypes')),
    fuelTypes: parseCsvFuelTypes(searchParams.get('fuelTypes')),
    seatingCapacities: parseCsvSeating(searchParams.get('seatingCapacities')),
    make: searchParams.get('make') ?? '',
  }
}

export function parseExploreSortFromSearch(searchParams: URLSearchParams): ExploreSortTab {
  const sortValue = searchParams.get('sort') ?? searchParams.get('sortBy')
  return parseExploreSortTab(sortValue)
}

export function buildExploreSearchParams(
  filters: ExploreFilters,
  sortTab: ExploreSortTab,
  page = 1
): CarSearchParams {
  const params: CarSearchParams = {
    page,
    pageSize: EXPLORE_PAGE_SIZE,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    sortBy: exploreSortTabToSortBy(sortTab),
  }

  if (filters.make) params.make = filters.make
  if (filters.bodyTypes.length > 0) params.bodyTypes = filters.bodyTypes
  if (filters.fuelTypes.length > 0) params.fuelTypes = filters.fuelTypes
  if (filters.seatingCapacities.length > 0) params.seatingCapacities = filters.seatingCapacities

  return params
}

export function filtersToUrlSearchParams(
  filters: ExploreFilters,
  sortTab: ExploreSortTab
): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.priceMin !== EXPLORE_DEFAULT_PRICE_MIN) {
    params.set('priceMin', String(filters.priceMin))
  }
  if (filters.priceMax !== EXPLORE_DEFAULT_PRICE_MAX) {
    params.set('priceMax', String(filters.priceMax))
  }
  if (filters.bodyTypes.length > 0) params.set('bodyTypes', filters.bodyTypes.join(','))
  if (filters.fuelTypes.length > 0) params.set('fuelTypes', filters.fuelTypes.join(','))
  if (filters.seatingCapacities.length > 0) {
    params.set('seatingCapacities', filters.seatingCapacities.join(','))
  }
  if (filters.make) params.set('make', filters.make)
  if (sortTab !== 'best-match') params.set('sort', sortTab)

  return params
}

export function computeExploreMatchPercent(
  car: ICarListItem,
  filters: ExploreFilters,
  quizAnswers: QuizAnswers | null
): number {
  let score = 0
  let maxScore = 0

  maxScore += 30
  if (car.priceExShowroom >= filters.priceMin && car.priceExShowroom <= filters.priceMax) {
    score += 30
  }

  if (filters.bodyTypes.length > 0) {
    maxScore += 25
    if (filters.bodyTypes.includes(car.bodyType)) score += 25
  }

  if (filters.fuelTypes.length > 0) {
    maxScore += 25
    if (filters.fuelTypes.includes(car.fuelType)) score += 25
  }

  if (filters.seatingCapacities.length > 0) {
    maxScore += 20
    if (car.seatingCapacity && filters.seatingCapacities.includes(car.seatingCapacity)) {
      score += 20
    }
  }

  if (quizAnswers?.fuelType) {
    maxScore += 15
    if (car.fuelType === quizAnswers.fuelType) score += 15
  }

  if (quizAnswers?.seating) {
    maxScore += 15
    if (car.seatingCapacity && car.seatingCapacity >= quizAnswers.seating) score += 15
  }

  if (quizAnswers?.budget) {
    maxScore += 20
    const { budgetMin, budgetMax } = quizAnswers.budget
    if (car.priceExShowroom >= budgetMin && car.priceExShowroom <= budgetMax) score += 20
  }

  if (maxScore === 0) {
    return Math.min(99, Math.max(55, Math.round((car.popularityScore / 1000) * 100)))
  }

  const filterMatch = Math.round((score / maxScore) * 100)
  const popularityBoost = Math.min(15, Math.round(car.popularityScore / 100))
  return Math.min(99, filterMatch + popularityBoost)
}

export function formatEngineLabel(car: ICarListItem): string {
  if (car.fuelType === 'electric') {
    return 'Electric motor'
  }
  if (car.engineDisplacementCc) {
    return `${car.engineDisplacementCc} cc`
  }
  if (car.powerBhp) {
    return `${car.powerBhp} BHP engine`
  }
  return 'Engine N/A'
}

export function formatMileageLabel(car: ICarListItem): string {
  const mileage = car.mileageCombinedKmpl ?? car.mileageCityKmpl
  if (!mileage) return '—'
  if (car.fuelType === 'electric') return `${mileage} km/charge est.`
  return `${mileage} kmpl`
}

export function formatPowerLabel(car: ICarListItem): string {
  if (!car.powerBhp) return '—'
  return `${car.powerBhp} BHP`
}
