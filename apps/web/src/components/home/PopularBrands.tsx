import type { BodyType } from '@cardeko/types'
import { useState } from 'react'
import { HiOutlineBuildingStorefront } from 'react-icons/hi2'
import { Link } from 'react-router-dom'

import HomeApiError from './HomeApiError'
import PopularBrandCard from './PopularBrandCard'

import { useGetPopularBrandsQuery } from '@/features/cars/carsApi'

const BRANDS_LIMIT = 12

type BrandFilterValue = BodyType | null

interface BrandFilterTab {
  label: string
  value: BrandFilterValue
}

const BRAND_FILTER_TABS: BrandFilterTab[] = [
  { label: 'All Brands', value: null },
  { label: 'Hatchback', value: 'hatchback' },
  { label: 'SUV', value: 'suv' },
  { label: 'Sedan', value: 'sedan' },
  { label: 'MUV', value: 'minivan' },
]

function BrandCardSkeleton() {
  return (
    <div className="flex h-[168px] w-[300px] shrink-0 animate-pulse overflow-hidden rounded-2xl border border-border bg-surface sm:w-[320px]">
      <div className="w-24 bg-surface-overlay sm:w-28" />
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-border" />
          <div className="h-4 w-full rounded bg-border" />
          <div className="h-0.5 w-10 rounded bg-border" />
          <div className="h-3 w-20 rounded bg-border" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-6 w-24 rounded-full bg-border" />
          <div className="h-3 w-16 rounded bg-border" />
        </div>
      </div>
    </div>
  )
}

export default function PopularBrands() {
  const [activeFilter, setActiveFilter] = useState<BrandFilterValue>(null)
  const { data: brands, isLoading, isError } = useGetPopularBrandsQuery({
    bodyType: activeFilter,
    limit: BRANDS_LIMIT,
  })

  return (
    <section className="border-t border-border bg-surface-raised py-12 sm:py-16">
      <div className="container-page">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-brand-accent/10">
              <HiOutlineBuildingStorefront className="size-5 text-brand-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-accent">
                Shop by Brand
              </p>
              <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">Popular Brands</h2>
            </div>
          </div>

          <Link
            to="/explore"
            className="inline-flex h-10 items-center self-start rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-brand-accent transition hover:bg-surface-overlay sm:self-auto"
          >
            View all
          </Link>
        </div>

        <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {BRAND_FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.value
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActiveFilter(tab.value)}
                className={[
                  'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition',
                  isActive
                    ? 'bg-brand-accent text-white shadow-sm'
                    : 'border border-border bg-surface text-text-secondary hover:border-brand-accent/40 hover:text-brand-accent',
                ].join(' ')}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {isError && <HomeApiError />}

        {!isError && (
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory sm:mx-0 sm:px-0">
          {isLoading &&
            Array.from({ length: 4 }, (_, index) => <BrandCardSkeleton key={index} />)}

          {!isLoading &&
            brands?.map((brand, index) => (
              <PopularBrandCard key={brand.slug} brand={brand} index={index} />
            ))}
        </div>
        )}
      </div>
    </section>
  )
}
