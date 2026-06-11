import { useEffect, useRef } from 'react'
import { HiArrowPath, HiScale, HiSparkles } from 'react-icons/hi2'
import { Navigate, useNavigate } from 'react-router-dom'

import HomeApiError from '@/components/home/HomeApiError'
import ShortlistAnswerSummary from '@/components/shortlist/ShortlistAnswerSummary'
import ShortlistResultCard from '@/components/shortlist/ShortlistResultCard'
import ShortlistResultsSkeleton from '@/components/shortlist/ShortlistResultsSkeleton'
import Button from '@/components/ui/Button'
import { usePostRecommendationsMutation } from '@/features/cars/carsApi'
import { isQuizComplete, quizAnswersToRecommendParams } from '@/features/quiz/quiz.utils'
import { useAppSelector } from '@/store'
import { selectQuizAnswers, selectQuizComplete } from '@/store/slices/quizSlice'

export default function ShortlistResultsPage() {
  const navigate = useNavigate()
  const answers = useAppSelector(selectQuizAnswers)
  const isComplete = useAppSelector(selectQuizComplete)
  const hasFetched = useRef(false)

  const [postRecommendations, { data: cars, isLoading, isError }] =
    usePostRecommendationsMutation()

  useEffect(() => {
    if (!isComplete || !isQuizComplete(answers) || hasFetched.current) return

    const params = quizAnswersToRecommendParams(answers)
    if (!params) return

    hasFetched.current = true
    postRecommendations(params)
  }, [answers, isComplete, postRecommendations])

  if (!isComplete || !isQuizComplete(answers)) {
    return <Navigate to="/quiz" replace />
  }

  const rankedCars = cars ?? []

  return (
    <div className="bg-surface-raised py-8 sm:py-12">
      <div className="container-page max-w-3xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
            <HiSparkles className="size-6" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
            Your shortlist is ready
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Ranked by how well each car matches your preferences.
          </p>
          <div className="mt-5 flex justify-center">
            <ShortlistAnswerSummary answers={answers} />
          </div>
        </div>

        {isLoading && <ShortlistResultsSkeleton />}

        {isError && (
          <HomeApiError message="Could not load your shortlist. Make sure the API server is running." />
        )}

        {!isLoading && !isError && rankedCars.length === 0 && (
          <div className="rounded-2xl border border-border bg-surface p-8 text-center">
            <p className="text-sm text-text-secondary">
              No cars matched your preferences. Try refining your answers.
            </p>
            <Button type="button" className="mt-4" onClick={() => navigate('/quiz')}>
              Refine answers
            </Button>
          </div>
        )}

        {!isLoading && !isError && rankedCars.length > 0 && (
          <div className="space-y-4">
            {rankedCars.map((car, index) => (
              <ShortlistResultCard
                key={car._id}
                car={car}
                rank={index + 1}
                answers={answers}
              />
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-center">
          <Button
            type="button"
            variant="secondary"
            className="gap-2"
            onClick={() => navigate('/compare')}
          >
            <HiScale className="size-4" />
            Compare shortlist
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="gap-2"
            onClick={() => navigate('/quiz')}
          >
            <HiArrowPath className="size-4" />
            Refine answers
          </Button>
        </div>
      </div>
    </div>
  )
}
