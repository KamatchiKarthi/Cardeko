import type { IRecommendedCar, QuizAnswers } from '@cardeko/types'
import { HiCheck, HiPlus } from 'react-icons/hi2'
import { Link } from 'react-router-dom'

import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { getMatchReasons } from '@/features/quiz/recommend.utils'
import { useAppDispatch, useAppSelector } from '@/store'
import { addToShortlist, selectShortlistIds } from '@/store/slices/shortlistSlice'
import {
  formatStartingPrice,
  getCarCardGradient,
  getCarDisplayName,
} from '@/utils/car.utils'

const RANK_STYLES = [
  { bg: 'bg-amber-500', icon: '🏆' },
  { bg: 'bg-brand-accent', icon: '⭐' },
  { bg: 'bg-emerald-500', icon: '✓' },
  { bg: 'bg-violet-500', icon: '◆' },
  { bg: 'bg-sky-500', icon: '●' },
] as const

interface ShortlistResultCardProps {
  car: IRecommendedCar
  rank: number
  answers: QuizAnswers
}

export default function ShortlistResultCard({ car, rank, answers }: ShortlistResultCardProps) {
  const dispatch = useAppDispatch()
  const shortlistIds = useAppSelector(selectShortlistIds)
  const isShortlisted = shortlistIds.includes(car._id)
  const reasons = getMatchReasons(car, answers)
  const rankStyle = RANK_STYLES[(rank - 1) % RANK_STYLES.length]
  const primaryColor = car.colors[0] ?? ''
  const gradient = getCarCardGradient(primaryColor, rank - 1)
  const displayName = getCarDisplayName(car.make, car.model)

  const handleAddToShortlist = () => {
    if (!isShortlisted) {
      dispatch(addToShortlist(car._id))
    }
  }

  return (
    <Card elevated className="overflow-hidden">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-stretch sm:p-5">
        <div className="flex items-start gap-3 sm:w-56 sm:shrink-0">
          <div
            className={[
              'flex size-11 shrink-0 items-center justify-center rounded-xl text-lg text-white shadow-sm',
              rankStyle.bg,
            ].join(' ')}
            aria-hidden
          >
            {rankStyle.icon}
          </div>

          <div
            className={['h-20 flex-1 rounded-xl bg-gradient-to-br sm:h-24', gradient].join(' ')}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                #{rank} match
              </p>
              <Link
                to={`/cars/${car.slug}`}
                className="mt-0.5 text-lg font-bold text-text-primary transition hover:text-brand-accent"
              >
                {displayName}
              </Link>
              <p className="text-sm text-text-secondary">
                {car.variant} · {car.year}
              </p>
            </div>
            <p className="text-lg font-bold text-brand-accent">
              {formatStartingPrice(car.priceExShowroom)}
            </p>
          </div>

          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-xs font-medium">
              <span className="text-text-secondary">Match score</span>
              <span className="text-brand-accent">{car._matchPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-overlay">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-accent to-status-success transition-all"
                style={{ width: `${car._matchPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {reasons.map((reason) => (
              <Badge key={reason.label} variant={reason.variant}>
                {reason.label}
              </Badge>
            ))}
          </div>

          <div className="mt-4">
            <Button
              type="button"
              variant={isShortlisted ? 'secondary' : 'primary'}
              size="sm"
              onClick={handleAddToShortlist}
              disabled={isShortlisted}
              className="gap-1.5"
            >
              {isShortlisted ? (
                <>
                  <HiCheck className="size-4" />
                  Added to shortlist
                </>
              ) : (
                <>
                  <HiPlus className="size-4" />
                  Add to shortlist
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
