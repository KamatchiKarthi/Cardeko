import type { ICarSummary } from '@cardeko/types'
import { Link } from 'react-router-dom'

import CarImage from '@/components/ui/CarImage'
import {
  formatBodyAndFuel,
  formatStartingPrice,
  getCarCardGradient,
  getCarDisplayName,
  getCarHeroImage,
} from '@/utils/car.utils'

interface BudgetNetflixCardProps {
  car: ICarSummary
  index: number
}

export default function BudgetNetflixCard({ car, index }: BudgetNetflixCardProps) {
  const primaryColor = car.colors?.[0] ?? ''
  const gradient = getCarCardGradient(primaryColor, index)
  const displayName = getCarDisplayName(car.make, car.model)
  const heroImage = getCarHeroImage(car.images)

  return (
    <Link
      to={`/cars/${car.slug}`}
      className="group/card relative w-[150px] shrink-0 snap-start sm:w-[170px]"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg transition duration-300 ease-out group-hover/card:z-20 group-hover/card:scale-110 group-hover/card:shadow-xl">
        <CarImage
          src={heroImage}
          alt={displayName}
          gradient={gradient}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        <span className="absolute left-2 top-2 rounded bg-status-success/90 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
          Under ₹10L
        </span>

        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="line-clamp-2 text-sm font-bold leading-tight text-white">{displayName}</p>
          <p className="mt-1 line-clamp-1 text-[11px] text-white/75">{car.variant}</p>
          <p className="mt-1.5 text-xs font-bold text-brand-highlight">
            {formatStartingPrice(car.priceExShowroom)}
          </p>
          <p className="mt-0.5 text-[10px] text-white/60">
            {formatBodyAndFuel(car.bodyType, car.fuelType)}
          </p>
        </div>
      </div>
    </Link>
  )
}
