import type { ReactNode } from 'react'
import {
  HiOutlineScale,
  HiOutlineShieldCheck,
  HiOutlineStar,
  HiOutlineTruck,
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

interface TrustStatCardProps {
  icon: ReactNode
  value: string
  label: string
  description: string
  loading?: boolean
}

function TrustStatCard({ icon, value, label, description, loading = false }: TrustStatCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-brand-accent/10">
        {icon}
      </div>
      {loading ? (
        <div className="mb-2 h-8 w-20 animate-pulse rounded bg-surface-overlay" />
      ) : (
        <p className="text-3xl font-extrabold tracking-tight text-text-primary">{value}</p>
      )}
      <p className="mt-1 text-sm font-semibold text-text-primary">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>
    </div>
  )
}

export default function WhyTrustUs() {
  const { data: stats, isLoading, isError } = useGetHomeStatsQuery()

  const carCount = stats ? formatCarCount(stats.totalCars) : '—'
  const reviewCount = stats ? formatReviewCount(stats.totalReviews) : '—'
  const safetyCount = stats ? String(stats.fiveStarSafetyCount) : '—'
  const priceRange = stats
    ? `₹${stats.priceRangeMinLakhs}–${stats.priceRangeMaxLakhs}L`
    : '—'

  return (
    <section className="border-t border-border bg-surface-raised py-12 sm:py-16">
      <div className="container-page">
        <div className="mb-8 text-center sm:mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-accent">
            Built for buyers
          </p>
          <h2 className="mt-1 text-2xl font-bold text-text-primary sm:text-3xl">Why Trust CarDeko?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-text-secondary sm:text-base">
            Unbiased research, real owner voices, and safety data you can actually use — not dealer
            brochures.
          </p>
        </div>

        {isError && <HomeApiError />}

        {!isError && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <TrustStatCard
              loading={isLoading}
              icon={<HiOutlineTruck className="size-5 text-brand-accent" />}
              value={carCount}
              label="Cars researched"
              description="Every variant spec-checked and kept up to date for Indian buyers."
            />
            <TrustStatCard
              loading={isLoading}
              icon={<HiOutlineStar className="size-5 text-brand-accent" />}
              value={reviewCount}
              label="Real owner reviews"
              description="Verified ratings on comfort, mileage, value, and maintenance."
            />
            <TrustStatCard
              loading={isLoading}
              icon={<HiOutlineShieldCheck className="size-5 text-brand-accent" />}
              value={safetyCount}
              label="5-star NCAP rated"
              description="Safety scores from GLOBAL, BHARAT, and EURO NCAP tests."
            />
            <TrustStatCard
              loading={isLoading}
              icon={<HiOutlineScale className="size-5 text-brand-accent" />}
              value={priceRange}
              label="Full price coverage"
              description="From budget hatchbacks to premium SUVs — compare with confidence."
            />
          </div>
        )}
      </div>
    </section>
  )
}
