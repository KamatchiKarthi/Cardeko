import type { ICarSummary } from '@cardeko/types'
import { Link } from 'react-router-dom'

import Badge from '@/components/ui/Badge'
import CarImage from '@/components/ui/CarImage'
import {
  formatStartingPrice,
  formatTagLabel,
  getCarCardGradient,
  getCarDisplayName,
  getCarHeroImage,
  getFeaturedTags,
} from '@/utils/car.utils'

interface PremiumPickCardProps {
  car: ICarSummary
  index: number
}

export default function PremiumPickCard({ car, index }: PremiumPickCardProps) {
  const primaryColor = car.colors?.[0] ?? ''
  const gradient = getCarCardGradient(primaryColor, index)
  const displayName = getCarDisplayName(car.make, car.model)
  const featuredTags = getFeaturedTags(car.tags)
  const heroImage = getCarHeroImage(car.images)

  return (
    <Link
      to={`/cars/${car.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-44 overflow-hidden bg-brand-primary sm:h-48">
        <CarImage
          src={heroImage}
          alt={displayName}
          gradient={gradient}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <span className="absolute left-3 top-3 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
          Premium
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div>
          <h3 className="line-clamp-1 text-lg font-bold text-text-primary">{displayName}</h3>
          <p className="mt-1 line-clamp-1 text-sm text-text-secondary">{car.variant}</p>
        </div>

        <p className="text-lg font-extrabold text-brand-primary">
          {formatStartingPrice(car.priceExShowroom)}
        </p>

        {featuredTags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5">
            {featuredTags.map((tag) => (
              <Badge key={tag} variant="accent" className="text-[11px]">
                {formatTagLabel(tag)}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
