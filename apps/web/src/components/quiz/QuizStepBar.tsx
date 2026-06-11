import type { QuizAnswers, QuizStepId } from '@cardeko/types'
import { HiCheck } from 'react-icons/hi2'

import { QUIZ_STEPS } from '@/features/quiz/quiz.constants'
import { getQuizAnswerLabel } from '@/features/quiz/quiz.utils'

interface QuizStepBarProps {
  currentStepId: QuizStepId
  answers: QuizAnswers
}

export default function QuizStepBar({ currentStepId, answers }: QuizStepBarProps) {
  const currentIndex = QUIZ_STEPS.findIndex((step) => step.id === currentStepId)

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex min-w-[640px] items-start gap-0">
        {QUIZ_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = step.id === currentStepId
          const isUpcoming = index > currentIndex
          const answerLabel = getQuizAnswerLabel(step.id, answers)

          return (
            <div key={step.id} className="flex flex-1 items-start">
              <div className="flex min-w-0 flex-1 flex-col items-center px-1">
                <div
                  className={[
                    'flex size-9 items-center justify-center rounded-full border-2 text-xs font-bold transition',
                    isCompleted && 'border-status-success bg-status-success text-white',
                    isCurrent &&
                      'border-brand-accent bg-brand-accent text-white shadow-md shadow-brand-accent/30',
                    isUpcoming && 'border-border bg-surface-overlay text-text-muted',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {isCompleted ? <HiCheck className="size-4" /> : index + 1}
                </div>

                <p
                  className={[
                    'mt-2 text-center text-xs font-semibold',
                    isCurrent && 'text-brand-accent',
                    isCompleted && 'text-text-primary',
                    isUpcoming && 'text-text-muted',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {step.label}
                </p>

                <p
                  className={[
                    'mt-0.5 line-clamp-2 min-h-[2rem] text-center text-[11px]',
                    isCompleted && 'font-medium text-text-secondary',
                    isCurrent && 'text-text-secondary',
                    isUpcoming && 'text-transparent',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {isCompleted && answerLabel ? answerLabel : isCurrent ? 'In progress' : '—'}
                </p>
              </div>

              {index < QUIZ_STEPS.length - 1 && (
                <div
                  className={[
                    'mt-4 h-0.5 min-w-4 flex-1 rounded-full',
                    index < currentIndex ? 'bg-status-success' : 'bg-border',
                  ].join(' ')}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
