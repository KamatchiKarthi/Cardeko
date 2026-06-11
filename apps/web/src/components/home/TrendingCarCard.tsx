import type { ICarSummary } from '@cardeko/types'
import { Link } from 'react-router-dom'

import {
  formatStartingPrice,
  formatWeeklyViews,
  getCarCardGradient,
  getCarDisplayName,
  getPopularityPercent,
} from '@/utils/car.utils'

interface TrendingCarCardProps {
  car: ICarSummary
  rank: number
  maxPopularity: number
}

export default function TrendingCarCard({ car, rank, maxPopularity }: TrendingCarCardProps) {
  const primaryColor = car.colors[0] ?? ''
  const gradient = getCarCardGradient(primaryColor, rank - 1)
  const popularityPercent = getPopularityPercent(car.popularityScore, maxPopularity)
  const displayName = getCarDisplayName(car.make, car.model)

  return (
    <Link
      to={`/cars/${car.slug}`}
      className={[
        'group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-5 shadow-md transition',
        'hover:-translate-y-0.5 hover:shadow-lg',
        gradient,
      ].join(' ')}
    >
      <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-black/25 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
        #{rank} Trending
      </span>

      <div className="mt-8">
        <h3 className="text-lg font-bold leading-snug text-white sm:text-xl">{displayName}</h3>
        <p className="mt-1 text-sm font-medium text-white/80">
          from {formatStartingPrice(car.priceExShowroom)}
        </p>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-white/70">
          <span>Popularity</span>
          <span>{popularityPercent}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{ width: `${popularityPercent}%` }}
          />
        </div>
        <p className="text-xs font-semibold text-white/90">
          {formatWeeklyViews(car.popularityScore)}
        </p>
      </div>
    </Link>
  )
}
