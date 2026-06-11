import type { FuelType, Priority, QuizBudgetAnswer, QuizStepId, UseCase } from '@cardeko/types'

export interface QuizStepDefinition {
  id: QuizStepId
  label: string
  question: string
  subtitle: string
}

export const QUIZ_STEPS: QuizStepDefinition[] = [
  {
    id: 'budget',
    label: 'Budget',
    question: 'What is your budget?',
    subtitle: 'Ex-showroom price range in lakhs',
  },
  {
    id: 'useCase',
    label: 'Use case',
    question: 'How will you mainly use the car?',
    subtitle: 'Pick the driving style that fits you best',
  },
  {
    id: 'fuel',
    label: 'Fuel',
    question: 'Which fuel type do you prefer?',
    subtitle: 'We will match cars to your fuel preference',
  },
  {
    id: 'seating',
    label: 'Seating',
    question: 'How many seats do you need?',
    subtitle: 'Include regular passengers, not just license count',
  },
  {
    id: 'priority',
    label: 'Priority',
    question: 'What matters most to you?',
    subtitle: 'We weight your shortlist around this',
  },
]

export const BUDGET_OPTIONS: QuizBudgetAnswer[] = [
  { label: 'Under ₹5L', budgetMin: 0, budgetMax: 500_000 },
  { label: '₹5–10L', budgetMin: 500_000, budgetMax: 1_000_000 },
  { label: '₹10–15L', budgetMin: 1_000_000, budgetMax: 1_500_000 },
  { label: '₹15–20L', budgetMin: 1_500_000, budgetMax: 2_000_000 },
  { label: '₹20L+', budgetMin: 2_000_000, budgetMax: 5_000_000 },
]

export const USE_CASE_OPTIONS: { value: UseCase; label: string; description: string }[] = [
  { value: 'daily-commute', label: 'Daily commute', description: 'Office runs and city traffic' },
  { value: 'family', label: 'Family', description: 'School drops and weekend trips' },
  { value: 'highway', label: 'Highway', description: 'Long-distance comfort and stability' },
  { value: 'city', label: 'City', description: 'Tight parking and stop-go driving' },
  { value: 'off-road', label: 'Off-road', description: 'Rough roads and adventure' },
  { value: 'luxury', label: 'Luxury', description: 'Premium features and comfort' },
]

export const FUEL_OPTIONS: { value: FuelType; label: string }[] = [
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'cng', label: 'CNG' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'electric', label: 'Electric' },
]

export const SEATING_OPTIONS: { value: number; label: string }[] = [
  { value: 4, label: '4 seats' },
  { value: 5, label: '5 seats' },
  { value: 6, label: '6 seats' },
  { value: 7, label: '7 seats' },
  { value: 8, label: '8+ seats' },
]

export const PRIORITY_OPTIONS: { value: Priority; label: string; description: string }[] = [
  { value: 'safety', label: 'Safety', description: 'NCAP ratings and airbags' },
  { value: 'mileage', label: 'Mileage', description: 'Fuel efficiency first' },
  { value: 'performance', label: 'Performance', description: 'Power and driving feel' },
  { value: 'comfort', label: 'Comfort', description: 'Space and ride quality' },
  { value: 'features', label: 'Features', description: 'Tech and convenience' },
  { value: 'value', label: 'Value', description: 'Best bang for buck' },
]
