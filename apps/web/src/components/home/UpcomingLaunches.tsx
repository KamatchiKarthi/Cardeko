import { HiOutlineRocketLaunch } from 'react-icons/hi2'

import HomeApiError from './HomeApiError'
import HomeSectionHeader from './HomeSectionHeader'
import UpcomingLaunchRow from './UpcomingLaunchRow'

import { useGetUpcomingLaunchesQuery } from '@/features/cars/carsApi'

const UPCOMING_LIMIT = 3

function UpcomingRowSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-4 border-b border-border py-5 sm:flex-row sm:items-center sm:justify-between sm:py-6">
      <div className="flex items-center gap-4">
        <div className="flex -space-x-1.5">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="size-7 rounded-full bg-border" />
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-5 w-40 rounded bg-border" />
          <div className="h-4 w-28 rounded bg-border" />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-6 w-16 rounded-full bg-border" />
        <div className="h-4 w-32 rounded bg-border" />
        <div className="h-9 w-28 rounded-lg bg-border" />
      </div>
    </div>
  )
}

export default function UpcomingLaunches() {
  const { data: cars, isLoading, isError } = useGetUpcomingLaunchesQuery(UPCOMING_LIMIT)

  return (
    <section className="bg-surface py-12 sm:py-16">
      <div className="container-page">
        <HomeSectionHeader
          icon={
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand-highlight/15">
              <HiOutlineRocketLaunch className="size-5 text-brand-highlight" />
            </div>
          }
          eyebrow="Fresh arrivals"
          title="Upcoming Launches"
          viewAllHref="/explore?sort=newest"
        />

        {isError && <HomeApiError />}

        {!isError && (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-raised px-4 sm:px-6">
            {isLoading &&
              Array.from({ length: UPCOMING_LIMIT }, (_, index) => (
                <UpcomingRowSkeleton key={index} />
              ))}

            {!isLoading &&
              cars?.map((car, index) => (
                <UpcomingLaunchRow key={car._id} car={car} index={index} />
              ))}
          </div>
        )}
      </div>
    </section>
  )
}
