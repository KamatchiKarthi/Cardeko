import type { ICar } from '@cardeko/types'
import { HiXMark } from 'react-icons/hi2'
import { Link } from 'react-router-dom'

import Button from '@/components/ui/Button'
import CarImage from '@/components/ui/CarImage'
import { MAX_COMPARE_CARS } from '@/features/compare/compare.constants'
import { useAppDispatch } from '@/store'
import { removeFromShortlist } from '@/store/slices/shortlistSlice'
import {
  formatStartingPrice,
  getCarCardGradient,
  getCarDisplayName,
  getCarHeroImage,
} from '@/utils/car.utils'

interface CompareCarHeaderProps {
  cars: ICar[]
  slotCount?: number
}

export default function CompareCarHeader({ cars, slotCount = MAX_COMPARE_CARS }: CompareCarHeaderProps) {
  const dispatch = useAppDispatch()
  const slots = Array.from({ length: slotCount })

  return (
    <tr>
      <th className="sticky left-0 z-20 min-w-[140px] border-b border-r border-border bg-surface-raised px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-muted">
        Car
      </th>
      {slots.map((_, slotIndex) => {
        const car = cars[slotIndex]
        if (!car) {
          return (
            <th
              key={`empty-${slotIndex}`}
              className="min-w-[200px] border-b border-border bg-surface px-4 py-4 text-center align-top sm:min-w-[220px]"
            >
              <div className="mx-auto flex h-36 max-w-[200px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-surface-raised px-3">
                <p className="text-xs font-medium text-text-muted">Slot {slotIndex + 1}</p>
                <Link
                  to="/explore"
                  className="mt-2 text-xs font-semibold text-brand-accent hover:underline"
                >
                  Add from explore
                </Link>
              </div>
            </th>
          )
        }

        const displayName = getCarDisplayName(car.make, car.model)
        const gradient = getCarCardGradient(car.colors[0] ?? '', slotIndex)
        const heroImage = getCarHeroImage(car.images)

        return (
          <th
            key={car._id}
            className="min-w-[200px] border-b border-border bg-surface px-4 py-4 align-top sm:min-w-[220px]"
          >
            <div className="relative mx-auto max-w-[200px]">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 z-10 size-7 min-w-0 rounded-full p-0"
                onClick={() => dispatch(removeFromShortlist(car._id))}
                aria-label={`Remove ${displayName} from shortlist`}
              >
                <HiXMark className="size-4" />
              </Button>

              <CarImage
                src={heroImage}
                alt={displayName}
                gradient={gradient}
                className="mx-auto h-20 w-full rounded-xl object-cover"
              />

              <Link
                to={`/cars/${car.slug}`}
                className="mt-3 block text-sm font-bold text-text-primary hover:text-brand-accent"
              >
                {displayName}
              </Link>
              <p className="mt-0.5 line-clamp-2 text-xs text-text-secondary">{car.variant}</p>
              <p className="mt-2 text-sm font-bold text-brand-accent">
                {formatStartingPrice(car.priceExShowroom)}
              </p>
            </div>
          </th>
        )
      })}
    </tr>
  )
}
