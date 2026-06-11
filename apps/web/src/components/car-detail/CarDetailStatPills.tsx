import type { ICar } from '@cardeko/types'
import { HiBolt, HiFire, HiShieldCheck, HiUserGroup } from 'react-icons/hi2'

import {
  formatMileageStat,
  formatPowerStat,
  formatSafetyStat,
  formatSeatingStat,
} from '@/features/car-detail/car-detail.utils'

interface CarDetailStatPillsProps {
  car: ICar
}

const STAT_ITEMS = [
  { key: 'mileage', label: 'Mileage', Icon: HiFire, getValue: formatMileageStat },
  { key: 'power', label: 'Power', Icon: HiBolt, getValue: formatPowerStat },
  { key: 'safety', label: 'Safety rating', Icon: HiShieldCheck, getValue: formatSafetyStat },
  { key: 'seats', label: 'Seating', Icon: HiUserGroup, getValue: formatSeatingStat },
] as const

export default function CarDetailStatPills({ car }: CarDetailStatPillsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STAT_ITEMS.map((stat) => {
        const Icon = stat.Icon
        return (
          <div
            key={stat.key}
            className="rounded-xl border border-status-success/20 bg-green-50 px-4 py-3 text-center"
          >
            <div className="mx-auto mb-2 flex size-8 items-center justify-center rounded-lg bg-status-success/15 text-status-success">
              <Icon className="size-4" aria-hidden />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-status-success">
              {stat.label}
            </p>
            <p className="mt-1 text-sm font-bold text-text-primary">{stat.getValue(car)}</p>
          </div>
        )
      })}
    </div>
  )
}
