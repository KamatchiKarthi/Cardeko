import type { QuizAnswers, QuizStepId, RecommendParams } from '@cardeko/types'

import { FUEL_OPTIONS, PRIORITY_OPTIONS, SEATING_OPTIONS, USE_CASE_OPTIONS } from './quiz.constants'

export function getQuizAnswerLabel(stepId: QuizStepId, answers: QuizAnswers): string | null {
  switch (stepId) {
    case 'budget':
      return answers.budget?.label ?? null
    case 'useCase':
      return USE_CASE_OPTIONS.find((option) => option.value === answers.useCase)?.label ?? null
    case 'fuel':
      return FUEL_OPTIONS.find((option) => option.value === answers.fuelType)?.label ?? null
    case 'seating':
      return SEATING_OPTIONS.find((option) => option.value === answers.seating)?.label ?? null
    case 'priority':
      return PRIORITY_OPTIONS.find((option) => option.value === answers.priority)?.label ?? null
    default:
      return null
  }
}

export function isQuizComplete(answers: QuizAnswers): boolean {
  return (
    answers.budget !== null &&
    answers.useCase !== null &&
    answers.fuelType !== null &&
    answers.seating !== null &&
    answers.priority !== null
  )
}

export function quizAnswersToRecommendParams(answers: QuizAnswers): RecommendParams | null {
  if (!isQuizComplete(answers) || !answers.budget) return null

  return {
    budgetMin: answers.budget.budgetMin,
    budgetMax: answers.budget.budgetMax,
    useCase: answers.useCase ?? undefined,
    fuelType: answers.fuelType ?? undefined,
    seating: answers.seating ?? undefined,
    priority: answers.priority ?? undefined,
  }
}

export function isQuizStepComplete(stepId: QuizStepId, answers: QuizAnswers): boolean {
  switch (stepId) {
    case 'budget':
      return answers.budget !== null
    case 'useCase':
      return answers.useCase !== null
    case 'fuel':
      return answers.fuelType !== null
    case 'seating':
      return answers.seating !== null
    case 'priority':
      return answers.priority !== null
    default:
      return false
  }
}
