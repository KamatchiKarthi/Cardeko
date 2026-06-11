import type { ExploreFilters, ExploreSortTab } from '@cardeko/types'
import { useEffect, useMemo, useState } from 'react'
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2'
import { useSearchParams } from 'react-router-dom'

import ExploreCarCard from '@/components/explore/ExploreCarCard'
import ExploreCarListSkeleton from '@/components/explore/ExploreCarListSkeleton'
import ExploreFilterSidebar from '@/components/explore/ExploreFilterSidebar'
import ExploreShortlistBar from '@/components/explore/ExploreShortlistBar'
import ExploreSortTabs from '@/components/explore/ExploreSortTabs'
import HomeApiError from '@/components/home/HomeApiError'
import Button from '@/components/ui/Button'
import { useGetCarsQuery, useGetHomeStatsQuery } from '@/features/cars/carsApi'
import {
  EXPLORE_DEFAULT_PRICE_MAX,
  EXPLORE_DEFAULT_PRICE_MIN,
} from '@/features/explore/explore.constants'
import {
  buildExploreSearchParams,
  computeExploreMatchPercent,
  filtersToUrlSearchParams,
  parseExploreFiltersFromSearch,
  parseExploreSortFromSearch,
} from '@/features/explore/explore.utils'
import { useAppSelector } from '@/store'
import { selectQuizAnswers, selectQuizComplete } from '@/store/slices/quizSlice'

const DEFAULT_FILTERS: ExploreFilters = {
  priceMin: EXPLORE_DEFAULT_PRICE_MIN,
  priceMax: EXPLORE_DEFAULT_PRICE_MAX,
  bodyTypes: [],
  fuelTypes: [],
  seatingCapacities: [],
  make: '',
}

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const quizAnswers = useAppSelector(selectQuizAnswers)
  const quizComplete = useAppSelector(selectQuizComplete)

  const [filters, setFilters] = useState<ExploreFilters>(() =>
    parseExploreFiltersFromSearch(searchParams)
  )
  const [sortTab, setSortTab] = useState<ExploreSortTab>(() =>
    parseExploreSortFromSearch(searchParams)
  )

  const { data: homeStats } = useGetHomeStatsQuery()
  const priceRangeMin = (homeStats?.priceRangeMinLakhs ?? 3) * 100_000
  const priceRangeMax = (homeStats?.priceRangeMaxLakhs ?? 50) * 100_000

  const searchQuery = useMemo(() => buildExploreSearchParams(filters, sortTab), [filters, sortTab])

  const { data, isLoading, isFetching, isError } = useGetCarsQuery(searchQuery)

  useEffect(() => {
    const nextParams = filtersToUrlSearchParams(filters, sortTab)
    setSearchParams(nextParams, { replace: true })
  }, [filters, sortTab, setSearchParams])

  const cars = useMemo(() => data?.data ?? [], [data?.data])
  const totalCount = data?.total ?? 0

  const displayedCars = useMemo(() => {
    if (!quizComplete || sortTab !== 'best-match') return cars

    return [...cars].sort(
      (left, right) =>
        computeExploreMatchPercent(right, filters, quizAnswers) -
        computeExploreMatchPercent(left, filters, quizAnswers)
    )
  }, [cars, filters, quizAnswers, quizComplete, sortTab])

  const handleFiltersChange = (nextFilters: ExploreFilters) => {
    setFilters(nextFilters)
  }

  const handleResetFilters = () => {
    setFilters({
      ...DEFAULT_FILTERS,
      priceMin: priceRangeMin,
      priceMax: priceRangeMax,
    })
  }

  const handleSortChange = (nextTab: ExploreSortTab) => {
    setSortTab(nextTab)
  }

  return (
    <div className="bg-surface-raised py-8 sm:py-10">
      <div className="container-page">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Explore cars</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Filter by budget, body type, fuel, and seating. Tap a card for full details — bookmark
              to save for later.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="gap-2 lg:hidden"
            onClick={() => setMobileFiltersOpen((open) => !open)}
          >
            <HiOutlineAdjustmentsHorizontal className="size-4" />
            {mobileFiltersOpen ? 'Hide filters' : 'Show filters'}
          </Button>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <aside
            className={[
              'w-full shrink-0 lg:w-72 xl:w-80',
              mobileFiltersOpen ? 'block' : 'hidden lg:block',
            ].join(' ')}
          >
            <ExploreFilterSidebar
              filters={filters}
              priceRangeMin={priceRangeMin}
              priceRangeMax={priceRangeMax}
              onChange={handleFiltersChange}
              onReset={handleResetFilters}
            />
          </aside>

          <div className="min-w-0 flex-1">
            <ExploreSortTabs
              activeTab={sortTab}
              onChange={handleSortChange}
              totalCount={totalCount}
            />

            <div className="mt-4">
              <ExploreShortlistBar />
            </div>

            <div className="mt-5">
              {(isLoading || isFetching) && cars.length === 0 && <ExploreCarListSkeleton />}

              {isError && (
                <HomeApiError message="Could not load cars. Make sure the API server is running." />
              )}

              {!isLoading && !isError && cars.length === 0 && (
                <div className="rounded-2xl border border-border bg-surface p-8 text-center">
                  <p className="text-sm text-text-secondary">
                    No cars match your filters. Try widening your budget or clearing a filter.
                  </p>
                  <Button type="button" className="mt-4" onClick={handleResetFilters}>
                    Reset filters
                  </Button>
                </div>
              )}

              {!isError && displayedCars.length > 0 && (
                <div className="space-y-4">
                  {displayedCars.map((car, index) => (
                    <ExploreCarCard
                      key={car._id}
                      car={car}
                      index={index}
                      filters={filters}
                      quizAnswers={quizComplete ? quizAnswers : null}
                      showTrophyBanner={quizComplete && sortTab === 'best-match' && index === 0}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
