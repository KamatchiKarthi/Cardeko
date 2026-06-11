import type { BodyType, ExploreSortTab, FuelType } from '@cardeko/types'

export const EXPLORE_DEFAULT_PRICE_MIN = 300_000
export const EXPLORE_DEFAULT_PRICE_MAX = 5_000_000
export const EXPLORE_PAGE_SIZE = 12

export const EXPLORE_BODY_TYPE_OPTIONS: { value: BodyType; label: string }[] = [
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'crossover', label: 'Crossover' },
  { value: 'minivan', label: 'MUV' },
  { value: 'coupe', label: 'Coupe' },
]

export const EXPLORE_FUEL_TYPE_OPTIONS: { value: FuelType; label: string }[] = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'cng', label: 'CNG' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'electric', label: 'Electric' },
]

export const EXPLORE_SEATING_OPTIONS: { value: number; label: string }[] = [
  { value: 4, label: '4 seats' },
  { value: 5, label: '5 seats' },
  { value: 6, label: '6 seats' },
  { value: 7, label: '7 seats' },
  { value: 8, label: '8+ seats' },
]

export const EXPLORE_SORT_TABS: { id: ExploreSortTab; label: string }[] = [
  { id: 'best-match', label: 'Best match' },
  { id: 'price', label: 'Price' },
  { id: 'mileage', label: 'Mileage' },
  { id: 'safety', label: 'Safety' },
]
