import type {
  FuelType,
  Priority,
  QuizBudgetAnswer,
  QuizStepId,
  UseCase,
} from '@cardeko/types'
import { useState } from 'react'
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi2'
import { Link, useNavigate } from 'react-router-dom'

import QuizContentSkeleton from '@/components/quiz/QuizContentSkeleton'
import QuizStepBar from '@/components/quiz/QuizStepBar'
import QuizStepContent from '@/components/quiz/QuizStepContent'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { QUIZ_STEPS } from '@/features/quiz/quiz.constants'
import { isQuizStepComplete } from '@/features/quiz/quiz.utils'
import { useAppDispatch, useAppSelector } from '@/store'
import { completeQuiz, selectQuizAnswers, setQuizAnswers } from '@/store/slices/quizSlice'

export default function QuizPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const answers = useAppSelector(selectQuizAnswers)
  const [stepIndex, setStepIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentStep = QUIZ_STEPS[stepIndex]
  const currentStepId: QuizStepId = currentStep.id
  const isLastStep = stepIndex === QUIZ_STEPS.length - 1
  const canGoNext = isQuizStepComplete(currentStepId, answers)

  const goToStep = (nextIndex: number) => {
    setIsTransitioning(true)
    window.setTimeout(() => {
      setStepIndex(nextIndex)
      setIsTransitioning(false)
    }, 180)
  }

  const handleNext = () => {
    if (!canGoNext || isLastStep) return
    goToStep(stepIndex + 1)
  }

  const handleBack = () => {
    if (stepIndex === 0) return
    goToStep(stepIndex - 1)
  }

  const handleSeeMatches = () => {
    if (!canGoNext) return
    dispatch(completeQuiz(answers))
    navigate('/quiz/results')
  }

  return (
    <div className="bg-surface-raised py-8 sm:py-12">
      <div className="container-page max-w-3xl">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition hover:text-brand-accent"
          >
            <HiArrowLeft className="size-4" />
            Back to home
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-text-primary sm:text-3xl">Find My Car</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Answer 5 quick questions — we&apos;ll build a personalised shortlist for you.
          </p>
        </div>

        <Card elevated className="overflow-hidden">
          <div className="border-b border-border bg-surface px-4 py-5 sm:px-6">
            <QuizStepBar currentStepId={currentStepId} answers={answers} />
          </div>

          <div className="px-4 py-5 sm:px-6">
            {isTransitioning ? (
              <QuizContentSkeleton />
            ) : (
              <QuizStepContent
                stepId={currentStepId}
                answers={answers}
                onSelectBudget={(value: QuizBudgetAnswer) =>
                  dispatch(setQuizAnswers({ ...answers, budget: value }))
                }
                onSelectUseCase={(value: UseCase) =>
                  dispatch(setQuizAnswers({ ...answers, useCase: value }))
                }
                onSelectFuel={(value: FuelType) =>
                  dispatch(setQuizAnswers({ ...answers, fuelType: value }))
                }
                onSelectSeating={(value: number) =>
                  dispatch(setQuizAnswers({ ...answers, seating: value }))
                }
                onSelectPriority={(value: Priority) =>
                  dispatch(setQuizAnswers({ ...answers, priority: value }))
                }
              />
            )}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
              <Button
                type="button"
                variant="secondary"
                onClick={handleBack}
                disabled={stepIndex === 0 || isTransitioning}
              >
                Back
              </Button>

              {!isLastStep ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canGoNext || isTransitioning}
                  className="gap-2"
                >
                  Next
                  <HiArrowRight className="size-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={!canGoNext || isTransitioning}
                  onClick={handleSeeMatches}
                >
                  See my matches
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
