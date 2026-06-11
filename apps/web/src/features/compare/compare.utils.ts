import type { ICar } from '@cardeko/types'

import { FUEL_TYPE_LABELS, formatStartingPrice } from '@/utils/car.utils'

const BODY_TYPE_LABELS: Record<string, string> = {
  sedan: 'Sedan',
  suv: 'SUV',
  hatchback: 'Hatchback',
  coupe: 'Coupe',
  convertible: 'Convertible',
  truck: 'Truck',
  van: 'Van',
  wagon: 'Wagon',
  minivan: 'MUV',
  crossover: 'Crossover',
}

export interface CompareRow {
  label: string
  values: string[]
  highlightIndex: number | null
  compareMode: 'lower' | 'higher' | 'none'
}

export interface CompareSection {
  title: string
  rows: CompareRow[]
}

type CompareFieldDef = {
  label: string
  getValue: (car: ICar) => string | null
  compareMode: CompareRow['compareMode']
  numericGet?: (car: ICar) => number | null
}

function formatOptional(value: string | number | null | undefined, suffix = ''): string | null {
  if (value === null || value === undefined || value === '') return null
  return `${value}${suffix}`
}

function pickHighlightIndex(
  cars: ICar[],
  numericGet: (car: ICar) => number | null,
  mode: 'lower' | 'higher'
): number | null {
  const numbers = cars.map(numericGet)
  const valid = numbers
    .map((value, index) => ({ value, index }))
    .filter((entry): entry is { value: number; index: number } => entry.value !== null)

  if (valid.length < 2) return null

  const best = valid.reduce((winner, entry) => {
    if (mode === 'lower') return entry.value < winner.value ? entry : winner
    return entry.value > winner.value ? entry : winner
  })

  const isUniqueBest = valid.filter((entry) => entry.value === best.value).length === 1
  return isUniqueBest ? best.index : null
}

function buildRows(cars: ICar[], fields: CompareFieldDef[]): CompareRow[] {
  return fields
    .map((field) => {
      const values = cars.map((car) => field.getValue(car) ?? '—')
      const hasAnyValue = values.some((value) => value !== '—')
      if (!hasAnyValue) return null

      const highlightIndex =
        field.compareMode !== 'none' && field.numericGet
          ? pickHighlightIndex(cars, field.numericGet, field.compareMode)
          : null

      return {
        label: field.label,
        values,
        highlightIndex,
        compareMode: field.compareMode,
      }
    })
    .filter((row): row is CompareRow => row !== null)
}

export function buildCompareSections(cars: ICar[]): CompareSection[] {
  const sections: { title: string; fields: CompareFieldDef[] }[] = [
    {
      title: 'Key specs',
      fields: [
        {
          label: 'Ex-showroom price',
          getValue: (car) => formatStartingPrice(car.priceExShowroom),
          compareMode: 'lower',
          numericGet: (car) => car.priceExShowroom,
        },
        {
          label: 'On-road price',
          getValue: (car) => (car.priceOnRoad ? formatStartingPrice(car.priceOnRoad) : null),
          compareMode: 'lower',
          numericGet: (car) => car.priceOnRoad ?? null,
        },
        {
          label: 'Body type',
          getValue: (car) => BODY_TYPE_LABELS[car.bodyType] ?? car.bodyType,
          compareMode: 'none',
        },
        {
          label: 'Fuel type',
          getValue: (car) => FUEL_TYPE_LABELS[car.fuelType],
          compareMode: 'none',
        },
        {
          label: 'Transmission',
          getValue: (car) => car.transmission.toUpperCase(),
          compareMode: 'none',
        },
        {
          label: 'Drivetrain',
          getValue: (car) => car.drivetrain.toUpperCase(),
          compareMode: 'none',
        },
        {
          label: 'Seating',
          getValue: (car) => `${car.seatingCapacity} seats`,
          compareMode: 'higher',
          numericGet: (car) => car.seatingCapacity,
        },
        {
          label: 'Year',
          getValue: (car) => String(car.year),
          compareMode: 'higher',
          numericGet: (car) => car.year,
        },
      ],
    },
    {
      title: 'Engine & performance',
      fields: [
        {
          label: 'Engine',
          getValue: (car) =>
            car.fuelType === 'electric'
              ? 'Electric motor'
              : formatOptional(car.engineDisplacementCc, ' cc'),
          compareMode: 'none',
        },
        {
          label: 'Power',
          getValue: (car) => formatOptional(car.powerBhp, ' BHP'),
          compareMode: 'higher',
          numericGet: (car) => car.powerBhp ?? null,
        },
        {
          label: 'Torque',
          getValue: (car) => formatOptional(car.torqueNm, ' Nm'),
          compareMode: 'higher',
          numericGet: (car) => car.torqueNm ?? null,
        },
        {
          label: '0–100 km/h',
          getValue: (car) => formatOptional(car.acceleration0to100Sec, ' sec'),
          compareMode: 'lower',
          numericGet: (car) => car.acceleration0to100Sec ?? null,
        },
        {
          label: 'Top speed',
          getValue: (car) => formatOptional(car.topSpeedKph, ' km/h'),
          compareMode: 'higher',
          numericGet: (car) => car.topSpeedKph ?? null,
        },
        {
          label: 'Battery',
          getValue: (car) => formatOptional(car.batteryKwh, ' kWh'),
          compareMode: 'higher',
          numericGet: (car) => car.batteryKwh ?? null,
        },
        {
          label: 'Electric range',
          getValue: (car) => formatOptional(car.electricRangeKm, ' km'),
          compareMode: 'higher',
          numericGet: (car) => car.electricRangeKm ?? null,
        },
      ],
    },
    {
      title: 'Mileage & efficiency',
      fields: [
        {
          label: 'City mileage',
          getValue: (car) => formatOptional(car.mileageCityKmpl, ' kmpl'),
          compareMode: 'higher',
          numericGet: (car) => car.mileageCityKmpl ?? null,
        },
        {
          label: 'Highway mileage',
          getValue: (car) => formatOptional(car.mileageHighwayKmpl, ' kmpl'),
          compareMode: 'higher',
          numericGet: (car) => car.mileageHighwayKmpl ?? null,
        },
        {
          label: 'Combined mileage',
          getValue: (car) => formatOptional(car.mileageCombinedKmpl, ' kmpl'),
          compareMode: 'higher',
          numericGet: (car) => car.mileageCombinedKmpl ?? null,
        },
        {
          label: 'Fuel tank',
          getValue: (car) => formatOptional(car.fuelTankLitres, ' L'),
          compareMode: 'higher',
          numericGet: (car) => car.fuelTankLitres ?? null,
        },
      ],
    },
    {
      title: 'Dimensions',
      fields: [
        {
          label: 'Length',
          getValue: (car) => formatOptional(car.lengthMm, ' mm'),
          compareMode: 'none',
        },
        {
          label: 'Width',
          getValue: (car) => formatOptional(car.widthMm, ' mm'),
          compareMode: 'none',
        },
        {
          label: 'Height',
          getValue: (car) => formatOptional(car.heightMm, ' mm'),
          compareMode: 'none',
        },
        {
          label: 'Wheelbase',
          getValue: (car) => formatOptional(car.wheelbaseMm, ' mm'),
          compareMode: 'higher',
          numericGet: (car) => car.wheelbaseMm ?? null,
        },
        {
          label: 'Ground clearance',
          getValue: (car) => formatOptional(car.groundClearanceMm, ' mm'),
          compareMode: 'higher',
          numericGet: (car) => car.groundClearanceMm ?? null,
        },
        {
          label: 'Boot space',
          getValue: (car) => formatOptional(car.bootSpaceLitres, ' L'),
          compareMode: 'higher',
          numericGet: (car) => car.bootSpaceLitres ?? null,
        },
        {
          label: 'Kerb weight',
          getValue: (car) => formatOptional(car.kerbWeightKg, ' kg'),
          compareMode: 'lower',
          numericGet: (car) => car.kerbWeightKg ?? null,
        },
      ],
    },
    {
      title: 'Safety',
      fields: [
        {
          label: 'Safety rating',
          getValue: (car) =>
            car.safetyRatingStars ? `${car.safetyRatingStars} / 5` : null,
          compareMode: 'higher',
          numericGet: (car) => car.safetyRatingStars ?? null,
        },
        {
          label: 'Rating agency',
          getValue: (car) => car.safetyRatingAgency ?? null,
          compareMode: 'none',
        },
        {
          label: 'Airbags',
          getValue: (car) => formatOptional(car.airbagCount),
          compareMode: 'higher',
          numericGet: (car) => car.airbagCount ?? null,
        },
      ],
    },
    {
      title: 'Features',
      fields: [
        {
          label: 'Feature count',
          getValue: (car) => String(car.features.length),
          compareMode: 'higher',
          numericGet: (car) => car.features.length,
        },
        {
          label: 'ADAS features',
          getValue: (car) => String(car.adasFeatures.length),
          compareMode: 'higher',
          numericGet: (car) => car.adasFeatures.length,
        },
        {
          label: 'Top features',
          getValue: (car) => (car.features.length > 0 ? car.features.slice(0, 4).join(', ') : null),
          compareMode: 'none',
        },
      ],
    },
  ]

  return sections
    .map((section) => ({
      title: section.title,
      rows: buildRows(cars, section.fields),
    }))
    .filter((section) => section.rows.length > 0)
}
