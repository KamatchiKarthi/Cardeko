import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface HomeSectionHeaderProps {
  icon: ReactNode
  eyebrow: string
  title: string
  viewAllHref: string
  viewAllLabel?: string
  tone?: 'light' | 'dark'
}

export default function HomeSectionHeader({
  icon,
  eyebrow,
  title,
  viewAllHref,
  viewAllLabel = 'View all',
  tone = 'light',
}: HomeSectionHeaderProps) {
  const isDark = tone === 'dark'

  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <p
            className={[
              'text-sm font-semibold uppercase tracking-wider',
              isDark ? 'text-brand-highlight' : 'text-brand-accent',
            ].join(' ')}
          >
            {eyebrow}
          </p>
          <h2
            className={[
              'text-2xl font-bold sm:text-3xl',
              isDark ? 'text-white' : 'text-text-primary',
            ].join(' ')}
          >
            {title}
          </h2>
        </div>
      </div>

      <Link
        to={viewAllHref}
        className={[
          'inline-flex h-10 items-center self-start rounded-lg px-4 text-sm font-semibold transition sm:self-auto',
          isDark
            ? 'border border-white/20 bg-white/10 text-white hover:bg-white/20'
            : 'border border-border bg-surface text-brand-accent hover:bg-surface-overlay',
        ].join(' ')}
      >
        {viewAllLabel}
      </Link>
    </div>
  )
}
