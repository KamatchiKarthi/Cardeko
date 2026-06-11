import BudgetPicks from '@/components/home/BudgetPicks'
import HeroSection from '@/components/home/HeroSection'
import HomeStatsBar from '@/components/home/HomeStatsBar'
import PopularBrands from '@/components/home/PopularBrands'
import PremiumPicks from '@/components/home/PremiumPicks'
import TrendingThisWeek from '@/components/home/TrendingThisWeek'
import UpcomingLaunches from '@/components/home/UpcomingLaunches'
import WhyTrustUs from '@/components/home/WhyTrustUs'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HomeStatsBar />
      <TrendingThisWeek />
      <PopularBrands />
      <UpcomingLaunches />
      <PremiumPicks />
      <BudgetPicks />
      <WhyTrustUs />
    </>
  )
}
