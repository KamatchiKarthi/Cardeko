import type { BodyType, FuelType } from '@cardeko/types'

const CARD_GRADIENTS = [
  'from-brand-primary to-blue-900',
  'from-brand-accent to-blue-800',
  'from-amber-600 to-orange-800',
  'from-emerald-600 to-teal-800',
] as const

const COLOR_KEYWORDS: { keywords: string[]; gradient: string }[] = [
  { keywords: ['red', 'crimson', 'maroon'], gradient: 'from-red-600 to-red-900' },
  { keywords: ['blue', 'teal', 'navy'], gradient: 'from-blue-600 to-indigo-900' },
  { keywords: ['white', 'pearl', 'arctic', 'platinum'], gradient: 'from-slate-400 to-slate-600' },
  { keywords: ['grey', 'gray', 'silver', 'slate'], gradient: 'from-slate-500 to-slate-800' },
  { keywords: ['black', 'midnight', 'obsidian', 'phantom'], gradient: 'from-zinc-700 to-zinc-950' },
  { keywords: ['green', 'emerald', 'forest', 'olive'], gradient: 'from-emerald-600 to-green-900' },
  { keywords: ['yellow', 'gold', 'amber', 'bronze'], gradient: 'from-amber-500 to-orange-700' },
  { keywords: ['brown', 'bronze', 'khaki', 'copper'], gradient: 'from-amber-800 to-stone-900' },
  { keywords: ['purple', 'violet', 'magenta'], gradient: 'from-purple-600 to-violet-900' },
]

const BODY_TYPE_LABELS: Record<BodyType, string> = {
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

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  petrol: 'Petrol',
  diesel: 'Diesel',
  electric: 'Electric',
  hybrid: 'Hybrid',
  cng: 'CNG',
  lpg: 'LPG',
}

export function formatStartingPrice(priceInr: number): string {
  const lakhs = priceInr / 100_000
  if (lakhs >= 100) {
    return `₹${(lakhs / 100).toFixed(2)} Cr`
  }
  return `₹${lakhs.toFixed(2)} L`
}

export function formatWeeklyViews(views: number): string {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}k views this week`
  }
  return `${views.toLocaleString('en-IN')} views this week`
}

export function formatLaunchDate(launchDate: string): string {
  const date = new Date(launchDate)
  if (Number.isNaN(date.getTime())) return 'Coming soon'
  return `Launching ${date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}`
}

export function formatLaunchDateLabel(launchDate: string | undefined, year: number): string {
  if (launchDate) {
    const date = new Date(launchDate)
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    }
  }
  return `Expected ${year}`
}

export function formatExpectedPriceRange(exShowroom: number, onRoad?: number): string {
  const minLabel = formatStartingPrice(exShowroom)
  const maxPrice = onRoad ?? Math.round(exShowroom * 1.12)
  if (maxPrice <= exShowroom) return minLabel
  return `${minLabel} – ${formatStartingPrice(maxPrice)}`
}

const COLOR_SWATCH_CLASSES = [
  'bg-red-600',
  'bg-blue-600',
  'bg-slate-400',
  'bg-zinc-800',
  'bg-emerald-600',
  'bg-amber-500',
  'bg-orange-700',
  'bg-purple-600',
] as const

export function getColorSwatchClass(colorName: string, fallbackIndex: number): string {
  const normalized = colorName.toLowerCase()
  const match = COLOR_KEYWORDS.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword))
  )
  if (!match) return COLOR_SWATCH_CLASSES[fallbackIndex % COLOR_SWATCH_CLASSES.length]

  if (match.gradient.includes('red')) return 'bg-red-600'
  if (match.gradient.includes('blue') || match.gradient.includes('indigo')) return 'bg-blue-600'
  if (match.gradient.includes('slate-4')) return 'bg-slate-400'
  if (match.gradient.includes('zinc')) return 'bg-zinc-800'
  if (match.gradient.includes('emerald') || match.gradient.includes('green')) return 'bg-emerald-600'
  if (match.gradient.includes('amber-5')) return 'bg-amber-500'
  if (match.gradient.includes('orange') || match.gradient.includes('stone')) return 'bg-orange-700'
  if (match.gradient.includes('purple') || match.gradient.includes('violet')) return 'bg-purple-600'
  return COLOR_SWATCH_CLASSES[fallbackIndex % COLOR_SWATCH_CLASSES.length]
}

export function formatBodyAndFuel(bodyType: BodyType, fuelType: FuelType): string {
  return `${BODY_TYPE_LABELS[bodyType]} · ${FUEL_TYPE_LABELS[fuelType]}`
}

export function getCarCardGradient(colorName: string, fallbackIndex: number): string {
  const normalized = colorName.toLowerCase()
  const match = COLOR_KEYWORDS.find(({ keywords }) =>
    keywords.some((keyword) => normalized.includes(keyword))
  )
  if (match) return match.gradient
  return CARD_GRADIENTS[fallbackIndex % CARD_GRADIENTS.length]
}

export function getCarDisplayName(make: string, model: string): string {
  return `${make} ${model}`
}

export function getPopularityPercent(score: number, maxScore: number): number {
  if (maxScore <= 0) return 0
  return Math.round((score / maxScore) * 100)
}

export function formatTagLabel(tag: string): string {
  return tag
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function getFeaturedTags(tags: string[] | null | undefined, limit = 3): string[] {
  if (!tags || tags.length === 0) return []
  return tags.slice(0, limit)
}

const UNAVAILABLE_IMAGE_HOSTS = ['cdn.cardeko.in']

export function getCarHeroImage(images: string[] | null | undefined): string | null {
  const candidate = images?.[0]?.trim()
  if (!candidate) return null

  try {
    const hostname = new URL(candidate).hostname
    if (UNAVAILABLE_IMAGE_HOSTS.includes(hostname)) return null
  } catch {
    return null
  }

  return candidate
}
