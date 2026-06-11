import { HiOutlineViewfinderCircle, HiOutlineBookmark, HiOutlineSquares2X2 } from 'react-icons/hi2'
import { MdDirectionsCar } from 'react-icons/md'
import { Link, NavLink } from 'react-router-dom'

import { useAppSelector } from '../../store'
import { selectCompareCount } from '../../store/slices/compareSlice'
import { selectShortlistCount } from '../../store/slices/shortlistSlice'

export default function Navbar() {
  const shortlistCount = useAppSelector(selectShortlistCount)
  const compareCount = useAppSelector(selectCompareCount)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface">
      <div className="container-page flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-brand-primary">
          <MdDirectionsCar className="size-7 text-brand-accent" />
          <span className="text-xl font-bold tracking-tight">
            Car<span className="text-brand-accent">Deko</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          <NavItem
            to="/explore"
            icon={<HiOutlineViewfinderCircle className="size-5" />}
            label="Explore"
          />
          {compareCount > 0 && (
            <NavItem
              to="/compare"
              icon={<HiOutlineSquares2X2 className="size-5" />}
              label="Compare"
              count={compareCount}
            />
          )}
          <NavItem
            to="/shortlist"
            icon={<HiOutlineBookmark className="size-5" />}
            label="Shortlist"
            count={shortlistCount}
          />
        </nav>
      </div>
    </header>
  )
}

interface NavItemProps {
  to: string
  icon: React.ReactNode
  label: string
  count?: number
}

function NavItem({ to, icon, label, count }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-surface-overlay text-brand-accent'
            : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary',
        ].join(' ')
      }
    >
      <span className="relative">
        {icon}
        {count !== undefined && count > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-accent px-1 text-[10px] font-bold leading-none text-white">
            {count > 99 ? '99+' : count}
          </span>
        )}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </NavLink>
  )
}
