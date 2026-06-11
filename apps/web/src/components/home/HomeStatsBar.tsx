import type { ReactNode } from 'react'
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineCurrencyRupee,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiStar,
} from 'react-icons/hi2'

import { useGetHomeStatsQuery } from '@/features/cars/carsApi'

import HomeApiError from './HomeApiError'

function formatCarCount(count: number): string {
  return count >= 25 ? `${count}+` : String(count)
}

function formatReviewCount(count: number): string {
  if (count >= 1000) return `${Math.floor(count / 1000)}k+`
  if (count >= 100) return `${count}+`
  return String(count)
}

function StarRating() {
  return (
    <div className="mt-1 flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <HiStar key={index} className="size-4 text-brand-highlight" />
      ))}
    </div>
  )
}

interface StatItemProps {
  icon: ReactNode
  value: string
  label: string
  extra?: ReactNode
  loading?: boolean
}

function StatItem({ icon, value, label, extra, loading = false }: StatItemProps) {
  return (
    <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:text-left">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-accent/10">
        {icon}
      </div>
      <div className="min-w-0">
        {loading ? (
          <div className="mx-auto mb-1.5 h-7 w-20 animate-pulse rounded-md bg-surface-overlay sm:mx-0" />
        ) : (
          <p className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-[1.75rem]">
            {value}
          </p>
        )}
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        {!loading && extra}
      </div>
    </div>
  )
}

export default function HomeStatsBar() {
  const { data: stats, isLoading, isError } = useGetHomeStatsQuery()

  const carCount = stats ? formatCarCount(stats.totalCars) : '—'
  const priceRange = stats
    ? `₹${stats.priceRangeMinLakhs}–${stats.priceRangeMaxLakhs}L`
    : '—'
  const safetyCount = stats ? String(stats.fiveStarSafetyCount) : '—'
  const reviewCount = stats ? formatReviewCount(stats.totalReviews) : '—'

  return (
    <section className="border-b border-border bg-surface-raised">
      <div className="container-page py-8 sm:py-10">
        {isError && <HomeApiError />}
        {!isError && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <StatItem
            loading={isLoading}
            icon={<HiOutlineTruck className="size-5 text-brand-accent" />}
            value={carCount}
            label="Cars researched"
          />
          <StatItem
            loading={isLoading}
            icon={<HiOutlineCurrencyRupee className="size-5 text-brand-accent" />}
            value={priceRange}
            label="Price range covered"
          />
          <StatItem
            loading={isLoading}
            icon={<HiOutlineShieldCheck className="size-5 text-brand-accent" />}
            value={safetyCount}
            label="5-star NCAP safety data"
            extra={<StarRating />}
          />
          <StatItem
            loading={isLoading}
            icon={<HiOutlineChatBubbleLeftRight className="size-5 text-brand-accent" />}
            value={reviewCount}
            label="Real owner reviews"
          />
        </div>
        )}
      </div>
    </section>
  )
}
