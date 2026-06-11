import { Outlet } from 'react-router-dom'

import Navbar from '@/components/layout/Navbar'
import SiteFooter from '@/components/layout/SiteFooter'

export default function RootLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  )
}
