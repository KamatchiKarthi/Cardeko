import { HiArrowRight } from 'react-icons/hi2'
import { Link } from 'react-router-dom'

import CarComparisonTable from '@/components/compare/CarComparisonTable'
import HomeApiError from '@/components/home/HomeApiError'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { MAX_COMPARE_CARS } from '@/features/compare/compare.constants'
import { useCompareCars } from '@/hooks/useCompareCars'

export default function ComparePage() {
  const { cars, compareIds, isLoading, isError, compareCount } = useCompareCars()

  return (
    <div className="bg-surface-raised py-8 sm:py-10">
      <div className="container-page">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Compare cars</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Side-by-side specs for up to {MAX_COMPARE_CARS} cars you picked from explore, details,
            or shortlist.
          </p>
        </div>

        {isLoading && (
          <Card elevated>
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-1/3 rounded-full bg-surface-overlay" />
              <div className="h-64 rounded-xl bg-surface-overlay" />
            </div>
          </Card>
        )}

        {isError && (
          <HomeApiError message="Could not load cars for comparison. Make sure the API server is running." />
        )}

        {!isLoading && !isError && compareCount === 0 && (
          <Card elevated className="text-center">
            <p className="text-sm text-text-secondary">
              No cars selected yet. Use &quot;Add to compare&quot; on any car while browsing.
            </p>
            <Link to="/explore" className="mt-4 inline-block">
              <Button type="button" className="gap-2">
                Browse cars
                <HiArrowRight className="size-4" />
              </Button>
            </Link>
          </Card>
        )}

        {!isLoading && !isError && compareCount === 1 && (
          <Card elevated className="text-center">
            <p className="text-sm text-text-secondary">
              Add one more car to start comparing. You can pick from explore or any car detail page.
            </p>
            <Link to="/explore" className="mt-4 inline-block">
              <Button type="button" className="gap-2">
                Find another car
                <HiArrowRight className="size-4" />
              </Button>
            </Link>
          </Card>
        )}

        {!isLoading && !isError && compareIds.length >= 2 && (
          <>
            <p className="mb-3 text-xs text-text-muted">
              <span className="inline-block size-2 rounded-full bg-status-success" /> Green values
              highlight the strongest option in each row
            </p>
            <CarComparisonTable cars={cars} />
          </>
        )}
      </div>
    </div>
  )
}
