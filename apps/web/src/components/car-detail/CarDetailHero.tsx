import type { ICar } from '@cardeko/types'
import { HiCheck, HiPlus, HiTruck } from 'react-icons/hi2'

import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import CarImage from '@/components/ui/CarImage'
import {
  computeCarDetailMatchPercent,
  getCarDetailBadge,
} from '@/features/car-detail/car-detail.utils'
import { useAppDispatch, useAppSelector } from '@/store'
import { selectQuizAnswers, selectQuizComplete } from '@/store/slices/quizSlice'
import { addToShortlist, selectShortlistIds } from '@/store/slices/shortlistSlice'
import {
  formatStartingPrice,
  getCarCardGradient,
  getCarDisplayName,
  getCarHeroImage,
} from '@/utils/car.utils'

interface CarDetailHeroProps {
  car: ICar
}

export default function CarDetailHero({ car }: CarDetailHeroProps) {
  const dispatch = useAppDispatch()
  const shortlistIds = useAppSelector(selectShortlistIds)
  const quizAnswers = useAppSelector(selectQuizAnswers)
  const quizComplete = useAppSelector(selectQuizComplete)
  const isShortlisted = shortlistIds.includes(car._id)

  const displayName = getCarDisplayName(car.make, car.model)
  const primaryColor = car.colors[0] ?? ''
  const gradient = getCarCardGradient(primaryColor, 0)
  const heroImage = getCarHeroImage(car.images)
  const matchPercent = computeCarDetailMatchPercent(car, quizComplete ? quizAnswers : null)
  const detailBadge = getCarDetailBadge(car)

  const handleShortlist = () => {
    if (!isShortlisted) dispatch(addToShortlist(car._id))
  }

  return (
    <div className="border-b border-border bg-surface">
      <div className="container-page py-8 sm:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-accent text-white shadow-md">
              <HiTruck className="size-7" aria-hidden />
            </div>
            <CarImage
              src={heroImage}
              alt={displayName}
              gradient={gradient}
              className="h-28 w-full max-w-xs rounded-2xl sm:h-32"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={detailBadge.variant}>{detailBadge.label}</Badge>
              <span className="rounded-full bg-brand-accent/10 px-2.5 py-0.5 text-xs font-bold text-brand-accent">
                {matchPercent}% match
              </span>
            </div>

            <h1 className="mt-3 text-2xl font-bold text-text-primary sm:text-3xl">{displayName}</h1>
            <p className="mt-1 text-sm text-text-secondary">
              {car.variant} · {car.year}
            </p>
            <p className="mt-2 text-2xl font-bold text-brand-accent">
              {formatStartingPrice(car.priceExShowroom)}
              <span className="ml-2 text-sm font-normal text-text-muted">ex-showroom</span>
            </p>

            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs font-medium">
                <span className="text-text-secondary">Match score</span>
                <span className="text-brand-accent">{matchPercent}%</span>
              </div>
              <div className="h-2 max-w-md overflow-hidden rounded-full bg-surface-overlay">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-accent to-status-success"
                  style={{ width: `${matchPercent}%` }}
                />
              </div>
            </div>

            <div className="mt-5">
              <Button
                type="button"
                variant={isShortlisted ? 'secondary' : 'primary'}
                onClick={handleShortlist}
                disabled={isShortlisted}
                className="gap-2"
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
      </div>
    </div>
  )
}
