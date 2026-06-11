import { HiArrowLeft } from 'react-icons/hi2'
import { Link, useParams } from 'react-router-dom'

import CarDetailHero from '@/components/car-detail/CarDetailHero'
import CarDetailSkeleton from '@/components/car-detail/CarDetailSkeleton'
import CarDetailStatPills from '@/components/car-detail/CarDetailStatPills'
import CarFullSpecs from '@/components/car-detail/CarFullSpecs'
import CarProsConsGrid from '@/components/car-detail/CarProsConsGrid'
import CarReviewSummary from '@/components/car-detail/CarReviewSummary'
import CarReviewsSection from '@/components/car-detail/CarReviewsSection'
import CarWhyMatched from '@/components/car-detail/CarWhyMatched'
import HomeApiError from '@/components/home/HomeApiError'
import { aggregateReviewProsCons, buildReviewSummary } from '@/features/car-detail/car-detail.utils'
import { useGetCarByIdQuery } from '@/features/cars/carsApi'
import { useGetCarReviewsQuery } from '@/features/reviews/reviewsApi'

export default function CarDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const carKey = slug ?? ''

  const {
    data: car,
    isLoading: isCarLoading,
    isError: isCarError,
  } = useGetCarByIdQuery(carKey, { skip: !carKey })

  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    isError: isReviewsError,
  } = useGetCarReviewsQuery(
    { carId: car?._id ?? '', page: 1, pageSize: 50, sortBy: 'newest' },
    { skip: !car?._id }
  )

  if (!carKey) {
    return (
      <div className="container-page py-12">
        <HomeApiError message="Invalid car URL." />
      </div>
    )
  }

  if (isCarLoading || (isReviewsLoading && !reviewsData)) {
    return <CarDetailSkeleton />
  }

  if (isCarError || !car) {
    return (
      <div className="container-page py-12">
        <Link
          to="/explore"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-brand-accent"
        >
          <HiArrowLeft className="size-4" />
          Back to explore
        </Link>
        <HomeApiError message="Could not load this car. It may have been removed or the API is offline." />
      </div>
    )
  }

  const reviews = reviewsData?.data ?? []
  const reviewTotal = reviewsData?.total ?? 0
  const { pros, cons } = aggregateReviewProsCons(reviews)
  const reviewSummary = buildReviewSummary(reviews, reviewTotal)

  return (
    <div className="bg-surface-raised">
      <CarDetailHero car={car} />

      <div className="container-page max-w-4xl space-y-6 py-8">
        <CarDetailStatPills car={car} />
        <CarWhyMatched car={car} />
        <CarProsConsGrid pros={pros} cons={cons} />

        {isReviewsError ? (
          <HomeApiError message="Could not load reviews for this car." />
        ) : (
          <>
            <CarReviewSummary summary={reviewSummary} />
            <CarReviewsSection reviews={reviews} total={reviewTotal} />
          </>
        )}

        <CarFullSpecs car={car} />
      </div>
    </div>
  )
}
