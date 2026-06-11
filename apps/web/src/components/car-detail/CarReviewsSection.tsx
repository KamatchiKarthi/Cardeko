import type { ICarReview } from '@cardeko/types'
import { HiStar } from 'react-icons/hi2'

import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import { formatReviewDate } from '@/features/car-detail/car-detail.utils'

interface CarReviewsSectionProps {
  reviews: ICarReview[]
  total: number
}

export default function CarReviewsSection({ reviews, total }: CarReviewsSectionProps) {
  return (
    <Card elevated>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-text-primary">Owner reviews</h2>
        <span className="text-sm text-text-secondary">
          {total} review{total === 1 ? '' : 's'}
        </span>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-text-muted">No reviews yet for this car.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <article
              key={review._id}
              className="rounded-xl border border-border bg-surface-raised p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-text-primary">{review.title}</h3>
                  <p className="mt-0.5 text-xs text-text-muted">
                    {formatReviewDate(review.createdAt)}
                    {review.verified && (
                      <Badge variant="success" className="ml-2">
                        Verified
                      </Badge>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">
                  <HiStar className="size-3.5" />
                  {review.ratings.overall.toFixed(1)}
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{review.body}</p>

              {(review.pros.length > 0 || review.cons.length > 0) && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {review.pros.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase text-status-success">Pros</p>
                      <ul className="mt-1 space-y-1">
                        {review.pros.map((pro) => (
                          <li key={pro} className="text-xs text-text-secondary">
                            + {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {review.cons.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase text-status-error">Cons</p>
                      <ul className="mt-1 space-y-1">
                        {review.cons.map((con) => (
                          <li key={con} className="text-xs text-text-secondary">
                            − {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </Card>
  )
}
