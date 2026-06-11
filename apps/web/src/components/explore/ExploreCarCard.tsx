import type { ExploreFilters, ICarListItem, QuizAnswers } from '@cardeko/types'
import { HiBolt, HiCog6Tooth, HiFire } from 'react-icons/hi2'
import { Link } from 'react-router-dom'

import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import {
  computeExploreMatchPercent,
  formatEngineLabel,
  formatMileageLabel,
  formatPowerLabel,
} from '@/features/explore/explore.utils'
import {
  formatStartingPrice,
  formatTagLabel,
  getCarCardGradient,
  getCarDisplayName,
  getFeaturedTags,
} from '@/utils/car.utils'

const CARD_ICON_STYLES = [
  { bg: 'bg-brand-accent', Icon: HiFire },
  { bg: 'bg-emerald-500', Icon: HiBolt },
  { bg: 'bg-violet-500', Icon: HiCog6Tooth },
  { bg: 'bg-amber-500', Icon: HiFire },
  { bg: 'bg-sky-500', Icon: HiBolt },
] as const

interface ExploreCarCardProps {
  car: ICarListItem
  index: number
  filters: ExploreFilters
  quizAnswers: QuizAnswers | null
  showTrophyBanner?: boolean
}

export default function ExploreCarCard({
  car,
  index,
  filters,
  quizAnswers,
  showTrophyBanner = false,
}: ExploreCarCardProps) {
  const iconStyle = CARD_ICON_STYLES[index % CARD_ICON_STYLES.length]
  const Icon = iconStyle.Icon
  const primaryColor = car.colors[0] ?? ''
  const gradient = getCarCardGradient(primaryColor, index)
  const displayName = getCarDisplayName(car.make, car.model)
  const matchPercent = computeExploreMatchPercent(car, filters, quizAnswers)
  const featureTags = getFeaturedTags(car.tags, 3)

  return (
    <Card elevated className="overflow-hidden">
      {showTrophyBanner && (
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
          <span aria-hidden>🏆</span>
          Best match for you
        </div>
      )}

      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:p-5">
        <div className="flex items-start gap-3 sm:w-48 sm:shrink-0">
          <div
            className={[
              'flex size-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm',
              iconStyle.bg,
            ].join(' ')}
          >
            <Icon className="size-5" aria-hidden />
          </div>
          <div className={['h-20 flex-1 rounded-xl bg-gradient-to-br sm:h-24', gradient].join(' ')} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <Link
                to={`/cars/${car.slug}`}
                className="text-lg font-bold text-text-primary transition hover:text-brand-accent"
              >
                {displayName}
              </Link>
              <p className="text-sm text-text-secondary">
                {car.variant} · {car.year}
              </p>
            </div>
            <p className="text-lg font-bold text-brand-accent">
              {formatStartingPrice(car.priceExShowroom)}
            </p>
          </div>

          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-xs font-medium">
              <span className="text-text-secondary">Match score</span>
              <span className="text-brand-accent">{matchPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-overlay">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-accent to-status-success"
                style={{ width: `${matchPercent}%` }}
              />
            </div>
          </div>

          {featureTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {featureTags.map((tag) => (
                <Badge key={tag} variant="accent">
                  {formatTagLabel(tag)}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-border bg-surface-raised px-3 py-2.5 text-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                Mileage
              </p>
              <p className="mt-0.5 text-xs font-bold text-text-primary">{formatMileageLabel(car)}</p>
            </div>
            <div className="border-x border-border">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                Power
              </p>
              <p className="mt-0.5 text-xs font-bold text-text-primary">{formatPowerLabel(car)}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                Engine
              </p>
              <p className="mt-0.5 text-xs font-bold text-text-primary">{formatEngineLabel(car)}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
