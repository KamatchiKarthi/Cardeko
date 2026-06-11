import type { ICar } from '@cardeko/types'
import { HiXMark } from 'react-icons/hi2'
import { Link } from 'react-router-dom'

import AddToCompareButton from '@/components/compare/AddToCompareButton'
import Button from '@/components/ui/Button'
import CarImage from '@/components/ui/CarImage'
import { useAppDispatch } from '@/store'
import { removeFromShortlist } from '@/store/slices/shortlistSlice'
import {
  formatStartingPrice,
  getCarCardGradient,
  getCarDisplayName,
  getCarHeroImage,
} from '@/utils/car.utils'

interface ShortlistCarRowProps {
  car: ICar
  index: number
}

export default function ShortlistCarRow({ car, index }: ShortlistCarRowProps) {
  const dispatch = useAppDispatch()
  const displayName = getCarDisplayName(car.make, car.model)
  const gradient = getCarCardGradient(car.colors[0] ?? '', index)
  const heroImage = getCarHeroImage(car.images)

  return (
    <div className="flex gap-4 rounded-xl border border-border bg-surface p-4 shadow-sm">
      <CarImage
        src={heroImage}
        alt={displayName}
        gradient={gradient}
        className="h-20 w-28 shrink-0 rounded-lg object-cover sm:h-24 sm:w-32"
      />

      <div className="min-w-0 flex-1">
        <Link
          to={`/cars/${car.slug}`}
          className="text-base font-bold text-text-primary hover:text-brand-accent"
        >
          {displayName}
        </Link>
        <p className="mt-0.5 text-sm text-text-secondary">
          {car.variant} · {car.year}
        </p>
        <p className="mt-1 text-sm font-bold text-brand-accent">
          {formatStartingPrice(car.priceExShowroom)}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-2 self-start">
        <AddToCompareButton carId={car._id} size="sm" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="size-8 p-0"
          onClick={() => dispatch(removeFromShortlist(car._id))}
          aria-label={`Remove ${displayName} from shortlist`}
        >
          <HiXMark className="size-5" />
        </Button>
      </div>
    </div>
  )
}
