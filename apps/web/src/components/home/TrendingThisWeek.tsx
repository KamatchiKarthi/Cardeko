import { HiOutlineFire } from 'react-icons/hi2'

import HomeApiError from './HomeApiError'
import TrendingCarCard from './TrendingCarCard'

import { useGetTrendingCarsQuery } from '@/features/cars/carsApi'

const TRENDING_LIMIT = 4

function TrendingCardSkeleton() {
  return (
    <div className="min-h-[220px] animate-pulse rounded-2xl bg-surface-overlay p-5">
      <div className="mb-8 h-5 w-24 rounded-full bg-border" />
      <div className="mb-2 h-6 w-3/4 rounded-md bg-border" />
      <div className="mb-6 h-4 w-1/2 rounded-md bg-border" />
      <div className="h-1.5 w-full rounded-full bg-border" />
      <div className="mt-2 h-3 w-2/5 rounded-md bg-border" />
    </div>
  )
}

export default function TrendingThisWeek() {
  const { data: cars, isLoading, isError } = useGetTrendingCarsQuery(TRENDING_LIMIT)

  const maxPopularity = cars?.reduce((peak, car) => Math.max(peak, car.popularityScore), 0) ?? 0

  return (
    <section className="bg-surface py-12 sm:py-16">
      <div className="container-page">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-highlight/15">
            <HiOutlineFire className="size-5 text-brand-highlight" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-accent">
              This Week
            </p>
            <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">Trending Cars</h2>
          </div>
        </div>

        {isError && <HomeApiError />}

        {!isError && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading &&
            Array.from({ length: TRENDING_LIMIT }, (_, index) => (
              <TrendingCardSkeleton key={index} />
            ))}

          {!isLoading &&
            cars?.map((car, index) => (
              <TrendingCarCard
                key={car._id}
                car={car}
                rank={index + 1}
                maxPopularity={maxPopularity}
              />
            ))}
        </div>
        )}
      </div>
    </section>
  )
}
