import type { BodyType, IRecommendedCar, QuizAnswers, UseCase } from '@cardeko/types'

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

export interface MatchReason {
  label: string
  variant: 'success' | 'accent' | 'info' | 'default'
}

export function getMatchReasons(car: IRecommendedCar, answers: QuizAnswers): MatchReason[] {
  const reasons: MatchReason[] = []

  if (answers.budget) {
    const { budgetMin, budgetMax } = answers.budget
    if (car.priceExShowroom >= budgetMin && car.priceExShowroom <= budgetMax) {
      reasons.push({ label: 'Within budget', variant: 'success' })
    }
  }

  if (answers.fuelType && car.fuelType === answers.fuelType) {
    reasons.push({
      label: `${FUEL_TYPE_LABELS[car.fuelType]} match`,
      variant: 'accent',
    })
  }

  if (answers.seating && car.seatingCapacity && car.seatingCapacity >= answers.seating) {
    reasons.push({ label: `${car.seatingCapacity}-seat capacity`, variant: 'info' })
  }

  if (car.safetyRatingStars && car.safetyRatingStars >= 5) {
    reasons.push({ label: '5★ safety', variant: 'success' })
  } else if (car.safetyRatingStars && car.safetyRatingStars >= 4) {
    reasons.push({ label: `${car.safetyRatingStars}★ safety`, variant: 'success' })
  }

  if (answers.useCase) {
    const allowedBodies = USE_CASE_BODY[answers.useCase] ?? []
    if (allowedBodies.includes(car.bodyType)) {
      reasons.push({ label: 'Fits your use case', variant: 'accent' })
    }
  }

  if (answers.priority === 'mileage' && car.mileageCombinedKmpl && car.mileageCombinedKmpl >= 18) {
    reasons.push({ label: 'Great mileage', variant: 'success' })
  }

  if (reasons.length === 0) {
    reasons.push({ label: 'Strong overall match', variant: 'default' })
  }

  return reasons.slice(0, 4)
}
