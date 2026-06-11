import type { ICar } from '@cardeko/types'

import Card from '@/components/ui/Card'
import { buildCarSpecSections } from '@/features/car-detail/car-detail.utils'

interface CarFullSpecsProps {
  car: ICar
}

export default function CarFullSpecs({ car }: CarFullSpecsProps) {
  const sections = buildCarSpecSections(car)

  return (
    <Card elevated>
      <h2 className="mb-5 text-lg font-bold text-text-primary">Full specifications</h2>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-text-muted">
              {section.title}
            </h3>
            <dl className="divide-y divide-border rounded-xl border border-border">
              {section.rows.map((row) => (
                <div
                  key={`${section.title}-${row.label}-${row.value}`}
                  className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <dt className="text-sm font-medium text-text-secondary">{row.label}</dt>
                  <dd className="text-sm font-semibold text-text-primary sm:text-right">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </Card>
  )
}
