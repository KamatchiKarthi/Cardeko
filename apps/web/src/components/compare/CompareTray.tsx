import { HiArrowRight, HiScale, HiXMark } from 'react-icons/hi2'
import { Link } from 'react-router-dom'

import Button from '@/components/ui/Button'
import { MAX_COMPARE_CARS } from '@/features/compare/compare.constants'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  clearCompare,
  removeFromCompare,
  selectCompareCount,
  selectCompareIds,
} from '@/store/slices/compareSlice'

export default function CompareTray() {
  const dispatch = useAppDispatch()
  const compareIds = useAppSelector(selectCompareIds)
  const compareCount = useAppSelector(selectCompareCount)

  if (compareCount === 0) return null

  const canCompare = compareCount >= 2

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface shadow-lg">
      <div className="container-page flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-accent text-white">
            <HiScale className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary">
              {compareCount} of {MAX_COMPARE_CARS} cars selected
            </p>
            <p className="text-xs text-text-secondary">
              {canCompare ? 'Ready to compare side by side' : 'Select one more car to compare'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {compareIds.map((carId, index) => (
            <button
              key={carId}
              type="button"
              onClick={() => dispatch(removeFromCompare(carId))}
              className="flex items-center gap-1 rounded-full border border-border bg-surface-raised px-2.5 py-1 text-xs font-medium text-text-secondary transition hover:border-status-error hover:text-status-error"
              aria-label={`Remove car ${index + 1} from compare`}
            >
              Car {index + 1}
              <HiXMark className="size-3.5" />
            </button>
          ))}

          <Button type="button" variant="ghost" size="sm" onClick={() => dispatch(clearCompare())}>
            Clear all
          </Button>

          {canCompare ? (
            <Link to="/compare">
              <Button type="button" size="sm" className="gap-1.5">
                Compare now
                <HiArrowRight className="size-4" />
              </Button>
            </Link>
          ) : (
            <Button type="button" size="sm" disabled className="gap-1.5">
              Compare now
              <HiArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
