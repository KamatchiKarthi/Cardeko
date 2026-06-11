import { HiArrowRight } from 'react-icons/hi2'
import { Link } from 'react-router-dom'

import CompareSpecTable from '@/components/compare/CompareSpecTable'
import HomeApiError from '@/components/home/HomeApiError'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { MAX_COMPARE_CARS } from '@/features/compare/compare.constants'
import { useShortlistCars } from '@/hooks/useShortlistCars'

export default function ComparePage() {
  const { cars, compareIds, isLoading, isError, shortlistCount } = useShortlistCars()

  return (
    <div className="bg-surface-raised py-8 sm:py-10">
      <div className="container-page">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Compare cars</h1>
            <p className="mt-1 text-sm text-text-secondary">
              Side-by-side specs for up to {MAX_COMPARE_CARS} cars from your shortlist — like
              91mobiles.
            </p>
          </div>
          {shortlistCount > MAX_COMPARE_CARS && (
            <p className="text-xs font-medium text-status-warning">
              Showing first {MAX_COMPARE_CARS} of {shortlistCount} shortlisted cars
            </p>
          )}
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
          <HomeApiError message="Could not load shortlisted cars. Make sure the API server is running." />
        )}

        {!isLoading && !isError && compareIds.length === 0 && (
          <Card elevated className="text-center">
            <p className="text-sm text-text-secondary">
              Your shortlist is empty. Add up to {MAX_COMPARE_CARS} cars to compare them here.
            </p>
            <Link to="/explore" className="mt-4 inline-block">
              <Button type="button" className="gap-2">
                Browse cars
                <HiArrowRight className="size-4" />
              </Button>
            </Link>
          </Card>
        )}

        {!isLoading && !isError && compareIds.length > 0 && (
          <>
            <p className="mb-3 text-xs text-text-muted">
              <span className="inline-block size-2 rounded-full bg-status-success" /> Green =
              best value in row
            </p>
            <CompareSpecTable cars={cars} />
          </>
        )}
      </div>
    </div>
  )
}
