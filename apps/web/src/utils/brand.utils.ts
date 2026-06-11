const BRAND_GRADIENTS: Record<string, string> = {
  'maruti suzuki': 'from-blue-600 to-blue-900',
  hyundai: 'from-slate-700 to-slate-950',
  tata: 'from-indigo-700 to-indigo-950',
  toyota: 'from-red-600 to-red-900',
  kia: 'from-orange-600 to-orange-900',
  honda: 'from-rose-600 to-rose-900',
  mahindra: 'from-red-700 to-amber-900',
  mg: 'from-emerald-600 to-emerald-900',
  bmw: 'from-sky-600 to-sky-900',
  mercedes: 'from-zinc-600 to-zinc-900',
  audi: 'from-slate-600 to-slate-900',
  ford: 'from-blue-700 to-blue-950',
}

const FALLBACK_GRADIENTS = [
  'from-brand-primary to-blue-900',
  'from-brand-accent to-indigo-800',
  'from-amber-600 to-orange-800',
  'from-emerald-600 to-teal-800',
  'from-rose-600 to-pink-900',
  'from-violet-600 to-purple-900',
] as const

export function getBrandInitials(make: string): string {
  const words = make.trim().split(/\s+/)
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export function getBrandGradient(make: string, fallbackIndex: number): string {
  const key = make.toLowerCase()
  const match = Object.entries(BRAND_GRADIENTS).find(([brandKey]) => key.includes(brandKey))
  if (match) return match[1]
  return FALLBACK_GRADIENTS[fallbackIndex % FALLBACK_GRADIENTS.length]
}

export function formatModelCount(count: number): string {
  return `${count} model${count === 1 ? '' : 's'}`
}
