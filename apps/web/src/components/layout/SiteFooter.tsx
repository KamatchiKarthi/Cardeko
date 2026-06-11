import type { ICarSummary } from '@cardeko/types'
import {
  HiOutlineGlobeAlt,
  HiOutlineLink,
  HiOutlinePlay,
} from 'react-icons/hi2'
import { FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { MdDirectionsCar } from 'react-icons/md'
import { Link } from 'react-router-dom'

import { useGetPopularCarsQuery } from '@/features/cars/carsApi'
import { getCarDisplayName } from '@/utils/car.utils'

const EXPLORE_LINKS = [
  { label: 'All cars', href: '/explore' },
  { label: 'Trending this week', href: '/explore?sort=popularity' },
  { label: 'Premium picks', href: '/explore?priceMin=2000000' },
  { label: 'Budget under ₹10L', href: '/explore?priceMax=1000000' },
  { label: 'Upcoming launches', href: '/explore?sort=newest' },
]

const TOOL_LINKS = [
  { label: 'Find my car quiz', href: '/quiz' },
  { label: 'Compare cars', href: '/compare' },
  { label: 'My shortlist', href: '/shortlist' },
  { label: 'Browse by brand', href: '/explore' },
]

const SOCIAL_LINKS = [
  { label: 'Twitter', href: 'https://twitter.com', icon: FaXTwitter },
  { label: 'Instagram', href: 'https://instagram.com', icon: FaInstagram },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: FaLinkedinIn },
  { label: 'YouTube', href: 'https://youtube.com', icon: HiOutlinePlay },
]

function PopularCarLink({ car }: { car: ICarSummary }) {
  const name = getCarDisplayName(car.make, car.model)
  return (
    <li>
      <Link
        to={`/cars/${car.slug}`}
        className="text-sm text-slate-300 transition hover:text-white"
      >
        {name}
      </Link>
    </li>
  )
}

export default function SiteFooter() {
  const currentYear = new Date().getFullYear()
  const { data: popularCars } = useGetPopularCarsQuery(6)

  return (
    <footer className="bg-brand-primary text-white">
      <div className="container-page py-12 sm:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <MdDirectionsCar className="size-7 text-brand-highlight" />
              <span className="text-xl font-bold tracking-tight">
                Car<span className="text-brand-highlight">Deko</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">
              India&apos;s car research platform — compare specs, safety ratings, and real owner
              reviews to find the right car with confidence.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-300 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
              <HiOutlineGlobeAlt className="size-3.5" />
              Made for confused car buyers across India
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-white/70">
              <HiOutlineLink className="size-4" />
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-300 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">Tools</h3>
            <ul className="mt-4 space-y-2.5">
              {TOOL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-300 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular cars */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">
              Popular cars
            </h3>
            <ul className="mt-4 space-y-2.5">
              {popularCars?.map((car) => (
                <PopularCarLink key={car._id} car={car} />
              ))}
              {(!popularCars || popularCars.length === 0) && (
                <li className="text-sm text-slate-400">Loading popular cars…</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-center text-xs text-slate-400 sm:flex-row sm:text-left">
          <p>&copy; {currentYear} CarDeko. All rights reserved.</p>
          <p>Unbiased car research — not affiliated with any automaker or dealer.</p>
        </div>
      </div>
    </footer>
  )
}
