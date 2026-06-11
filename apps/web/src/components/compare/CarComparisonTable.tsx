import type { ICar } from '@cardeko/types'
import { Fragment } from 'react'

import CarComparisonHeader from '@/components/compare/CarComparisonHeader'
import { MAX_COMPARE_CARS } from '@/features/compare/compare.constants'
import { buildCompareSections } from '@/features/compare/compare.utils'

interface CarComparisonTableProps {
  cars: ICar[]
}

export default function CarComparisonTable({ cars }: CarComparisonTableProps) {
  const sections = buildCompareSections(cars)
  const columnCount = MAX_COMPARE_CARS + 1

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-sm">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <CarComparisonHeader cars={cars} />
        </thead>
        <tbody>
          {sections.map((section) => (
            <Fragment key={section.title}>
              <tr className="bg-brand-primary/5">
                <td
                  colSpan={columnCount}
                  className="sticky left-0 border-y border-border px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-brand-primary"
                >
                  {section.title}
                </td>
              </tr>
              {section.rows.map((row, rowIndex) => (
                <tr
                  key={`${section.title}-${row.label}`}
                  className={rowIndex % 2 === 0 ? 'bg-surface' : 'bg-surface-raised/60'}
                >
                  <td className="sticky left-0 z-10 border-r border-border bg-inherit px-4 py-3 font-medium text-text-secondary">
                    {row.label}
                  </td>
                  {Array.from({ length: MAX_COMPARE_CARS }).map((_, columnIndex) => {
                    const value = row.values[columnIndex] ?? '—'
                    const isHighlighted = row.highlightIndex === columnIndex

                    return (
                      <td
                        key={`${row.label}-${columnIndex}`}
                        className={[
                          'border-r border-border px-4 py-3 text-center last:border-r-0',
                          isHighlighted
                            ? 'bg-green-50 font-semibold text-status-success'
                            : 'text-text-primary',
                        ].join(' ')}
                      >
                        {value}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
