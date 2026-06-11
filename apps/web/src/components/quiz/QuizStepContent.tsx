import type {
  FuelType,
  Priority,
  QuizAnswers,
  QuizBudgetAnswer,
  QuizStepId,
  UseCase,
} from '@cardeko/types'

import {
  BUDGET_OPTIONS,
  FUEL_OPTIONS,
  PRIORITY_OPTIONS,
  QUIZ_STEPS,
  SEATING_OPTIONS,
  USE_CASE_OPTIONS,
} from '@/features/quiz/quiz.constants'

interface QuizStepContentProps {
  stepId: QuizStepId
  answers: QuizAnswers
  onSelectBudget: (value: QuizBudgetAnswer) => void
  onSelectUseCase: (value: UseCase) => void
  onSelectFuel: (value: FuelType) => void
  onSelectSeating: (value: number) => void
  onSelectPriority: (value: Priority) => void
}

interface OptionCardProps {
  label: string
  description?: string
  selected: boolean
  onSelect: () => void
}

function OptionCard({ label, description, selected, onSelect }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'rounded-xl border px-4 py-3 text-left transition',
        selected
          ? 'border-brand-accent bg-brand-accent/5 ring-1 ring-brand-accent'
          : 'border-border bg-surface hover:border-brand-accent/40 hover:bg-surface-overlay',
      ].join(' ')}
    >
      <p className="text-sm font-semibold text-text-primary">{label}</p>
      {description && <p className="mt-0.5 text-xs text-text-secondary">{description}</p>}
    </button>
  )
}

export default function QuizStepContent({
  stepId,
  answers,
  onSelectBudget,
  onSelectUseCase,
  onSelectFuel,
  onSelectSeating,
  onSelectPriority,
}: QuizStepContentProps) {
  const step = QUIZ_STEPS.find((item) => item.id === stepId)
  if (!step) return null

  return (
    <div>
      <h2 className="text-xl font-bold text-text-primary sm:text-2xl">{step.question}</h2>
      <p className="mt-1 text-sm text-text-secondary">{step.subtitle}</p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {stepId === 'budget' &&
          BUDGET_OPTIONS.map((option) => (
            <OptionCard
              key={option.label}
              label={option.label}
              selected={answers.budget?.label === option.label}
              onSelect={() => onSelectBudget(option)}
            />
          ))}

        {stepId === 'useCase' &&
          USE_CASE_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              description={option.description}
              selected={answers.useCase === option.value}
              onSelect={() => onSelectUseCase(option.value)}
            />
          ))}

        {stepId === 'fuel' &&
          FUEL_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              selected={answers.fuelType === option.value}
              onSelect={() => onSelectFuel(option.value)}
            />
          ))}

        {stepId === 'seating' &&
          SEATING_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              selected={answers.seating === option.value}
              onSelect={() => onSelectSeating(option.value)}
            />
          ))}

        {stepId === 'priority' &&
          PRIORITY_OPTIONS.map((option) => (
            <OptionCard
              key={option.value}
              label={option.label}
              description={option.description}
              selected={answers.priority === option.value}
              onSelect={() => onSelectPriority(option.value)}
            />
          ))}
      </div>
    </div>
  )
}
