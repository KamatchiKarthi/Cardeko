import type { ICarSummary } from '@cardeko/types'
import { useState } from 'react'
import { HiBell, HiBellAlert } from 'react-icons/hi2'

import Badge from '@/components/ui/Badge'
import {
  formatExpectedPriceRange,
  formatLaunchDateLabel,
  getCarDisplayName,
  getColorSwatchClass,
} from '@/utils/car.utils'

interface UpcomingLaunchRowProps {
  car: ICarSummary
  index: number
}

const MAX_COLOR_SWATCHES = 4

export default function UpcomingLaunchRow({ car, index }: UpcomingLaunchRowProps) {
  const [isNotifying, setIsNotifying] = useState(false)
  const displayName = getCarDisplayName(car.make, car.model)
  const launchLabel = formatLaunchDateLabel(car.launchedAt, car.year)
  const priceRange = formatExpectedPriceRange(car.priceExShowroom, car.priceOnRoad)
  const visibleColors = (car.colors ?? []).slice(0, MAX_COLOR_SWATCHES)

  return (
    <div className="flex flex-col gap-4 border-b border-border py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-6">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex shrink-0 items-center -space-x-1.5">
          {visibleColors.map((colorName, colorIndex) => (
            <span
              key={`${car._id}-${colorName}`}
              title={colorName}
              className={[
                'size-7 rounded-full border-2 border-surface ring-1 ring-border',
                getColorSwatchClass(colorName, colorIndex + index),
              ].join(' ')}
            />
          ))}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-text-primary sm:text-lg">{displayName}</h3>
          <p className="mt-0.5 text-sm text-text-secondary">{launchLabel}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <Badge variant="warning">Expected</Badge>

        <p className="text-sm font-semibold text-text-primary">
          <span className="text-text-muted">Expected price </span>
          {priceRange}
        </p>

        <button
          type="button"
          onClick={() => setIsNotifying((current) => !current)}
          className={[
            'inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition',
            isNotifying
              ? 'bg-brand-accent text-white'
              : 'border border-border bg-surface text-text-primary hover:border-brand-accent hover:text-brand-accent',
          ].join(' ')}
        >
          {isNotifying ? (
            <HiBellAlert className="size-4" aria-hidden="true" />
          ) : (
            <HiBell className="size-4" aria-hidden="true" />
          )}
          {isNotifying ? 'Notifying' : 'Notify me'}
        </button>
      </div>
    </div>
  )
}
