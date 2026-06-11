import type { QuizAnswers } from '@cardeko/types'
import { HiCheck } from 'react-icons/hi2'

import { QUIZ_STEPS } from '@/features/quiz/quiz.constants'
import { getQuizAnswerLabel } from '@/features/quiz/quiz.utils'

interface ShortlistAnswerSummaryProps {
  answers: QuizAnswers
}

export default function ShortlistAnswerSummary({ answers }: ShortlistAnswerSummaryProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {QUIZ_STEPS.map((step) => {
        const label = getQuizAnswerLabel(step.id, answers)
        if (!label) return null

        return (
          <span
            key={step.id}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary"
          >
            <HiCheck className="size-3.5 text-status-success" />
            <span className="text-text-muted">{step.label}:</span>
            <span className="text-text-primary">{label}</span>
          </span>
        )
      })}
    </div>
  )
}
