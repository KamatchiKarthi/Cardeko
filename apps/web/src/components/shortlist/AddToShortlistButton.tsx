import type { MouseEvent } from 'react'
import { HiBookmark, HiCheck } from 'react-icons/hi2'

import Button from '@/components/ui/Button'
import { MAX_SHORTLIST_CARS } from '@/features/shortlist/shortlist.constants'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  addToShortlist,
  removeFromShortlist,
  selectShortlistCount,
  selectShortlistIds,
} from '@/store/slices/shortlistSlice'

interface AddToShortlistButtonProps {
  carId: string
  size?: 'sm' | 'md'
  compact?: boolean
  className?: string
}

export default function AddToShortlistButton({
  carId,
  size = 'sm',
  compact = false,
  className = '',
}: AddToShortlistButtonProps) {
  const dispatch = useAppDispatch()
  const shortlistIds = useAppSelector(selectShortlistIds)
  const shortlistCount = useAppSelector(selectShortlistCount)
  const isShortlisted = shortlistIds.includes(carId)
  const isShortlistFull = shortlistCount >= MAX_SHORTLIST_CARS && !isShortlisted

  const titleText = isShortlistFull
    ? `Shortlist full (${MAX_SHORTLIST_CARS} cars). Remove one to add another.`
    : isShortlisted
      ? 'Remove from shortlist'
      : 'Add to shortlist'

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (isShortlisted) {
      dispatch(removeFromShortlist(carId))
      return
    }

    if (isShortlistFull) return
    dispatch(addToShortlist(carId))
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isShortlistFull}
        title={titleText}
        aria-label={titleText}
        className={[
          'flex size-9 items-center justify-center rounded-full border shadow-md transition',
          isShortlisted
            ? 'border-status-success bg-status-success text-white'
            : 'border-white/40 bg-black/50 text-white backdrop-blur-sm hover:bg-black/70',
          isShortlistFull ? 'cursor-not-allowed opacity-50' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {isShortlisted ? <HiCheck className="size-5" /> : <HiBookmark className="size-5" />}
      </button>
    )
  }

  return (
    <Button
      type="button"
      variant={isShortlisted ? 'secondary' : 'primary'}
      size={size}
      onClick={handleClick}
      disabled={isShortlistFull}
      title={titleText}
      className={['gap-1.5', className].filter(Boolean).join(' ')}
    >
      {isShortlisted ? (
        <>
          <HiCheck className="size-4" />
          Shortlisted
        </>
      ) : (
        <>
          <HiBookmark className="size-4" />
          {isShortlistFull ? 'Shortlist full' : 'Add to shortlist'}
        </>
      )}
    </Button>
  )
}
