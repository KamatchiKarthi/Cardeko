import type { MouseEvent } from 'react'
import { HiCheck, HiScale } from 'react-icons/hi2'

import Button from '@/components/ui/Button'
import { MAX_COMPARE_CARS } from '@/features/compare/compare.constants'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  addToCompare,
  removeFromCompare,
  selectCompareCount,
  selectCompareIds,
} from '@/store/slices/compareSlice'

interface AddToCompareButtonProps {
  carId: string
  size?: 'sm' | 'md'
  compact?: boolean
  className?: string
}

export default function AddToCompareButton({
  carId,
  size = 'sm',
  compact = false,
  className = '',
}: AddToCompareButtonProps) {
  const dispatch = useAppDispatch()
  const compareIds = useAppSelector(selectCompareIds)
  const compareCount = useAppSelector(selectCompareCount)
  const isInCompare = compareIds.includes(carId)
  const isCompareFull = compareCount >= MAX_COMPARE_CARS && !isInCompare

  const titleText = isCompareFull
    ? `Compare list full (${MAX_COMPARE_CARS} cars). Remove one to add another.`
    : isInCompare
      ? 'Remove from compare'
      : 'Add to compare'

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (isInCompare) {
      dispatch(removeFromCompare(carId))
      return
    }

    if (isCompareFull) return
    dispatch(addToCompare(carId))
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isCompareFull}
        title={titleText}
        aria-label={titleText}
        className={[
          'flex size-9 items-center justify-center rounded-full border shadow-md transition',
          isInCompare
            ? 'border-brand-accent bg-brand-accent text-white'
            : 'border-white/40 bg-black/50 text-white backdrop-blur-sm hover:bg-black/70',
          isCompareFull ? 'cursor-not-allowed opacity-50' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {isInCompare ? <HiCheck className="size-5" /> : <HiScale className="size-5" />}
      </button>
    )
  }

  return (
    <Button
      type="button"
      variant={isInCompare ? 'secondary' : 'primary'}
      size={size}
      onClick={handleClick}
      disabled={isCompareFull}
      title={titleText}
      className={['gap-1.5', className].filter(Boolean).join(' ')}
    >
      {isInCompare ? (
        <>
          <HiCheck className="size-4" />
          Added to compare
        </>
      ) : (
        <>
          <HiScale className="size-4" />
          {isCompareFull ? 'Compare full' : 'Add to compare'}
        </>
      )}
    </Button>
  )
}
