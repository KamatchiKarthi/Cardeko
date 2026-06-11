import { HiArrowRight, HiBookmark } from 'react-icons/hi2'
import { Link } from 'react-router-dom'

import HomeApiError from '@/components/home/HomeApiError'
import ShortlistCarRow from '@/components/shortlist/ShortlistCarRow'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { useShortlistCars } from '@/hooks/useShortlistCars'

export default function ShortlistPage() {
  const { cars, isLoading, isError, shortlistCount } = useShortlistCars()

  return (
    <div className="bg-surface-raised py-8 sm:py-10">
      <div className="container-page max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">My shortlist</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Cars you saved for later. Use &quot;Add to compare&quot; on any car when you want a
            side-by-side view.
          </p>
        </div>

        {isLoading && (
          <Card elevated>
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="h-24 rounded-xl bg-surface-overlay" />
              ))}
            </div>
          </Card>
        )}

        {isError && (
          <HomeApiError message="Could not load your shortlisted cars. Make sure the API server is running." />
        )}

        {!isLoading && !isError && shortlistCount === 0 && (
          <Card elevated className="text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
              <HiBookmark className="size-6" />
            </div>
            <p className="text-sm text-text-secondary">Your shortlist is empty.</p>
            <Link to="/explore" className="mt-4 inline-block">
              <Button type="button" className="gap-2">
                Explore cars
                <HiArrowRight className="size-4" />
              </Button>
            </Link>
          </Card>
        )}

        {!isLoading && !isError && cars.length > 0 && (
          <>
            <div className="space-y-3">
              {cars.map((car, index) => (
                <ShortlistCarRow key={car._id} car={car} index={index} />
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-text-secondary">
                {shortlistCount} car{shortlistCount === 1 ? '' : 's'} saved
              </p>
              <Link to="/explore">
                <Button type="button" variant="secondary" size="sm">
                  Add more cars
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
