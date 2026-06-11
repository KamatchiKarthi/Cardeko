import { HiOutlineSparkles } from 'react-icons/hi2'

import HomeApiError from './HomeApiError'
import HomeSectionHeader from './HomeSectionHeader'
import PremiumPickCard from './PremiumPickCard'

import { useGetPremiumCarsQuery } from '@/features/cars/carsApi'

const PREMIUM_LIMIT = 3

function PremiumCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="h-44 bg-surface-overlay sm:h-48" />
      <div className="space-y-3 p-4 sm:p-5">
        <div className="h-5 w-3/4 rounded bg-border" />
        <div className="h-4 w-1/2 rounded bg-border" />
        <div className="h-6 w-24 rounded bg-border" />
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-border" />
          <div className="h-5 w-20 rounded-full bg-border" />
        </div>
      </div>
    </div>
  )
}

export default function PremiumPicks() {
  const { data: cars, isLoading, isError } = useGetPremiumCarsQuery(PREMIUM_LIMIT)

  return (
    <section className="border-t border-border bg-surface-raised py-12 sm:py-16">
      <div className="container-page">
        <HomeSectionHeader
          icon={
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand-primary/10">
              <HiOutlineSparkles className="size-5 text-brand-primary" />
            </div>
          }
          eyebrow="Above ₹20 lakh"
          title="Premium Picks"
          viewAllHref="/explore?priceMin=2000000"
        />

        {isError && <HomeApiError />}

        {!isError && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading &&
            Array.from({ length: PREMIUM_LIMIT }, (_, index) => (
              <PremiumCardSkeleton key={index} />
            ))}

          {!isLoading &&
            cars?.map((car, index) => (
              <PremiumPickCard key={car._id} car={car} index={index} />
            ))}
        </div>
        )}
      </div>
    </section>
  )
}
