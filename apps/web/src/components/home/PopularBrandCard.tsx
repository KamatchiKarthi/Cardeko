import type { IPopularBrand } from '@cardeko/types'
import { HiArrowRight } from 'react-icons/hi2'
import { Link } from 'react-router-dom'

import { formatModelCount, getBrandGradient, getBrandInitials } from '@/utils/brand.utils'
import { formatStartingPrice } from '@/utils/car.utils'

interface PopularBrandCardProps {
  brand: IPopularBrand
  index: number
}

export default function PopularBrandCard({ brand, index }: PopularBrandCardProps) {
  const gradient = getBrandGradient(brand.make, index)
  const initials = getBrandInitials(brand.make)
  const topModelsLabel = brand.topModels.join(', ')

  return (
    <article className="flex w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:w-[320px]">
      <div
        className={[
          'flex w-24 shrink-0 flex-col items-center justify-center gap-2 bg-gradient-to-b px-3 py-5 sm:w-28',
          gradient,
        ].join(' ')}
      >
        <div className="flex size-11 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">
          {initials}
        </div>
        <p className="text-center text-xs font-bold leading-tight text-white">{brand.make}</p>
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Top models</p>
          <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-text-primary">
            {topModelsLabel}
          </p>
          <div className="mt-2 h-0.5 w-10 rounded-full bg-brand-accent" />
          <p className="mt-2 text-xs font-medium text-text-secondary">
            {formatModelCount(brand.modelCount)}
          </p>
        </div>

        <div className="mt-4 flex items-end justify-between gap-3">
          <span className="rounded-full bg-brand-highlight/15 px-2.5 py-1 text-xs font-bold text-brand-highlight">
            from {formatStartingPrice(brand.startingPrice)}
          </span>
          <Link
            to={`/explore?make=${brand.slug}`}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-brand-accent transition hover:gap-1.5"
          >
            View brand
            <HiArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}
