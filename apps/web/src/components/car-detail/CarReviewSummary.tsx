import { HiOutlineStar, HiStar } from 'react-icons/hi2'

import Card from '@/components/ui/Card'
import type { ReviewSummary } from '@/features/car-detail/car-detail.utils'


interface CarReviewSummaryProps {
  summary: ReviewSummary
}

function StarRatingDisplay({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75
  const roundUp = rating - fullStars >= 0.75

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const starIndex = index + 1
        const isFilled = starIndex <= fullStars || (roundUp && starIndex === fullStars + 1)
        const isHalf = hasHalf && starIndex === fullStars + 1

        if (isFilled) {
          return <HiStar key={starIndex} className="size-5 text-amber-500" />
        }
        if (isHalf) {
          return (
            <span key={starIndex} className="relative size-5">
              <HiOutlineStar className="absolute size-5 text-amber-300" />
              <HiStar className="absolute size-5 text-amber-500 [clip-path:inset(0_50%_0_0)]" />
            </span>
          )
        }
        return <HiOutlineStar key={starIndex} className="size-5 text-amber-300" />
      })}
    </div>
  )
}

function StarDistributionBars({ buckets }: { buckets: ReviewSummary['starBuckets'] }) {
  const maxCount = Math.max(...buckets.map((bucket) => bucket.count), 1)

  return (
    <div className="space-y-1.5">
      {buckets.map((bucket) => (
        <div key={bucket.star} className="flex items-center gap-2 text-xs">
          <span className="w-7 shrink-0 font-medium text-text-secondary">{bucket.star}★</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-overlay">
            <div
              className="h-full rounded-full bg-amber-400 transition-all"
              style={{ width: `${(bucket.count / maxCount) * 100}%` }}
            />
          </div>
          <span className="w-6 shrink-0 text-right text-text-muted">{bucket.count}</span>
        </div>
      ))}
    </div>
  )
}

function CategoryRatingBars({ categories }: { categories: ReviewSummary['categoryScores'] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <div
          key={category.key}
          className="rounded-lg border border-border bg-surface-raised px-3 py-2.5"
        >
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-text-secondary">{category.label}</span>
            <span className="text-xs font-bold text-text-primary">
              {category.average.toFixed(1)}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-overlay">
            <div
              className="h-full rounded-full bg-brand-accent"
              style={{ width: `${(category.average / 5) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function CarReviewSummary({ summary }: CarReviewSummaryProps) {
  if (summary.totalReviews === 0) {
    return (
      <Card elevated>
        <h2 className="text-lg font-bold text-text-primary">Review summary</h2>
        <p className="mt-2 text-sm text-text-muted">No owner reviews yet.</p>
      </Card>
    )
  }

  return (
    <Card elevated className="space-y-6">
      <h2 className="text-lg font-bold text-text-primary">Review summary</h2>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="shrink-0 text-center lg:text-left">
          <p className="text-5xl font-bold leading-none text-text-primary">
            {summary.averageOverall.toFixed(1)}
          </p>
          <div className="mt-2 flex justify-center lg:justify-start">
            <StarRatingDisplay rating={summary.averageOverall} />
          </div>
          <p className="mt-2 text-sm text-text-secondary">
            {summary.totalReviews.toLocaleString('en-IN')} review
            {summary.totalReviews === 1 ? '' : 's'}
          </p>
        </div>

        <div className="min-w-0 flex-1 lg:max-w-sm">
          <StarDistributionBars buckets={summary.starBuckets} />
        </div>
      </div>

      {summary.categoryScores.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-text-muted">
            Category ratings
          </h3>
          <CategoryRatingBars categories={summary.categoryScores} />
        </div>
      )}

      {(summary.likedTags.length > 0 || summary.dislikedTags.length > 0) && (
        <div>
          <h3 className="mb-3 text-sm font-bold text-text-primary">What owners commonly say</h3>

          {summary.likedTags.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-status-success">
                Liked
              </p>
              <div className="flex flex-wrap gap-2">
                {summary.likedTags.map((tag) => (
                  <span
                    key={tag.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-status-success/30 bg-green-50 px-3 py-1 text-xs font-medium text-status-success"
                  >
                    {tag.label}
                    <span className="rounded-full bg-status-success/15 px-1.5 py-0.5 text-[10px] font-bold">
                      {tag.count}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {summary.dislikedTags.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-status-error">
                Disliked
              </p>
              <div className="flex flex-wrap gap-2">
                {summary.dislikedTags.map((tag) => (
                  <span
                    key={tag.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-status-error/30 bg-red-50 px-3 py-1 text-xs font-medium text-status-error"
                  >
                    {tag.label}
                    <span className="rounded-full bg-status-error/15 px-1.5 py-0.5 text-[10px] font-bold">
                      {tag.count}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
