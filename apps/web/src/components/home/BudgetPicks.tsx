import { HiOutlineBanknotes } from 'react-icons/hi2'

import BudgetPortraitCard from './BudgetPortraitCard'
import HomeApiError from './HomeApiError'
import HomePortraitScroll from './HomePortraitScroll'
import HomeSectionHeader from './HomeSectionHeader'

import { useGetBudgetCarsQuery } from '@/features/cars/carsApi'

const BUDGET_LIMIT = 10

export default function BudgetPicks() {
  const { data: cars, isLoading, isError } = useGetBudgetCarsQuery(BUDGET_LIMIT)

  return (
    <section className="bg-brand-primary py-12 sm:py-16">
      <div className="container-page">
        <HomeSectionHeader
          tone="dark"
          icon={
            <div className="flex size-10 items-center justify-center rounded-xl bg-status-success/20">
              <HiOutlineBanknotes className="size-5 text-status-success" />
            </div>
          }
          eyebrow="Under ₹10 lakh"
          title="Budget Friendly"
          viewAllHref="/explore?priceMax=1000000"
        />

        {isError && <HomeApiError />}

        {!isError && (
          <HomePortraitScroll isLoading={isLoading} skeletonCount={6}>
            {cars?.map((car, index) => (
              <BudgetPortraitCard key={car._id} car={car} index={index} />
            ))}
          </HomePortraitScroll>
        )}
      </div>
    </section>
  )
}
