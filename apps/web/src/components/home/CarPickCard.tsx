import type { ICarSummary } from '@cardeko/types'
import { Link } from 'react-router-dom'

import {
  formatBodyAndFuel,
  formatLaunchDate,
  formatStartingPrice,
  getCarCardGradient,
  getCarDisplayName,
} from '@/utils/car.utils'

interface CarPickCardProps {
  car: ICarSummary
  index: number
  badgeLabel?: string
  badgeClassName?: string
}

export default function CarPickCard({
  car,
  index,
  badgeLabel,
  badgeClassName = 'bg-brand-highlight/90 text-white',
}: CarPickCardProps) {
  const primaryColor = car.colors[0] ?? ''
  const gradient = getCarCardGradient(primaryColor, index)
  const displayName = getCarDisplayName(car.make, car.model)
  const launchLabel = car.launchedAt ? formatLaunchDate(car.launchedAt) : null
  const isFutureLaunch = car.launchedAt ? new Date(car.launchedAt) > new Date() : false

  return (
    <Link
      to={`/cars/${car.slug}`}
      className="group flex w-[260px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:w-[280px]"
    >
      <div className={['relative h-28 bg-gradient-to-br', gradient].join(' ')}>
        {(badgeLabel ?? (isFutureLaunch && launchLabel)) && (
          <span
            className={[
              'absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide',
              badgeClassName,
            ].join(' ')}
          >
            {badgeLabel ?? launchLabel}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="line-clamp-1 text-base font-bold text-text-primary">{displayName}</h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-text-secondary">
            {car.variant} · {car.year}
          </p>
        </div>

        <p className="text-xs font-medium text-text-muted">
          {formatBodyAndFuel(car.bodyType, car.fuelType)}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2">
          <span className="rounded-full bg-brand-accent/10 px-2.5 py-1 text-xs font-bold text-brand-accent">
            from {formatStartingPrice(car.priceExShowroom)}
          </span>
          {!isFutureLaunch && launchLabel && (
            <span className="text-[11px] font-medium text-text-muted">{launchLabel}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
