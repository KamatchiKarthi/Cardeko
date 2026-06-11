import type { ExploreSortTab } from '@cardeko/types'

import { EXPLORE_SORT_TABS } from '@/features/explore/explore.constants'

interface ExploreSortTabsProps {
  activeTab: ExploreSortTab
  onChange: (tab: ExploreSortTab) => void
  totalCount: number
}

export default function ExploreSortTabs({ activeTab, onChange, totalCount }: ExploreSortTabsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-text-secondary">
        <span className="font-semibold text-text-primary">{totalCount}</span> cars found
      </p>

      <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-surface p-1">
        {EXPLORE_SORT_TABS.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={[
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition sm:text-sm',
                isActive
                  ? 'bg-brand-accent text-white shadow-sm'
                  : 'text-text-secondary hover:bg-surface-overlay hover:text-text-primary',
              ].join(' ')}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
