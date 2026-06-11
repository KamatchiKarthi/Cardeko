import type { BodyType, ExploreFilters, FuelType } from '@cardeko/types'

import ExploreBudgetSlider from '@/components/explore/ExploreBudgetSlider'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import {
  EXPLORE_BODY_TYPE_OPTIONS,
  EXPLORE_DEFAULT_PRICE_MAX,
  EXPLORE_DEFAULT_PRICE_MIN,
  EXPLORE_FUEL_TYPE_OPTIONS,
  EXPLORE_SEATING_OPTIONS,
} from '@/features/explore/explore.constants'

interface ExploreFilterSidebarProps {
  filters: ExploreFilters
  priceRangeMin: number
  priceRangeMax: number
  onChange: (nextFilters: ExploreFilters) => void
  onReset: () => void
}

interface FilterCheckboxGroupProps<T extends string | number> {
  title: string
  options: { value: T; label: string }[]
  selected: T[]
  onToggle: (value: T) => void
}

function FilterCheckboxGroup<T extends string | number>({
  title,
  options,
  selected,
  onToggle,
}: FilterCheckboxGroupProps<T>) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">{title}</p>
      <div className="space-y-2">
        {options.map((option) => {
          const isChecked = selected.includes(option.value)
          return (
            <label
              key={String(option.value)}
              className="flex cursor-pointer items-center gap-2.5 text-sm text-text-secondary"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(option.value)}
                className="size-4 rounded border-border text-brand-accent focus:ring-brand-accent"
              />
              <span className={isChecked ? 'font-medium text-text-primary' : ''}>{option.label}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default function ExploreFilterSidebar({
  filters,
  priceRangeMin,
  priceRangeMax,
  onChange,
  onReset,
}: ExploreFilterSidebarProps) {
  const toggleBodyType = (value: BodyType) => {
    const next = filters.bodyTypes.includes(value)
      ? filters.bodyTypes.filter((item) => item !== value)
      : [...filters.bodyTypes, value]
    onChange({ ...filters, bodyTypes: next })
  }

  const toggleFuelType = (value: FuelType) => {
    const next = filters.fuelTypes.includes(value)
      ? filters.fuelTypes.filter((item) => item !== value)
      : [...filters.fuelTypes, value]
    onChange({ ...filters, fuelTypes: next })
  }

  const toggleSeating = (value: number) => {
    const next = filters.seatingCapacities.includes(value)
      ? filters.seatingCapacities.filter((item) => item !== value)
      : [...filters.seatingCapacities, value]
    onChange({ ...filters, seatingCapacities: next })
  }

  return (
    <Card className="sticky top-24 p-4 sm:p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-bold text-text-primary">Filters</h2>
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
            Budget range
          </p>
          <ExploreBudgetSlider
            priceMin={filters.priceMin}
            priceMax={filters.priceMax}
            rangeMin={priceRangeMin || EXPLORE_DEFAULT_PRICE_MIN}
            rangeMax={priceRangeMax || EXPLORE_DEFAULT_PRICE_MAX}
            onChange={(nextMin, nextMax) =>
              onChange({ ...filters, priceMin: nextMin, priceMax: nextMax })
            }
          />
        </div>

        <FilterCheckboxGroup
          title="Body type"
          options={EXPLORE_BODY_TYPE_OPTIONS}
          selected={filters.bodyTypes}
          onToggle={toggleBodyType}
        />

        <FilterCheckboxGroup
          title="Fuel type"
          options={EXPLORE_FUEL_TYPE_OPTIONS}
          selected={filters.fuelTypes}
          onToggle={toggleFuelType}
        />

        <FilterCheckboxGroup
          title="Seating"
          options={EXPLORE_SEATING_OPTIONS}
          selected={filters.seatingCapacities}
          onToggle={toggleSeating}
        />
      </div>
    </Card>
  )
}
