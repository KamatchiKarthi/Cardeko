import { Outlet } from 'react-router-dom'

import CompareTray from '@/components/compare/CompareTray'
import Navbar from '@/components/layout/Navbar'
import SiteFooter from '@/components/layout/SiteFooter'
import { useAppSelector } from '@/store'
import { selectCompareCount } from '@/store/slices/compareSlice'

export default function RootLayout() {
  const compareCount = useAppSelector(selectCompareCount)

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />

      <main className={['flex-1', compareCount > 0 ? 'pb-24' : ''].filter(Boolean).join(' ')}>
        <Outlet />
      </main>

      <CompareTray />
      <SiteFooter />
    </div>
  )
}
